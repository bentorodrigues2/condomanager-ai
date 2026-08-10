
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export function useSupabaseList(table, select = "*", match = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from(table).select(select);

    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    query.then(({ data, error }) => {
      if (!error) setData(data || []);
      setLoading(false);
    });
  }, [table, select, JSON.stringify(match)]);

  return { data, loading };
}
