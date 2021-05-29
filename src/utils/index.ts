import { Output } from '@/types';

export function getPrettyName(output: Output): string {
  const { name, application } = output;
  if (!application) {
    return name;
  }
  return name.toLowerCase() === application.toLowerCase() ? application : `${name} (${application})`;
}
