import { Output } from '@/types';
import ISO6391 from 'iso-639-1';

export function getPrettyName(output: Output): string {
  const { name, application } = output;
  if (!name) {
    return application;
  }
  return name.toLowerCase() === application.toLowerCase() ? name : `${application} (${name})`;
}

const localeNative: Map<string, string> = new Map([['bar', 'Boarisch']]);

export function getNativeName(locale: string): string {
  if (localeNative.has(locale)) {
    return <string>localeNative.get(locale);
  }
  const iso6391 = locale.split('_')[0];
  return ISO6391.getNativeName(iso6391);
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
