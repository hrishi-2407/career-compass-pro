/**
 * URL helpers for the Vite deployment base.
 * The production site is served from the custom domain root.
 */
export const siteBaseUrl = import.meta.env.BASE_URL;

export const productionSiteUrl = "https://ascendus.marketing/";

export function siteHref(path = ""): string {
  return `${siteBaseUrl}${path.replace(/^\//, "")}`;
}
