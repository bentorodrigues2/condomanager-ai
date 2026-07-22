import icons from '@/icons/icons.json';

export function getIconPath(id: string) {
  if (icons) {
    const all = Object.values(icons).flat();
    const icon = all.find((i: any) => i.id === id);
    if (icon) return `/icons/24x24/${icon.id}.png`;
  }
  return `/icons/24x24/${id}.png`;
}








