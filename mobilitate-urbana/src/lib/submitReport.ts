import { supabase } from './supabaseClient';
import { Report } from '../hooks/useUserReports'; // Import correct type

export interface SubmitPayload {
  location: [number, number];
  ratings: { [key: string]: number };
  issues: {
    cars: boolean;
    signs: boolean;
    pavement: boolean;
    stairs: boolean;
    nature: boolean;
  };
  notes?: string;
  timestamp: string;
}

export async function submitReport(payload: SubmitPayload): Promise<Report | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User fetch error', userError);
    alert('Eroare: Utilizatorul nu este autentificat.');
    return null;
  }

  const { location, ratings, issues, notes, timestamp } = payload;

  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: user.id,
      location: `POINT(${location[0]} ${location[1]})`,
      timestamp,
      satisfaction: ratings.satisfaction ?? null,
      safety: ratings.safety ?? null,
      width: ratings.width ?? null,
      usability: ratings.usability ?? null,
      accessibility: ratings.accessibility ?? null,
      modernization: ratings.modernization ?? null,
      ...issues,
      notes,
    })
    .select() // 👈 return inserted record
    .single(); // 👈 only one row expected

  if (error || !data) {
    console.error('Insert error', error);
    alert('Eroare la trimiterea raportului. Încearcă din nou.');
    return null;
  }

  const coords = location;
  const report: Report = {
    id: data.id,
    user_id: user.id,
    timestamp,
    lng: coords[0],
    lat: coords[1],
    satisfaction: data.satisfaction ?? undefined,
    safety: data.safety ?? undefined,
    width: data.width ?? undefined,
    usability: data.usability ?? undefined,
    accessibility: data.accessibility ?? undefined,
    modernization: data.modernization ?? undefined,
    cars: data.cars ?? false,
    signs: data.signs ?? false,
    pavement: data.pavement ?? false,
    stairs: data.stairs ?? false,
    nature: data.nature ?? false,
    notes: data.notes ?? '',
    street: data.street ?? '',
  };

  alert('Raport trimis cu succes!');
  return report;
}