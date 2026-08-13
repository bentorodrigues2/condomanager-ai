
import React from 'react';

export default function Table({ columns, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((c) => (
              <td key={c} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                {row[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
