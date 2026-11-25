-- Add house column to profiles table for random assignment on first login
-- Houses: gryffindor, slytherin, ravenclaw, hufflepuff

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS house TEXT CHECK (house IN ('gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_house ON profiles(house);

-- Add updated_at column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a trigger to automatically update the updated_at timestamp
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
