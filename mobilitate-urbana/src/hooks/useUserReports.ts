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

  cars?: boolean;
  signs?: boolean;
  pavement?: boolean;
  stairs?: boolean;
  nature?: boolean;

  notes?: string;
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
        .from("reports_with_coords")
        .select(`
          id, user_id, timestamp,
          satisfaction, safety, width, usability,
          accessibility, modernization,
          cars, signs, pavement, stairs, nature,
          notes, lng, lat
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching reports:", error.message);
        setInitialReports([]);
      } else if (data) {
        const formatted = data.map((r: any): Report => ({
          id: r.id,
          user_id: r.user_id,
          timestamp: r.timestamp,
          lng: r.lng,
          lat: r.lat,
          satisfaction: r.satisfaction ?? undefined,
          safety: r.safety ?? undefined,
          width: r.width ?? undefined,
          usability: r.usability ?? undefined,
          accessibility: r.accessibility ?? undefined,
          modernization: r.modernization ?? undefined,
          cars: r.cars ?? false,
          signs: r.signs ?? false,
          pavement: r.pavement ?? false,
          stairs: r.stairs ?? false,
          nature: r.nature ?? false,
          notes: r.notes ?? "",
        }));

        setInitialReports(formatted);
        lastFetchedUserId.current = user.id;
      }

      setLoading(false);
    };

    fetchReports();
  }, [user]);

  return { initialReports, loading };
};
