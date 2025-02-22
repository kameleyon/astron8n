-- Create enum for eclipse types
CREATE TYPE eclipses_type AS ENUM (
    'total_lunar',
    'partial_lunar',
    'penumbral_lunar',
    'total_solar',
    'partial_solar',
    'annular_solar'
);

-- Create table for eclipse events
CREATE TABLE eclipse_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL CHECK (year BETWEEN 2025 AND 2030),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    eclipse_type eclipse_type NOT NULL,
    degrees INTEGER NOT NULL CHECK (degrees BETWEEN 0 AND 29),
    minutes INTEGER NOT NULL CHECK (minutes BETWEEN 0 AND 59),
    sign VARCHAR(20) NOT NULL CHECK (sign IN ('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces')),
    time_utc TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_date, eclipse_type)
);

-- Add indexes for common queries
CREATE INDEX idx_eclipse_events_date ON eclipse_events(event_date);
CREATE INDEX idx_eclipse_events_type ON eclipse_events(eclipse_type);
CREATE INDEX idx_eclipse_events_year ON eclipse_events(year);
CREATE INDEX idx_eclipse_events_month ON eclipse_events(month);
CREATE INDEX idx_eclipse_events_sign ON eclipse_events(sign);
CREATE INDEX idx_eclipse_events_year_month ON eclipse_events(year, month);
CREATE INDEX idx_eclipse_events_year_sign ON eclipse_events(year, sign);
CREATE INDEX idx_eclipse_events_type_sign ON eclipse_events(eclipse_type, sign);

-- Insert eclipse events from 2025-2030
INSERT INTO eclipse_events (year, month, event_date, eclipse_type, degrees, minutes, sign, time_utc) VALUES
    -- 2025
    (2025, 3, '2025-03-14 03:03:00+00', 'total_lunar', 23, 0, 'Virgo', '03:03:00'),
    (2025, 3, '2025-03-29 10:49:00+00', 'partial_solar', 7, 0, 'Aries', '10:49:00'),
    (2025, 9, '2025-09-07 01:24:00+00', 'partial_lunar', 15, 0, 'Pisces', '01:24:00'),
    (2025, 9, '2025-09-21 16:08:00+00', 'partial_solar', 28, 0, 'Virgo', '16:08:00'),

    -- 2026
    (2026, 3, '2026-03-03 16:10:00+00', 'annular_solar', 12, 0, 'Pisces', '16:10:00'),
    (2026, 3, '2026-03-17 10:05:00+00', 'total_lunar', 27, 0, 'Virgo', '10:05:00'),
    (2026, 8, '2026-08-28 05:13:00+00', 'penumbral_lunar', 4, 0, 'Pisces', '05:13:00'),
    (2026, 9, '2026-09-11 18:15:00+00', 'partial_solar', 19, 0, 'Virgo', '18:15:00'),

    -- 2027
    (2027, 2, '2027-02-06 17:59:00+00', 'annular_solar', 17, 0, 'Aquarius', '17:59:00'),
    (2027, 2, '2027-02-20 04:14:00+00', 'penumbral_lunar', 0, 0, 'Virgo', '04:14:00'),
    (2027, 7, '2027-07-13 13:13:00+00', 'total_solar', 21, 0, 'Cancer', '13:13:00'),
    (2027, 7, '2027-07-27 02:32:00+00', 'total_lunar', 4, 0, 'Aquarius', '02:32:00'),

    -- 2028
    (2028, 1, '2028-01-26 10:57:00+00', 'annular_solar', 6, 0, 'Aquarius', '10:57:00'),
    (2028, 2, '2028-02-10 03:03:00+00', 'penumbral_lunar', 20, 0, 'Leo', '03:03:00'),
    (2028, 7, '2028-07-22 07:54:00+00', 'total_solar', 29, 0, 'Cancer', '07:54:00'),
    (2028, 8, '2028-08-05 15:12:00+00', 'total_lunar', 13, 0, 'Aquarius', '15:12:00'),

    -- 2029
    (2029, 1, '2029-01-14 06:42:00+00', 'partial_solar', 24, 0, 'Capricorn', '06:42:00'),
    (2029, 1, '2029-01-28 05:20:00+00', 'partial_lunar', 8, 0, 'Leo', '05:20:00'),
    (2029, 6, '2029-06-12 01:40:00+00', 'partial_solar', 21, 0, 'Gemini', '01:40:00'),
    (2029, 6, '2029-06-26 02:10:00+00', 'total_lunar', 4, 0, 'Capricorn', '02:10:00'),

    -- 2030
    (2030, 1, '2030-01-05 04:50:00+00', 'penumbral_lunar', 14, 0, 'Cancer', '04:50:00'),
    (2030, 6, '2030-06-30 12:42:00+00', 'partial_solar', 8, 0, 'Cancer', '12:42:00'),
    (2030, 7, '2030-07-15 00:27:00+00', 'penumbral_lunar', 23, 0, 'Capricorn', '00:27:00'),
    (2030, 12, '2030-12-25 09:07:00+00', 'annular_solar', 3, 0, 'Capricorn', '09:07:00');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_eclipse_events_updated_at
    BEFORE UPDATE ON eclipse_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE eclipse_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users"
    ON eclipse_events FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update/delete only to service_role
CREATE POLICY "Allow all access to service_role"
    ON eclipse_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE eclipse_events IS 'Stores solar and lunar eclipse events from 2025-2030';
COMMENT ON COLUMN eclipse_events.id IS 'Unique identifier for the eclipse event';
COMMENT ON COLUMN eclipse_events.year IS 'Year of the eclipse event (valid range: 2025-2030)';
COMMENT ON COLUMN eclipse_events.month IS 'Month of the eclipse event (valid range: 1-12)';
COMMENT ON COLUMN eclipse_events.event_date IS 'Full timestamp of the eclipse event with timezone';
COMMENT ON COLUMN eclipse_events.eclipse_type IS 'Type of eclipse (total/partial/penumbral lunar, total/partial/annular solar)';
COMMENT ON COLUMN eclipse_events.degrees IS 'Degrees position in the zodiac sign (valid range: 0-29)';
COMMENT ON COLUMN eclipse_events.minutes IS 'Arc minutes position in the zodiac sign (valid range: 0-59)';
COMMENT ON COLUMN eclipse_events.sign IS 'Zodiac sign where the eclipse occurs (must be one of the 12 zodiac signs)';
COMMENT ON COLUMN eclipse_events.time_utc IS 'Time of the eclipse in UTC';
COMMENT ON COLUMN eclipse_events.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN eclipse_events.updated_at IS 'Timestamp when the record was last updated';

-- Add comment about constraints
COMMENT ON CONSTRAINT eclipse_events_year_check ON eclipse_events IS 'Ensures year is within valid range (2025-2030)';
COMMENT ON CONSTRAINT eclipse_events_month_check ON eclipse_events IS 'Ensures month is within valid range (1-12)';
COMMENT ON CONSTRAINT eclipse_events_degrees_check ON eclipse_events IS 'Ensures degrees is within valid zodiac range (0-29)';
COMMENT ON CONSTRAINT eclipse_events_minutes_check ON eclipse_events IS 'Ensures minutes is within valid range (0-59)';
COMMENT ON CONSTRAINT eclipse_events_sign_check ON eclipse_events IS 'Ensures sign is a valid zodiac sign';
COMMENT ON CONSTRAINT eclipse_events_event_date_eclipse_type_key ON eclipse_events IS 'Ensures no duplicate eclipse events on the same date';
