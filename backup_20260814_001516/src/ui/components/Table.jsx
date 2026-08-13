
export default function Table({ data }) {
    if (!data || data.length === 0) return <p>Sem dados.</p>;

    const keys = Object.keys(data[0]);

    return (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    {keys.map((k) => (
                        <th key={k}>{k}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {keys.map((k) => (
                            <td key={k}>{row[k]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
