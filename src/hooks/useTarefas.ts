
import { useEffect, useState } from "react";
import { get_tarefas } from "../services/tarefas";

export function useTarefas() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_tarefas();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
