-- Insert test data for the first user
insert into public.user_data (user_id, birth_chart, human_design, numerology, life_path, cardology)
values (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  jsonb_build_object(
    'sun_sign', 'Aries',
    'moon_sign', 'Taurus',
    'rising_sign', 'Gemini',
    'houses', jsonb_build_object(
      '1', 'Gemini',
      '2', 'Cancer',
      '3', 'Leo'
    ),
    'aspects', jsonb_build_array(
      jsonb_build_object('type', 'conjunction', 'planets', array['Sun', 'Mercury']),
      jsonb_build_object('type', 'trine', 'planets', array['Moon', 'Venus'])
    )
  ),
  jsonb_build_object(
    'type', '6/2 Manifesting Generator',
    'authority', 'Emotional',
    'profile', 'Role Model Hermit',
    'definition', 'Split Definition',
    'centers', jsonb_build_object(
      'root', true,
      'sacral', true,
      'solar_plexus', true
    )
  ),
  jsonb_build_object(
    'life_path_number', 7,
    'destiny_number', 3,
    'soul_urge_number', 9,
    'personality_number', 5
  ),
  jsonb_build_object(
    'path', 'Spiritual Seeker',
    'challenges', array['Self-discovery', 'Finding balance'],
    'strengths', array['Intuition', 'Analysis']
  ),
  jsonb_build_object(
    'birth_card', 'Queen of Hearts',
    'planetary_ruling_card', 'Jack of Diamonds',
    'yearly_spreads', jsonb_build_array(
      jsonb_build_object('position', 1, 'card', '7 of Clubs'),
      jsonb_build_object('position', 2, 'card', 'Ace of Spades')
    )
  )
)
on conflict (user_id) do update set
  birth_chart = excluded.birth_chart,
  human_design = excluded.human_design,
  numerology = excluded.numerology,
  life_path = excluded.life_path,
  cardology = excluded.cardology;
