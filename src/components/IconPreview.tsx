import React from 'react';
import icons from '@/icons/icons.json';
import { Icon } from './Icon';

export function IconPreview() {
  const all = icons.icons;
  return (
    <div style={{ padding: 20 }}>
      <h1>Icon Preview</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12
      }}>
        {all.map((ic: any) => (
          <div key={ic.id} style={{
            border: '1px solid #eee',
            borderRadius: 6,
            padding: 12,
            textAlign: 'center'
          }}>
            <Icon name={ic.id} />
            <div style={{ marginTop: 8, fontSize: 12 }}>{ic.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}








