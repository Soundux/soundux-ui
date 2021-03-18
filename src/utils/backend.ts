export async function openUrl(url: string): Promise<void> {
  await window.openUrl(url);
}

export function registerCallbacks(): void {
  // TODO: move all callback functions and initial function calls here
}
