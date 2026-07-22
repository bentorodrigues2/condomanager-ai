
import { useEffect, useState } from "react";
import { get_fornecedores } from "../services/fornecedores";

export function useFornecedores() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_fornecedores();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
