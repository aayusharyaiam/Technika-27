# Technika '27 Development Progress

## ✅ COMPLETED (Agents 1, 2, 5)

### Agent 1: Contact Form Visibility + Supabase Integration
- **Fixed visibility bug**: Added `color: var(--fg-strong)` to `.owl-letter > p` CSS
- **Created ContactForm component** (`src/components/contact-form.tsx`)
  - Form validation (email, name, category, message required)
  - Supabase integration to `contact_submissions` table
  - Success/error messaging
  - Three category options: participation, college-delegation, partnership, visit, other
- **Updated Contact page** to include functional form
- **Added form styling** for dark backgrounds with proper visibility

**Supabase Setup Required:**
```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' -- new, read, resolved
);
```

---

### Agent 2: Alumni Data Fetching + Phone Validation

#### Phone Validation Functions
- `validatePhoneNumber(phone)` - Accepts digits, spaces, hyphens, +, parentheses
- `sanitizePhoneNumber(phone)` - Strips to digits only for storage
- `getPhoneValidationError(phone)` - User-friendly error messages
  - Requires at least 7 digits
  - Only allows valid characters

#### Alumni Registry Enhancements
- Added `saveAlumniRegistration(userId, data)` - Saves to `profiles` and `alumni_registrations` tables
- Updated status: `registration.status = "available"` (was unavailable)
- Exported reusable `ParticipantRegistration` type for event registration

**Supabase Setup Required:**
```sql
-- Create alumni_registrations table (for event reuse)
CREATE TABLE alumni_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL, -- stored as digits only
  year_of_passing TEXT NOT NULL,
  merchandise_size TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ON alumni_registrations(user_id);

-- Add columns to profiles table (if not exists)
ALTER TABLE profiles ADD COLUMN phone TEXT;
ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

---

### Agent 5: Events Data + Mobile Optimization + Animation Timing

#### Events Data Structure (`src/lib/events-data.ts`)
- **39 total events** extracted from KKKK29.xlsx
- **5 categories:**
  - Technical (13 events): Hackathon, Competitive Programming, Ampere Assemble, Robo War, Robo Soccer, Robo Race, Tall Tower, Bridge the Gap, Startup Sphere, Innovation Lab, Code Quest, Web Dev Sprint, Data Science Challenge
  - Cultural (12 events): Band Performance, Dance, Singing, Drama, Fashion Show, Poetry, Stand-up Comedy, Debate, Quiz, Open Mic, Cultural Kaleidoscope, Talent Hunt
  - E-sports (8 events): VALORANT, CS:GO, Mobile Gaming, DOTA 2, FIFA, Tekken, Among Us, Gaming Quiz
  - Art & Craft (3 events): Painting, Sculpture, Craft & Design
  - Frame & Focus (3 events): Photography, Videography, Digital Storytelling

**Utility Functions:**
- `getEventsByCategory(category)` - Filter events
- `getEventById(id)` - Find single event
- `getEventStats()` - Return counts by category

#### Mobile Optimization
Added responsive CSS at breakpoints:
- **768px and below:** 
  - Form responsive layout
  - Font-size 16px to prevent iOS zoom
  - Proper padding and spacing
  
- **640px and below (mobile):**
  - Full-width forms with 20px padding
  - Minimum 48px touch target height for buttons
  - Owl-letter responsive: 24px h2, 11px p
  - Owlery-grid: 1 column layout
  - Owl-art: reduced min-height to 300px

- **360px and below (small phone):**
  - Tighter padding (16px)
  - Smaller heading (18px)
  - Button text 12px

#### Animation Timing
- **Slowed home page intro animation:** 1.67s → 5s
- Changed `INTRO_FPS` from 30 to 10 FPS
- Result: Frame sequence now plays at 10fps × 50 frames = 5 seconds
- Better visibility on first page load

---

## ⏳ PENDING (Agents 3, 4)

### Agent 3: House Color Assignment + BIT Patna Free Registration

**What needs doing:**
1. Add `house` column to `profiles` table (enum or text: Gryffindor, Hufflepuff, Ravenclaw, Slytherin)
2. Create `useHouseAssignment()` hook to:
   - Check if `profiles.house` is NULL on user load
   - If NULL, randomly assign a house and update Supabase
   - Return house name and color CSS class
3. Implement free registration for BIT Patna students:
   - Check email domain: `@bitpatna.ac.in` → skip payment
   - Block BIT Mesra students (pattern: `15XXX.23` in email) → show message
4. Update registration page (`src/app/delegate-registration/page.tsx`) with email validation
5. Store house color class in component for display across pages

**Supabase Setup:**
```sql
ALTER TABLE profiles ADD COLUMN house TEXT CHECK (house IN ('Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'));

-- Function to assign house on first login (or use hook)
CREATE OR REPLACE FUNCTION assign_house_on_first_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.house IS NULL THEN
    NEW.house = (
      ARRAY['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']
    )[floor(random() * 4) + 1];
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_house_assignment
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION assign_house_on_first_login();
```

---

### Agent 4: Privacy Policy Page + Coming Soon Page Fixes

**What needs doing:**
1. Create `src/app/privacy-policy/page.tsx` with:
   - Same structure as T&C page
   - Privacy policy content (get from user or use GDPR template)
   - Breadcrumb schema
   - "Return to castle" link
   - Last updated date
   
2. Add footer links for both T&C and Privacy Policy

3. Audit "coming soon" pages for consistency:
   - Alumni page ✓ (has content)
   - Events page (should show event list with real data)
   - Contact page ✓ (has form)
   - Other pages with `.parchment-sheet` or `.owl-letter` styling

4. Ensure all legal pages have:
   - Proper heading hierarchy
   - Consistent styling
   - Navigation between T&C ↔ Privacy Policy

---

## 🗄️ Supabase Tables Needed

### contact_submissions
```
- id (UUID, PK)
- name (TEXT)
- email (TEXT)
- category (TEXT)
- message (TEXT)
- created_at (TIMESTAMP)
- status (TEXT: new, read, resolved)
```

### alumni_registrations
```
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- full_name (TEXT)
- email (TEXT)
- phone (TEXT, digits only)
- year_of_passing (TEXT)
- merchandise_size (TEXT)
- registered_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### profiles (UPDATE)
```
ADD COLUMN phone (TEXT)
ADD COLUMN house (TEXT: Gryffindor, Hufflepuff, Ravenclaw, Slytherin)
ADD COLUMN updated_at (TIMESTAMP)
```

---

## 📋 TODO Summary

| Task | Status | Agents |
|------|--------|--------|
| Contact form visibility ✓ | ✅ DONE | 1 |
| Contact form → Supabase ✓ | ✅ DONE | 1 |
| Alumni phone validation ✓ | ✅ DONE | 2 |
| Alumni data fetching setup ✓ | ✅ DONE | 2 |
| Events data loaded ✓ | ✅ DONE | 5 |
| Mobile optimization ✓ | ✅ DONE | 5 |
| Animation slowed ✓ | ✅ DONE | 5 |
| House assignment | ⏳ PENDING | 3 |
| BIT Patna free registration | ⏳ PENDING | 3 |
| Privacy Policy page | ⏳ PENDING | 4 |
| Coming soon pages fixed | ⏳ PENDING | 4 |
| Email confirmation | ⏭️ SKIPPED | - |
| Register ↔ Sign out button | ⏭️ SKIPPED | - |

---

## 🚀 Last Commit
```
feat: contact form visibility, alumni validation, events data, mobile optimization, animation timing
- Fixed .owl-letter paragraph visibility
- Created ContactForm component with Supabase integration
- Added phone validation utilities
- Implemented saveAlumniRegistration function
- Created 39-event data structure from Excel
- Slowed animation 1.67s → 5s
- Added comprehensive mobile CSS (640px & 360px)
```

**Next:** Deploy Agents 3 & 4 or proceed with event pages implementation.
