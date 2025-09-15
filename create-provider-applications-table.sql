-- Create provider_applications table for hotel onboarding
CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  
  -- Hotel basic info
  hotel_name VARCHAR(255) NOT NULL,
  hotel_description TEXT,
  hotel_street VARCHAR(255) NOT NULL,
  hotel_city VARCHAR(100) NOT NULL,
  hotel_state VARCHAR(100) NOT NULL,
  hotel_country VARCHAR(100) NOT NULL,
  hotel_zip_code VARCHAR(20) NOT NULL,
  hotel_phone VARCHAR(50),
  hotel_email VARCHAR(255),
  
  -- Room setup
  number_of_room_types INTEGER NOT NULL,
  total_number_of_rooms INTEGER NOT NULL,
  hotel_amenities TEXT[] DEFAULT '{}',
  
  -- Room types (stored as JSON for flexibility)
  room_types JSONB NOT NULL,
  
  -- Admin notes
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS provider_applications_user_id_idx ON provider_applications(user_id);
CREATE INDEX IF NOT EXISTS provider_applications_status_idx ON provider_applications(status);
CREATE INDEX IF NOT EXISTS provider_applications_created_at_idx ON provider_applications(created_at);

-- Enable RLS
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own applications" ON provider_applications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own applications" ON provider_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own pending applications" ON provider_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admin policies (for admin users)
CREATE POLICY "Admins can view all applications" ON provider_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update all applications" ON provider_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'ADMIN'
    )
  );
