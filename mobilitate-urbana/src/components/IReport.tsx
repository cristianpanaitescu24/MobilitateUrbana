export interface Report {
  id: string;
  user_id: string;
  timestamp?: string;

  location: [number, number];

  ratings: { [key: string]: number };
  tags?: string[];
}