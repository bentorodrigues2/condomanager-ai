import React from "react";

export default function Table({ columns, data }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <thead style={{ background: "#1e293b", color: "white" }}>
        <tr>
          {columns.map((col) => (
            <th key={col} style={{ padding: "12px", textAlign: "left" }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td
                key={col}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e2e8f0"
                }}
              >
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}





