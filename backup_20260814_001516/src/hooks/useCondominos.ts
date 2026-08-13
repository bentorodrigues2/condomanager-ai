
import { useEffect, useState } from "react";
import { get_condominos } from "../services/condominos";

export function useCondominos() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_condominos();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
