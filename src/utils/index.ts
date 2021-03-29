import { Output, SortMode, Sound, Tab } from '@/types';

export function getPrettyName(output: Output): string {
  const { name, application } = output;
  if (!application) {
    return name;
  }
  return name.toLowerCase() === application.toLowerCase() ? application : `${name} (${application})`;
}

export function sortTab({ sounds }: Tab, sortMode: SortMode): void {
  sounds.sort((a: Sound, b: Sound) => {
    switch (sortMode) {
      case SortMode.ModifiedDate_Descending:
        return b.modifiedDate - a.modifiedDate;
      case SortMode.ModifiedDate_Ascending:
        return a.modifiedDate - b.modifiedDate;
      case SortMode.Alphabetical_Descending:
        return b.name.localeCompare(a.name);
      case SortMode.Alphabetical_Ascending:
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}
