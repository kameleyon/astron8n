-- First, clear existing Q3 2025 data
DELETE FROM transit_events 
WHERE year = 2025 
AND month IN (7, 8, 9);

-- Insert Q3 2025 transit events
INSERT INTO transit_events (year, month, event_date, planet, event_type, degrees, minutes, sign, time_utc, additional_info, secondary_planet) VALUES
-- July 2025
(2025, 7, '2025-07-04 12:44:00+00', 'Venus', 'conjunction', 29, 52, 'Taurus', '12:44:00', NULL, 'Uranus'),
(2025, 7, '2025-07-04 15:31:00+00', 'Venus', 'entered', 0, 0, 'Gemini', '15:31:00', NULL, NULL),
(2025, 7, '2025-07-07 07:46:00+00', 'Uranus', 'entered', 0, 0, 'Gemini', '07:46:00', NULL, NULL),
(2025, 7, '2025-07-10 20:36:00+00', 'Moon', 'full_moon', 18, 49, 'Capricorn', '20:36:00', NULL, NULL),
(2025, 7, '2025-07-22 13:30:00+00', 'Sun', 'entered', 0, 0, 'Leo', '13:30:00', NULL, NULL),
(2025, 7, '2025-07-24 19:10:00+00', 'Moon', 'new_moon', 2, 7, 'Leo', '19:10:00', NULL, NULL),
(2025, 7, '2025-07-31 03:57:00+00', 'Venus', 'entered', 0, 0, 'Cancer', '03:57:00', NULL, NULL),
(2025, 7, '2025-07-31 23:41:00+00', 'Sun', 'conjunction', 9, 0, 'Leo', '23:41:00', NULL, 'Mercury'),

-- August 2025
(2025, 8, '2025-08-06 23:24:00+00', 'Mars', 'entered', 0, 0, 'Libra', '23:24:00', NULL, NULL),
(2025, 8, '2025-08-09 07:54:00+00', 'Moon', 'full_moon', 16, 59, 'Aquarius', '07:54:00', NULL, NULL),
(2025, 8, '2025-08-12 05:29:00+00', 'Venus', 'conjunction', 14, 3, 'Cancer', '05:29:00', NULL, 'Jupiter'),
(2025, 8, '2025-08-22 20:34:00+00', 'Sun', 'entered', 0, 0, 'Virgo', '20:34:00', NULL, NULL),
(2025, 8, '2025-08-23 06:06:00+00', 'Moon', 'new_moon', 0, 22, 'Virgo', '06:06:00', NULL, NULL),
(2025, 8, '2025-08-25 16:27:00+00', 'Venus', 'entered', 0, 0, 'Leo', '16:27:00', NULL, NULL),

-- September 2025
(2025, 9, '2025-09-01 08:06:00+00', 'Saturn', 'left', 0, 0, 'Aries', '08:06:00', 'R', NULL),
(2025, 9, '2025-09-02 13:23:00+00', 'Mercury', 'entered', 0, 0, 'Virgo', '13:23:00', NULL, NULL),
(2025, 9, '2025-09-07 18:08:00+00', 'Moon', 'full_moon', 15, 22, 'Pisces', '18:08:00', NULL, NULL),
(2025, 9, '2025-09-07 18:12:00+00', 'Moon', 'lunar_eclipse', 15, 24, 'Pisces', '18:12:00', NULL, NULL),
(2025, 9, '2025-09-13 10:51:00+00', 'Sun', 'conjunction', 20, 54, 'Virgo', '10:51:00', NULL, 'Mercury'),
(2025, 9, '2025-09-18 10:06:00+00', 'Mercury', 'entered', 0, 0, 'Libra', '10:06:00', NULL, NULL),
(2025, 9, '2025-09-19 12:39:00+00', 'Venus', 'entered', 0, 0, 'Virgo', '12:39:00', NULL, NULL),
(2025, 9, '2025-09-21 19:43:00+00', 'Sun', 'solar_eclipse', 28, 59, 'Virgo', '19:43:00', NULL, NULL),
(2025, 9, '2025-09-21 19:53:00+00', 'Moon', 'new_moon', 29, 4, 'Virgo', '19:53:00', NULL, NULL),
(2025, 9, '2025-09-22 07:55:00+00', 'Mars', 'entered', 0, 0, 'Scorpio', '07:55:00', NULL, NULL),
(2025, 9, '2025-09-22 18:20:00+00', 'Sun', 'entered', 0, 0, 'Libra', '18:20:00', NULL, NULL);
