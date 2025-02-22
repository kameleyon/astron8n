-- First, clear existing 2025 data
DELETE FROM eclipse_events 
WHERE year = 2025;

-- Insert 2025 eclipse events
INSERT INTO eclipse_events (year, month, event_date, eclipse_type, degrees, minutes, sign, time_utc) VALUES
-- March 2025
(2025, 3, '2025-03-14 03:03:00+00', 'total_lunar', 23, 58, 'Virgo', '03:03:00'),
(2025, 3, '2025-03-29 10:49:00+00', 'partial_solar', 8, 53, 'Aries', '10:49:00'),

-- September 2025
(2025, 9, '2025-09-07 01:24:00+00', 'partial_lunar', 15, 24, 'Pisces', '01:24:00'),
(2025, 9, '2025-09-21 16:08:00+00', 'partial_solar', 28, 59, 'Virgo', '16:08:00');
