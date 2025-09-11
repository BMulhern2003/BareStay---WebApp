-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    seats INTEGER NOT NULL CHECK (seats > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Anyone can view available bookings" ON public.bookings
    FOR SELECT USING (status = 'available');

CREATE POLICY "Authenticated users can view all bookings" ON public.bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Only admins can update bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Only admins can delete bookings" ON public.bookings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- Booking requests policies
CREATE POLICY "Users can view their own booking requests" ON public.booking_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own booking requests" ON public.booking_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own booking requests" ON public.booking_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all booking requests" ON public.booking_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
    BEFORE UPDATE ON public.booking_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.bookings (title, description, date, time, location, price, max_seats, available_seats) VALUES
('Yoga Class', 'Morning yoga session for all levels', '2024-01-15', '09:00:00', 'Studio A', 25.00, 20, 20),
('Pilates Workshop', 'Introduction to Pilates fundamentals', '2024-01-16', '18:30:00', 'Studio B', 35.00, 15, 15),
('Meditation Session', 'Guided meditation and mindfulness', '2024-01-17', '19:00:00', 'Quiet Room', 20.00, 25, 25),
('Fitness Bootcamp', 'High-intensity workout session', '2024-01-18', '07:00:00', 'Main Hall', 30.00, 30, 30),
('Dance Class', 'Contemporary dance for beginners', '2024-01-19', '20:00:00', 'Dance Studio', 28.00, 18, 18)
ON CONFLICT DO NOTHING;
