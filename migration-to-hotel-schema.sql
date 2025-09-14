-- ----------------------------------------------------------------------
-- 🚀 MIGRATION SCRIPT: From General Booking to Hotel Booking Schema
-- ----------------------------------------------------------------------
-- 
-- IMPORTANT: This script will DROP your existing tables and recreate them
-- with the new hotel booking schema. Make sure to backup your data first!
--
-- Steps to migrate:
-- 1. Export your existing data (if any)
-- 2. Run this migration script
-- 3. Import your data into the new schema (if needed)
-- 4. Update your application code to use the new schema
--
-- ----------------------------------------------------------------------

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS public.booking_requests CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_custom ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Now run the new hotel booking schema
-- (The content from supabase-schema-hotel.sql will be inserted here)

-- ----------------------------------------------------------------------
-- 🏨 HOTEL BOOKING APP DATABASE SCHEMA
-- ----------------------------------------------------------------------

-- ----------------------------------------------------------------------
-- 1️⃣  Profiles table (extends auth.users)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'HOTEL_MANAGER')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 2️⃣  Countries table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- ISO country code (e.g., 'US', 'GB', 'FR')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 3️⃣  Cities table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, country_id)
);

-- ----------------------------------------------------------------------
-- 4️⃣  Hotels table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  phone TEXT,
  email TEXT,
  website TEXT,
  check_in_time TIME DEFAULT '15:00',
  check_out_time TIME DEFAULT '11:00',
  is_active BOOLEAN DEFAULT TRUE,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 5️⃣  Hotel images table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotel_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 6️⃣  Amenities table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT, -- Icon class or URL
  category TEXT, -- e.g., 'general', 'room', 'dining', 'recreation'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 7️⃣  Hotel amenities junction table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotel_amenities (
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (hotel_id, amenity_id)
);

-- ----------------------------------------------------------------------
-- 8️⃣  Room types table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'Standard Room', 'Deluxe Suite'
  description TEXT,
  max_occupancy INTEGER NOT NULL,
  bed_type TEXT, -- e.g., 'King', 'Queen', 'Twin'
  size_sqm DECIMAL(8,2), -- Room size in square meters
  base_price_per_night DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 9️⃣  Room type images table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.room_type_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 🔟  Room type amenities junction table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.room_type_amenities (
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_type_id, amenity_id)
);

-- ----------------------------------------------------------------------
-- 1️⃣1️⃣  Rooms table (individual room instances)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hotel_id, room_number)
);

-- ----------------------------------------------------------------------
-- 1️⃣2️⃣  Bookings table (hotel reservations)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL CHECK (num_guests > 0),
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed' 
    CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  special_requests TEXT,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (check_out_date > check_in_date)
);

-- ----------------------------------------------------------------------
-- 1️⃣3️⃣  Booking rooms table (specific room assignments)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, room_id)
);

-- ----------------------------------------------------------------------
-- 1️⃣4️⃣  Reviews table
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE, -- Verified booking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id) -- One review per booking
);

-- ----------------------------------------------------------------------
-- 1️⃣5️⃣  Pricing rules table (for dynamic pricing)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_multiplier DECIMAL(3,2) DEFAULT 1.00, -- e.g., 1.50 for 50% increase
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date >= start_date),
  CHECK (price_multiplier > 0)
);

-- ----------------------------------------------------------------------
-- 1️⃣6️⃣  Enable RLS on all tables
-- ----------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_type_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_type_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------
-- 1️⃣7️⃣  RLS Policies
-- ----------------------------------------------------------------------

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Countries and Cities policies (read-only for all)
CREATE POLICY "Anyone can view countries" ON public.countries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view cities" ON public.cities
  FOR SELECT USING (true);

-- Hotels policies
CREATE POLICY "Anyone can view active hotels" ON public.hotels
  FOR SELECT USING (is_active = true);

CREATE POLICY "Hotel managers can manage their hotels" ON public.hotels
  FOR ALL USING (
    auth.uid() = manager_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
    )
  );

-- Hotel images policies
CREATE POLICY "Anyone can view hotel images" ON public.hotel_images
  FOR SELECT USING (true);

CREATE POLICY "Hotel managers can manage hotel images" ON public.hotel_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Amenities policies
CREATE POLICY "Anyone can view amenities" ON public.amenities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage amenities" ON public.amenities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Hotel amenities policies
CREATE POLICY "Anyone can view hotel amenities" ON public.hotel_amenities
  FOR SELECT USING (true);

CREATE POLICY "Hotel managers can manage hotel amenities" ON public.hotel_amenities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Room types policies
CREATE POLICY "Anyone can view active room types" ON public.room_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Hotel managers can manage room types" ON public.room_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Room type images policies
CREATE POLICY "Anyone can view room type images" ON public.room_type_images
  FOR SELECT USING (true);

CREATE POLICY "Hotel managers can manage room type images" ON public.room_type_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.room_types rt
      JOIN public.hotels h ON h.id = rt.hotel_id
      WHERE rt.id = room_type_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Room type amenities policies
CREATE POLICY "Anyone can view room type amenities" ON public.room_type_amenities
  FOR SELECT USING (true);

CREATE POLICY "Hotel managers can manage room type amenities" ON public.room_type_amenities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.room_types rt
      JOIN public.hotels h ON h.id = rt.hotel_id
      WHERE rt.id = room_type_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Rooms policies
CREATE POLICY "Hotel managers can view rooms" ON public.rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

CREATE POLICY "Hotel managers can manage rooms" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Hotel managers can view hotel bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

CREATE POLICY "Hotel managers can update hotel bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Booking rooms policies
CREATE POLICY "Users can view their booking rooms" ON public.booking_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotel managers can manage booking rooms" ON public.booking_rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.hotels h ON h.id = b.hotel_id
      WHERE b.id = booking_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Pricing rules policies
CREATE POLICY "Anyone can view active pricing rules" ON public.pricing_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Hotel managers can manage pricing rules" ON public.pricing_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (
        h.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('ADMIN', 'HOTEL_MANAGER')
        )
      )
    )
  );

-- ----------------------------------------------------------------------
-- 1️⃣8️⃣  Helper functions & triggers
-- ----------------------------------------------------------------------

-- Populate a profile when a new auth user appears
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_custom
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto‑update the `updated_at` column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at
  BEFORE UPDATE ON public.room_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate distance between two points (for location-based sorting)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN 6371 * acos(
    cos(radians(lat1)) * cos(radians(lat2)) * 
    cos(radians(lon2) - radians(lon1)) + 
    sin(radians(lat1)) * sin(radians(lat2))
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get available rooms for a date range
CREATE OR REPLACE FUNCTION public.get_available_rooms(
  p_hotel_id UUID,
  p_room_type_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS TABLE(room_id UUID, room_number TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.room_number
  FROM public.rooms r
  WHERE r.hotel_id = p_hotel_id
    AND r.room_type_id = p_room_type_id
    AND r.is_active = true
    AND r.id NOT IN (
      SELECT br.room_id
      FROM public.booking_rooms br
      JOIN public.bookings b ON b.id = br.booking_id
      WHERE b.status NOT IN ('cancelled', 'no_show')
        AND NOT (b.check_out_date <= p_check_in OR b.check_in_date >= p_check_out)
    );
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------
-- 1️⃣9️⃣  Indexes for performance
-- ----------------------------------------------------------------------

-- Location-based indexes
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON public.cities(country_id);
CREATE INDEX IF NOT EXISTS idx_hotels_city_id ON public.hotels(city_id);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON public.hotels(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hotels_active ON public.hotels(is_active);

-- Booking-related indexes
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_rooms_booking_id ON public.booking_rooms(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_rooms_room_id ON public.booking_rooms(room_id);

-- Room type indexes
CREATE INDEX IF NOT EXISTS idx_room_types_hotel_id ON public.room_types(hotel_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON public.room_types(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON public.reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Pricing rule indexes
CREATE INDEX IF NOT EXISTS idx_pricing_rules_hotel_id ON public.pricing_rules(hotel_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_dates ON public.pricing_rules(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON public.pricing_rules(is_active);

-- ----------------------------------------------------------------------
-- 2️⃣0️⃣  Sample data (optional - remove in production)
-- ----------------------------------------------------------------------

-- Insert sample countries
INSERT INTO public.countries (id, name, code) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'United States', 'US'),
  ('550e8400-e29b-41d4-a716-446655440002', 'United Kingdom', 'GB'),
  ('550e8400-e29b-41d4-a716-446655440003', 'France', 'FR'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Japan', 'JP')
ON CONFLICT (code) DO NOTHING;

-- Insert sample cities
INSERT INTO public.cities (id, name, country_id, latitude, longitude) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'New York', '550e8400-e29b-41d4-a716-446655440001', 40.7128, -74.0060),
  ('660e8400-e29b-41d4-a716-446655440002', 'London', '550e8400-e29b-41d4-a716-446655440002', 51.5074, -0.1278),
  ('660e8400-e29b-41d4-a716-446655440003', 'Paris', '550e8400-e29b-41d4-a716-446655440003', 48.8566, 2.3522),
  ('660e8400-e29b-41d4-a716-446655440004', 'Tokyo', '550e8400-e29b-41d4-a716-446655440004', 35.6762, 139.6503)
ON CONFLICT (name, country_id) DO NOTHING;

-- Insert sample amenities
INSERT INTO public.amenities (id, name, icon, category) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Free WiFi', 'wifi', 'general'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Swimming Pool', 'pool', 'recreation'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Fitness Center', 'fitness', 'recreation'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Restaurant', 'restaurant', 'dining'),
  ('770e8400-e29b-41d4-a716-446655440005', 'Parking', 'parking', 'general'),
  ('770e8400-e29b-41d4-a716-446655440006', 'Air Conditioning', 'ac', 'room'),
  ('770e8400-e29b-41d4-a716-446655440007', 'Mini Bar', 'minibar', 'room'),
  ('770e8400-e29b-41d4-a716-446655440008', 'Room Service', 'room-service', 'dining')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------
-- ✅ MIGRATION COMPLETE
-- ----------------------------------------------------------------------
-- 
-- Your database has been successfully migrated to the hotel booking schema!
-- 
-- Next steps:
-- 1. Update your TypeScript types in src/types/index.ts
-- 2. Update your API routes to work with the new schema
-- 3. Update your frontend components to use the new data structure
-- 4. Test the new functionality
--
-- Key changes from the old schema:
-- - Added countries, cities, hotels, room types, rooms tables
-- - Enhanced bookings table with hotel-specific fields
-- - Added amenities, images, reviews, and pricing rules
-- - Improved location-based sorting capabilities
-- - Added hotel manager role for better access control
--
-- ----------------------------------------------------------------------
