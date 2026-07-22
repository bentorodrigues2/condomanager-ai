
import { useEffect, useState } from "react";
import { get_assembleias } from "../services/assembleias";

export function useAssembleias() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_assembleias();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
