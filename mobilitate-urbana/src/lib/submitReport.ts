import { supabase } from './supabaseClient';
import { Report } from '../components/IReport';

export interface SubmitPayload {
  location: [number, number];
  ratings: { [key: string]: number };
  tags: string[];
  timestamp: string;
}

/**
 * Submits a new report to Supabase and returns the inserted report with real ID.
 */
export async function submitReport(payload: SubmitPayload): Promise<Report | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Eroare: Utilizatorul nu este autentificat.');
    return null;
  }

  const { location, ratings, tags, timestamp } = payload;

  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: user.id,
      lat: location[0],
      lon: location[1],
      ratings,
      tags,
      timestamp,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("submitReport error: ", error);
    return null;
  }

  const report: Report = {
    id: data.id,
    user_id: data.user_id,
    timestamp: data.timestamp,
    location: [data.lat, data.lon],
    ratings: data.ratings,
    tags: data.tags ?? [],
  };
  console.log("Sumbit Report retuned", report);
  return report;
}

/**
 * Updates an existing report by ID and returns the updated report.
 */
export async function updateReport(id: string, payload: Partial<SubmitPayload>): Promise<Report | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    alert('Eroare: Utilizatorul nu este autentificat.');
    return null;
  }

  const updates: any = {};
  console.log ("updateReport start payload: ", payload);
  if (payload.location) {
    updates.lat = payload.location[0];
    updates.lon = payload.location[1];
  }
  if (payload.ratings) {
    updates.ratings = payload.ratings;
  }
  if (payload.tags) {
    updates.tags = payload.tags;
  }
  if (payload.timestamp) {
    updates.timestamp = payload.timestamp;
  }

  console.log ("updateReport id:", id);

  const { data, error } = await supabase
    .from('reports')
    .update({
      ratings: updates.ratings,
      tags: updates.tags,
      timestamp: updates.timestamp
    })
    .eq('id', id)
    .select();

  console.log("received: data: ", data, "error:", error);
  if (error || !data) {
    console.error('updateReport error:', error);
    return null;
  }

  const report: Report = {
    id: id,
    user_id: user.id,
    timestamp: updates.timestamp,
    location: [updates.lat, updates.lon],
    ratings: updates.ratings,
    tags: updates.tags ?? [],
  };

  console.log("Update Report retuned", report);
  return report;
}
