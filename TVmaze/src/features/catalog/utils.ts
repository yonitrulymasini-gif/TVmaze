export function plainText(html: string | null) {
  if (!html) return '';
  return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? '';
}
