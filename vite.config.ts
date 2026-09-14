import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const buildEnv = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "VITE_");
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? buildEnv.VITE_SUPABASE_URL;
const supabasePublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? buildEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

if (isGitHubActions && (!supabaseUrl || !supabasePublishableKey)) {
  throw new Error(
    "GitHub Pages builds require VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY repository variables.",
  );
}

export default defineConfig({
  vite: {
    base: isGitHubActions ? "/career-compass-pro/" : "/",
  },

  ...(isGitHubActions
    ? {
        nitro: false,
      }
    : {}),

  tanstackStart: {
    server: { entry: "server" },

    ...(isGitHubActions
      ? {
          prerender: {
            enabled: true,
            autoSubfolderIndex: true,
            autoStaticPathsDiscovery: false,
            crawlLinks: false,
            failOnError: true,
          },

          pages: [
            {
              path: "/",
              prerender: {
                enabled: true,
                outputPath: "/index.html",
              },
            },
            {
              path: "/auth",
              prerender: {
                enabled: true,
                outputPath: "/auth/index.html",
              },
            },
            {
              path: "/admin",
              prerender: {
                enabled: true,
                outputPath: "/admin/index.html",
              },
            },
            {
              path: "/submit-review",
              prerender: {
                enabled: true,
                outputPath: "/submit-review/index.html",
              },
            },
          ],
        }
      : {}),
  },
});
