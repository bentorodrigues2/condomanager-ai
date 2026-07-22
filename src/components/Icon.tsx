import React from 'react';
import { getIconPath } from '../utils/iconLoader';

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  if (!name) return null;
  const path = getIconPath(name);
  return <img src={path} alt={name} style={{ width: size, height: size }} />;
}








