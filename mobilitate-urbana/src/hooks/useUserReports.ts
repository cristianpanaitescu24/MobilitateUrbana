import { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { Report } from "../components/IReport"

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
            location: [r.lat, r.lon],
            ratings: ratings,
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
