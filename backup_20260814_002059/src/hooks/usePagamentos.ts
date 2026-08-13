
import { useEffect, useState } from "react";
import { get_pagamentos } from "../services/pagamentos";

export function usePagamentos() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_pagamentos();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
