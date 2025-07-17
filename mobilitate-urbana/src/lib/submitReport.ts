import { supabase } from './supabaseClient';
import { Report } from '../components/IReport'

export interface SubmitPayload {
  location: [number, number];
  ratings: { [key: string]: number };
  tags: string[];
  timestamp: string;
}

export async function submitReport(payload: SubmitPayload): Promise<Report | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Eroare: Utilizatorul nu este autentificat.');
    return null;
  }

  const { location, ratings, tags, timestamp } = payload;

  const { error } = await supabase.from('reports').insert({
    user_id: user.id,
    lat: location[0],
    lon: location[1],
    ratings,
    tags,
    timestamp
  });

  if(error)
  {
    console.log("submitReport error: ", error);
    return null;
  }

  const report: Report = {
    id: '',
    user_id: user.id,
    timestamp: timestamp,
    location: location,
    ratings: ratings,
    tags: tags ?? [],
  };

  return report;
}