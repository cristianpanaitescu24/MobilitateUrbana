import { supabase } from './supabaseClient';

const { data: reports } = await supabase
  .from('reports')
  .select(`
    id,
    user_id,
    timestamp,
    satisfaction, safety, width, usability, accessibility, modernization,
    cars, signs, pavement, stairs, nature, notes,
    location,
    ST_X(location::geometry) AS lng,
    ST_Y(location::geometry) AS lat
  `);