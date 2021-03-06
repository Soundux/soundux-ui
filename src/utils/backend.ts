export async function openUrl(url: string): Promise<void> {
  // @ts-ignore
  if (!window.openUrl) {
    return;
  }
  // @ts-ignore
  await window.openUrl(url); // eslint-disable-line no-undef
}
