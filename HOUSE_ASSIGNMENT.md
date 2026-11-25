# House Assignment System

## Overview

Technika '27 features an automated house assignment system that randomly assigns users to one of four houses on their first login:

- **Gryffindor**: Courage, daring, determination
- **Hufflepuff**: Loyalty, patience, heart  
- **Ravenclaw**: Wit, wisdom, wonder
- **Slytherin**: Ambition, resourcefulness, resolve

## How It Works

### 1. **First Login**
When a user authenticates for the first time:
1. The auth provider checks if `profiles.house` is `NULL`
2. If NULL, `assignHouseIfUnassigned()` is called automatically
3. A random house is selected from the 4 selectable houses
4. The assignment is saved to Supabase `profiles.house` column

### 2. **Subsequent Logins**
On subsequent logins, the existing house assignment is loaded from the database and applied.

### 3. **House Themes**
Once assigned, the user's house theme colors and styling are applied globally:
- All pages use `data-house` attribute for house-specific styling
- House colors defined in `src/lib/houses.ts`
- Logo and icon updated to match the house

## Files

### Core Implementation

| File | Purpose |
|------|---------|
| `src/lib/assign-house.ts` | Assignment logic, random selection, Supabase integration |
| `src/hooks/useHouseAssignment.ts` | React hook for components to access house assignment |
| `src/components/house-assignment-status.tsx` | UI component showing current house + test reassignment |
| `src/components/auth-provider.tsx` | Modified to trigger assignment on first login |
| `supabase/migrations/add_house_to_profiles.sql` | Database migration to add house column |

### Configuration

| File | Contains |
|------|----------|
| `src/lib/houses.ts` | House definitions, themes, branding |
| `src/lib/common-room/types.ts` | Types for house-based features |
| `src/lib/common-room/config.ts` | 3D room configs per house |

## Supabase Setup

### Migration
Run this SQL in your Supabase SQL Editor to create the necessary schema:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS house TEXT CHECK (house IN ('gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'));

CREATE INDEX IF NOT EXISTS idx_profiles_house ON profiles(house);

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();
```

Alternatively, run via CLI:
```bash
supabase db push
```

### RLS Policy (Optional)
If you want to restrict house reads/writes:

```sql
-- Users can read their own house
CREATE POLICY "Users can read own house" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users cannot modify their own house (admin only)
CREATE POLICY "Only admins can modify house" ON profiles
  FOR UPDATE USING (false);
```

## Usage in Components

### Hook
```tsx
import { useHouseAssignment } from "@/hooks/useHouseAssignment";

export function MyComponent() {
  const { status, house, reassign } = useHouseAssignment();

  if (status === "loading") return <div>Loading house...</div>;
  if (status === "error") return <div>Error: {error}</div>;

  return (
    <div>
      <p>Your house: {house}</p>
      <button onClick={() => reassign()}>Reassign</button>
    </div>
  );
}
```

### Component
```tsx
import { HouseAssignmentStatus } from "@/components/house-assignment-status";

export default function Account() {
  return (
    <div>
      <h1>My Account</h1>
      <HouseAssignmentStatus />
    </div>
  );
}
```

### Direct Function
```tsx
import { assignHouseIfUnassigned, reassignHouse } from "@/lib/assign-house";

// Auto-assign if null
const { house, error } = await assignHouseIfUnassigned(userId);

// Force reassignment
const result = await reassignHouse(userId, "gryffindor");
```

## House Context

The `useHouse()` hook (from `house-provider`) is available globally and returns:
- `house: House` - Current house (gryffindor, hufflepuff, ravenclaw, slytherin, or default)
- `setHouse(house)` - Change house (rarely needed, mostly for auth flow)

## Styling per House

### CSS
```css
[data-house="gryffindor"] { /* Crimson/Gold */ }
[data-house="hufflepuff"] { /* Yellow/Black */ }
[data-house="ravenclaw"] { /* Blue/Bronze */ }
[data-house="slytherin"] { /* Green/Silver */ }
```

### Theme Variables
Access house theme in code:
```tsx
import { houseThemes } from "@/lib/houses";

const theme = houseThemes["gryffindor"];
// { name, motto, quality, initial, accent, deep, flag, second }
```

## Testing

### Local Testing
1. Sign in with test account
2. Component `<HouseAssignmentStatus />` shows current house
3. Click "Reassign House" to test different houses
4. Refresh page - house persists
5. Sign out and back in - house still there

### Database Check
```sql
SELECT id, email, house FROM profiles WHERE house IS NOT NULL;
```

## Troubleshooting

### House not assigned
- **Check 1:** `profiles.house` column exists (run migration)
- **Check 2:** `assignHouseIfUnassigned()` has network access to Supabase
- **Check 3:** User profile row exists (should be created on signup)

### House not persisting
- **Check 1:** `updated_at` trigger is working (should auto-update)
- **Check 2:** Supabase RLS policy allows updates (if enabled)
- **Check 3:** Browser localStorage is not interfering (`HOUSE_STORAGE_KEY`)

### Wrong house displaying
- **Check 1:** Clear browser cache / localStorage
- **Check 2:** Check `houseFromValue()` normalization in `src/lib/houses.ts`
- **Check 3:** Restart dev server to clear cache

## Future Enhancements

- [ ] User preference in account settings (override randomness)
- [ ] House-based chat channels in common room
- [ ] House points leaderboard (gamification)
- [ ] House-specific quests/achievements
- [ ] House traditions/lore expanded UI
- [ ] House mascot animations on profile
