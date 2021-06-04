import { Output } from '@/types';

export function getPrettyName(output: Output): string {
  const { name, application } = output;
  if (!application) {
    return name;
  }
  return name.toLowerCase() === application.toLowerCase() ? application : `${name} (${application})`;
}

export function volumeIcon(volume: number | null): string {
  if (volume !== null) {
    if (volume > 80) {
      return 'mdi-volume-high';
    } else if (volume > 30) {
      return 'mdi-volume-medium';
    } else if (volume > 0) {
      return 'mdi-volume-low';
    }
    return 'mdi-volume-off';
  }
  return 'mdi-volume-variant-off';
}
