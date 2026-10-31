-- Profiles table: stores user details and house assignment.
-- Linked to auth.users so rows are cascade-deleted when the auth user is removed.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  college text,
  phone text,
  house text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Anyone can read profiles for sorting and directory" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Anyone authenticated or public can read profiles (needed for balanced house distribution count & common room)
create policy "Anyone can read profiles for sorting and directory"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- PostgreSQL function for Atomic Balanced House Assignment
-- Checks current counts across the 4 houses, finds the least-populated house(s),
-- breaks ties with random selection, and assigns the house to the user's profile.
create or replace function public.assign_balanced_house(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_house text;
  v_assigned_house text;
begin
  -- 1. Check if user already has a valid house assigned
  select house into v_current_house
  from public.profiles
  where id = p_user_id;

  if v_current_house is not null and v_current_house in ('gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff') then
    return v_current_house;
  end if;

  -- 2. Count active assignments across the four canonical houses
  with canonical_houses as (
    select unnest(array['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff']) as house_name
  ),
  house_counts as (
    select
      ch.house_name,
      count(p.id) as total_members
    from canonical_houses ch
    left join public.profiles p on p.house = ch.house_name
    group by ch.house_name
  ),
  min_stat as (
    select min(total_members) as min_count from house_counts
  ),
  candidates as (
    select hc.house_name
    from house_counts hc, min_stat ms
    where hc.total_members = ms.min_count
  )
  -- Pick randomly from the houses with the lowest member count (for perfectly even distribution)
  select house_name into v_assigned_house
  from candidates
  order by random()
  limit 1;

  -- Fallback if table was unpopulated or edge case
  if v_assigned_house is null then
    v_assigned_house := (array['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'])[floor(random() * 4 + 1)];
  end if;

  -- 3. Upsert user's profile with the chosen house
  insert into public.profiles (id, house, updated_at)
  values (p_user_id, v_assigned_house, timezone('utc', now()))
  on conflict (id) do update
  set house = excluded.house,
      updated_at = timezone('utc', now());

  return v_assigned_house;
end;
$$;
