import { Output } from '@/types';

export function getPrettyName(output: Output): string {
  const { name, application } = output;
  return name.toLowerCase() === application.toLowerCase() ? application : `${name} (${application})`;
}
