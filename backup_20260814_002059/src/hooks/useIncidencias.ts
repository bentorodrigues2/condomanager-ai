
import { useEffect, useState } from "react";
import { get_incidencias } from "../services/incidencias";

export function useIncidencias() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_incidencias();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
