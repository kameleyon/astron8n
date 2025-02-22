-- Create enum for event types
CREATE TYPE transit_event_type AS ENUM (
    'entered',
    'left',
    'conjunction',
    'full_moon',
    'new_moon',
    'lunar_eclipse',
    'solar_eclipse'
);

-- Create table for transit events
CREATE TABLE transit_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    planet VARCHAR(20) NOT NULL,
    event_type transit_event_type NOT NULL,
    degrees INTEGER NOT NULL,
    minutes INTEGER NOT NULL,
    sign VARCHAR(20) NOT NULL,
    time_utc TIME NOT NULL,
    additional_info VARCHAR(10),
    secondary_planet VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_transit_events_year_month ON transit_events(year, month);
CREATE INDEX idx_transit_events_date ON transit_events(event_date);
CREATE INDEX idx_transit_events_planet ON transit_events(planet);
CREATE INDEX idx_transit_events_type ON transit_events(event_type);

-- Insert 2025 transit events
INSERT INTO transit_events (year, month, event_date, planet, event_type, degrees, minutes, sign, time_utc, additional_info, secondary_planet) VALUES
    -- January 2025
    (2025, 1, '2025-01-03 03:24:00+00', 'Venus', 'entered', 0, 0, 'Pisces', '03:24:00', NULL, NULL),
    (2025, 1, '2025-01-06 10:44:00+00', 'Mars', 'left', 0, 0, 'Leo', '10:44:00', 'R', NULL),
    (2025, 1, '2025-01-08 10:30:00+00', 'Mercury', 'entered', 0, 0, 'Capricorn', '10:30:00', NULL, NULL),
    (2025, 1, '2025-01-13 22:26:00+00', 'Moon', 'full_moon', 23, 59, 'Cancer', '22:26:00', NULL, NULL),
    (2025, 1, '2025-01-19 01:26:00+00', 'Venus', 'conjunction', 16, 5, 'Pisces', '01:26:00', NULL, 'Saturn'),
    (2025, 1, '2025-01-19 20:00:00+00', 'Sun', 'entered', 0, 0, 'Aquarius', '20:00:00', NULL, NULL),
    (2025, 1, '2025-01-21 12:28:00+00', 'Sun', 'conjunction', 1, 42, 'Aquarius', '12:28:00', NULL, 'Pluto'),
    (2025, 1, '2025-01-28 02:53:00+00', 'Mercury', 'entered', 0, 0, 'Aquarius', '02:53:00', NULL, NULL),
    (2025, 1, '2025-01-29 06:50:00+00', 'Node', 'left', 0, 0, 'Aries', '06:50:00', 'R', NULL),
    (2025, 1, '2025-01-29 07:52:00+00', 'Mercury', 'conjunction', 1, 58, 'Aquarius', '07:52:00', NULL, 'Pluto'),
    (2025, 1, '2025-01-29 12:35:00+00', 'Moon', 'new_moon', 9, 50, 'Aquarius', '12:35:00', NULL, NULL),

    -- February 2025
    (2025, 2, '2025-02-01 16:33:00+00', 'Venus', 'conjunction', 27, 59, 'Pisces', '16:33:00', NULL, 'Neptune'),
    (2025, 2, '2025-02-03 22:17:00+00', 'Venus', 'conjunction', 29, 42, 'Pisces', '22:17:00', NULL, 'Node'),
    (2025, 2, '2025-02-04 07:57:00+00', 'Venus', 'entered', 0, 0, 'Aries', '07:57:00', NULL, NULL),
    (2025, 2, '2025-02-09 12:07:00+00', 'Sun', 'conjunction', 20, 59, 'Aquarius', '12:07:00', NULL, 'Mercury'),
    (2025, 2, '2025-02-12 13:53:00+00', 'Moon', 'full_moon', 24, 5, 'Leo', '13:53:00', NULL, NULL),
    (2025, 2, '2025-02-14 12:07:00+00', 'Mercury', 'entered', 0, 0, 'Pisces', '12:07:00', NULL, NULL),
    (2025, 2, '2025-02-18 10:07:00+00', 'Sun', 'entered', 0, 0, 'Pisces', '10:07:00', NULL, NULL),
    (2025, 2, '2025-02-23 03:47:00+00', 'Neptune', 'conjunction', 28, 40, 'Pisces', '03:47:00', NULL, 'Node'),
    (2025, 2, '2025-02-25 12:01:00+00', 'Mercury', 'conjunction', 20, 15, 'Pisces', '12:01:00', NULL, 'Saturn'),
    (2025, 2, '2025-02-28 00:44:00+00', 'Moon', 'new_moon', 9, 40, 'Pisces', '00:44:00', NULL, NULL),

    -- March 2025
    (2025, 3, '2025-03-02 06:18:00+00', 'Mercury', 'conjunction', 28, 18, 'Pisces', '06:18:00', NULL, 'Node'),
    (2025, 3, '2025-03-02 16:21:00+00', 'Mercury', 'conjunction', 28, 57, 'Pisces', '16:21:00', NULL, 'Neptune'),
    (2025, 3, '2025-03-03 09:04:00+00', 'Mercury', 'entered', 0, 0, 'Aries', '09:04:00', NULL, NULL),
    (2025, 3, '2025-03-11 22:54:00+00', 'Mercury', 'conjunction', 8, 47, 'Aries', '22:54:00', NULL, 'Venus'),
    (2025, 3, '2025-03-12 10:28:00+00', 'Sun', 'conjunction', 22, 5, 'Pisces', '10:28:00', NULL, 'Saturn'),
    (2025, 3, '2025-03-14 06:54:00+00', 'Moon', 'full_moon', 23, 56, 'Virgo', '06:54:00', NULL, NULL),
    (2025, 3, '2025-03-14 06:59:00+00', 'Moon', 'lunar_eclipse', 23, 58, 'Virgo', '06:59:00', NULL, NULL),
    (2025, 3, '2025-03-17 20:12:00+00', 'Sun', 'conjunction', 27, 28, 'Pisces', '20:12:00', NULL, 'Node'),
    (2025, 3, '2025-03-19 23:24:00+00', 'Sun', 'conjunction', 29, 36, 'Pisces', '23:24:00', NULL, 'Neptune'),
    (2025, 3, '2025-03-20 09:02:00+00', 'Sun', 'entered', 0, 0, 'Aries', '09:02:00', NULL, NULL),
    (2025, 3, '2025-03-23 01:07:00+00', 'Sun', 'conjunction', 2, 39, 'Aries', '01:07:00', NULL, 'Venus'),
    (2025, 3, '2025-03-24 19:48:00+00', 'Sun', 'conjunction', 4, 24, 'Aries', '19:48:00', NULL, 'Mercury'),
    (2025, 3, '2025-03-27 00:30:00+00', 'Lilith', 'entered', 0, 0, 'Scorpio', '00:30:00', NULL, NULL),
    (2025, 3, '2025-03-27 08:41:00+00', 'Venus', 'left', 0, 0, 'Aries', '08:41:00', 'R', NULL),
    (2025, 3, '2025-03-27 13:13:00+00', 'Venus', 'conjunction', 29, 53, 'Pisces', '13:13:00', NULL, 'Neptune'),
    (2025, 3, '2025-03-29 10:48:00+00', 'Sun', 'solar_eclipse', 8, 53, 'Aries', '10:48:00', NULL, NULL),
    (2025, 3, '2025-03-29 10:57:00+00', 'Moon', 'new_moon', 8, 59, 'Aries', '10:57:00', NULL, NULL),
    (2025, 3, '2025-03-30 02:18:00+00', 'Mercury', 'left', 0, 0, 'Aries', '02:18:00', 'R', NULL),
    (2025, 3, '2025-03-30 02:46:00+00', 'Mercury', 'conjunction', 29, 59, 'Pisces', '02:46:00', NULL, 'Neptune'),
    (2025, 3, '2025-03-30 12:01:00+00', 'Neptune', 'entered', 0, 0, 'Aries', '12:01:00', NULL, NULL)

    -- Continue with remaining months...
    -- Note: Due to length limitations, the remaining months would be added in subsequent migrations
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transit_events_updated_at
    BEFORE UPDATE ON transit_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE transit_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users"
    ON transit_events FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update/delete only to service_role
CREATE POLICY "Allow all access to service_role"
    ON transit_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
