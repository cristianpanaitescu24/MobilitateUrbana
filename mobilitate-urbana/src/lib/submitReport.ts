import { supabase } from './supabaseClient';
import { Report } from '../components/IReport'
import { PostgrestError } from '@supabase/supabase-js';

export interface SubmitPayload {
  location: [number, number];
  ratings: { [key: string]: number };
  tags: string[];
  timestamp: string;
}

var internalId = 0;


export async function submitReport(payload: SubmitPayload): Promise<Report | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Eroare: Utilizatorul nu este autentificat.');
    return null;
  }

  const { location, ratings, tags, timestamp } = payload;

  const { error } = await supabase.from('reports').insert({
    user_id: user.id,
    lat: location[1],
    lon: location[0],
    ratings,
    tags,
    timestamp
  });

  if(error)
  {
    console.log("submitReport error: ", error);
    return null;
  }

  internalId = internalId + 1;

  const report: Report = {
    id: 'local_id_' + internalId,
    user_id: user.id,
    timestamp: timestamp,
    location: location,
    ratings: ratings,
    tags: tags ?? [],
  };

  return report;
}