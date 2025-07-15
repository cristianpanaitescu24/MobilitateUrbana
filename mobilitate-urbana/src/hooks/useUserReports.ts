import { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../lib/supabaseClient";

export interface Report {
  id: string;
  user_id: string;
  timestamp?: string;

  lat?: number;
  lng?: number;

  satisfaction?: number;
  safety?: number;
  width?: number;
  usability?: number;
  accessibility?: number;
  modernization?: number;

  tags?: string[];

  street?: string;
}

export const useUserReports = () => {
  const { user } = useAuth();
  const [initialReports, setInitialReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const lastFetchedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || user.id === lastFetchedUserId.current) return;

    const fetchReports = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select(`id, user_id, timestamp, tags, ratings, lat, lon`)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching reports:", error.message);
        setInitialReports([]);
      } else if (data) {
        const formatted = data.map((r: any): Report => {
          const ratings = typeof r.ratings === "string" ? JSON.parse(r.ratings) : r.ratings;

          return {
            id: r.id,
            user_id: r.user_id,
            timestamp: r.timestamp,
            lat: r.lat,
            lng: r.lon,
            satisfaction: ratings?.satisfaction,
            safety: ratings?.safety,
            width: ratings?.width,
            usability: ratings?.usability,
            accessibility: ratings?.accessibility,
            modernization: ratings?.modernization,
            tags: r.tags ?? [],
          };
        });

        setInitialReports(formatted);
        lastFetchedUserId.current = user.id;
      }

      setLoading(false);
    };

    fetchReports();
  }, [user]);

  return { initialReports, loading };
};
