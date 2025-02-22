-- First, clear existing 2025 data
DELETE FROM retrograde_events WHERE EXTRACT(YEAR FROM event_date) = 2025;

-- Insert 2025 retrograde events
INSERT INTO retrograde_events (year, event_date, planet, event_type, degrees, minutes, sign, time_utc) VALUES
-- January
(2025, '2025-01-30 16:22:00', 'Uranus', 'direct', 23, 15, 'Taurus', '16:22'),

-- February
(2025, '2025-02-04 09:40:00', 'Jupiter', 'direct', 11, 16, 'Gemini', '09:40'),
(2025, '2025-02-24 02:00:00', 'Mars', 'direct', 17, 00, 'Cancer', '02:00'),

-- March
(2025, '2025-03-02 03:20:00', 'Venus', 'retrograde', 10, 50, 'Aries', '03:20'),
(2025, '2025-03-15 06:46:00', 'Mercury', 'retrograde', 9, 35, 'Aries', '06:46'),

-- April
(2025, '2025-04-07 13:30:00', 'Mercury', 'direct', 26, 49, 'Pisces', '13:30'),
(2025, '2025-04-13 01:02:00', 'Venus', 'direct', 24, 37, 'Pisces', '01:02'),

-- May
(2025, '2025-05-04 15:27:00', 'Pluto', 'retrograde', 3, 49, 'Aquarius', '15:27'),

-- July
(2025, '2025-07-04 21:33:00', 'Neptune', 'retrograde', 2, 10, 'Aries', '21:33'),
(2025, '2025-07-13 04:07:00', 'Saturn', 'retrograde', 1, 56, 'Aries', '04:07'),
(2025, '2025-07-18 04:45:00', 'Mercury', 'retrograde', 15, 34, 'Leo', '04:45'),
(2025, '2025-07-30 14:42:00', 'Chiron', 'retrograde', 27, 09, 'Aries', '14:42'),

-- August
(2025, '2025-08-11 07:30:00', 'Mercury', 'direct', 4, 14, 'Leo', '07:30'),

-- September
(2025, '2025-09-06 04:31:00', 'Uranus', 'retrograde', 1, 27, 'Gemini', '04:31'),

-- October
(2025, '2025-10-14 02:52:00', 'Pluto', 'direct', 1, 22, 'Aquarius', '02:52'),

-- November
(2025, '2025-11-09 19:01:00', 'Mercury', 'retrograde', 6, 51, 'Sagittarius', '19:01'),
(2025, '2025-11-11 16:41:00', 'Jupiter', 'retrograde', 25, 09, 'Cancer', '16:41'),
(2025, '2025-11-28 03:53:00', 'Saturn', 'direct', 25, 09, 'Pisces', '03:53'),
(2025, '2025-11-29 17:38:00', 'Mercury', 'direct', 20, 42, 'Scorpio', '17:38'),

-- December
(2025, '2025-12-10 12:23:00', 'Neptune', 'direct', 29, 22, 'Pisces', '12:23');
