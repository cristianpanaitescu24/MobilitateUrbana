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
    lat: location[1],
    lon: location[0],
    ratings,
    tags,
    timestamp
  });

  if (error) {
    console.error('Insert error', error);
    alert('Eroare la trimiterea raportului.');
    return null;
  }

  alert('Raport trimis cu succes!');
  const report: Report = {
    id: "null",
    user_id: user.id,
    timestamp: timestamp,
    location: location,
    ratings: ratings,
    tags: tags ?? [],
  };

  return report;
}