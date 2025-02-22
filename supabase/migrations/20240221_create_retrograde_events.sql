-- Create enum for event types
CREATE TYPE retrograde_event_type AS ENUM ('direct', 'retrograde');

-- Create table for retrograde events
CREATE TABLE retrograde_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    planet VARCHAR(20) NOT NULL,
    event_type retrograde_event_type NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    degrees INTEGER NOT NULL,
    minutes INTEGER NOT NULL,
    sign VARCHAR(20) NOT NULL,
    time_utc TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for common queries
CREATE INDEX idx_retrograde_events_year ON retrograde_events(year);
CREATE INDEX idx_retrograde_events_planet ON retrograde_events(planet);
CREATE INDEX idx_retrograde_events_date ON retrograde_events(event_date);

-- Insert 2025 retrograde events
INSERT INTO retrograde_events (year, planet, event_type, event_date, degrees, minutes, sign, time_utc) VALUES
    (2025, 'Uranus', 'direct', '2025-01-30 16:22:00+00', 23, 15, 'Gemini', '16:22:00'),
    (2025, 'Jupiter', 'direct', '2025-02-04 09:40:00+00', 11, 16, 'Taurus', '09:40:00'),
    (2025, 'Mars', 'direct', '2025-02-24 02:00:00+00', 17, 00, 'Gemini', '02:00:00'),
    (2025, 'Venus', 'retrograde', '2025-03-02 00:36:00+00', 10, 50, 'Aries', '00:36:00'),
    (2025, 'Mercury', 'retrograde', '2025-03-15 06:46:00+00', 9, 35, 'Aries', '06:46:00'),
    (2025, 'Mercury', 'direct', '2025-04-07 11:08:00+00', 26, 49, 'Aries', '11:08:00'),
    (2025, 'Venus', 'direct', '2025-04-13 01:02:00+00', 24, 37, 'Aries', '01:02:00'),
    (2025, 'Pluto', 'retrograde', '2025-05-04 15:27:00+00', 3, 49, 'Aquarius', '15:27:00'),
    (2025, 'Neptune', 'retrograde', '2025-07-04 21:33:00+00', 2, 10, 'Pisces', '21:33:00'),
    (2025, 'Saturn', 'retrograde', '2025-07-13 04:07:00+00', 1, 56, 'Pisces', '04:07:00'),
    (2025, 'Mercury', 'retrograde', '2025-07-18 04:45:00+00', 15, 34, 'Leo', '04:45:00'),
    (2025, 'Chiron', 'retrograde', '2025-07-30 14:42:00+00', 27, 9, 'Aries', '14:42:00'),
    (2025, 'Mercury', 'direct', '2025-08-11 07:30:00+00', 24, 14, 'Leo', '07:30:00'),
    (2025, 'Uranus', 'retrograde', '2025-09-06 04:51:00+00', 1, 27, 'Gemini', '04:51:00'),
    (2025, 'Pluto', 'direct', '2025-10-14 02:52:00+00', 1, 22, 'Aquarius', '02:52:00'),
    (2025, 'Mercury', 'retrograde', '2025-11-09 19:01:00+00', 6, 51, 'Sagittarius', '19:01:00'),
    (2025, 'Jupiter', 'retrograde', '2025-11-11 16:41:00+00', 25, 9, 'Cancer', '16:41:00'),
    (2025, 'Saturn', 'direct', '2025-11-28 03:51:00+00', 25, 9, 'Pisces', '03:51:00'),
    (2025, 'Mercury', 'direct', '2025-11-29 17:38:00+00', 20, 42, 'Scorpio', '17:38:00'),
    (2025, 'Neptune', 'direct', '2025-12-10 12:23:00+00', 29, 22, 'Pisces', '12:23:00');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_retrograde_events_updated_at
    BEFORE UPDATE ON retrograde_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE retrograde_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users"
    ON retrograde_events FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update/delete only to service_role
CREATE POLICY "Allow all access to service_role"
    ON retrograde_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
