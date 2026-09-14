/**
 * URL helpers for the Vite deployment base. Vite provides `/` locally and
 * `/career-compass-pro/` in the GitHub Pages build.
 */
export const siteBaseUrl = import.meta.env.BASE_URL;

export const productionSiteUrl = "https://hrishi-2407.github.io/career-compass-pro/";

export function siteHref(path = ""): string {
  return `${siteBaseUrl}${path.replace(/^\//, "")}`;
}
