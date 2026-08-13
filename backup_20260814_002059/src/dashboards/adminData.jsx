
import { useCondominios } from "../hooks/useCondominios";

export default function AdminData() {
    const { data, loading } = useCondominios();

    if (loading) return <p>A carregar dados...</p>;

    return (
        <div>
            <h2>Condomínios</h2>
            <ul>
                {data.map((c) => (
                    <li key={c.id}>{c.nome} — {c.morada}</li>
                ))}
            </ul>
        </div>
    );
}
