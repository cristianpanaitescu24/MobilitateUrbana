import { supabase } from './supabaseClient';

export interface SubmitPayload {
  location: [number, number];
  ratings: { [key: string]: number };
  tags: string[];
  timestamp: string;
}

export async function submitReport(payload: SubmitPayload): Promise<boolean> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert('Eroare: Utilizatorul nu este autentificat.');
    return false;
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
    return false;
  }

  alert('Raport trimis cu succes!');
  return true;
}
