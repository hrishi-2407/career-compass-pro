import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isGitHubActions ? "/career-compass-pro/" : "/",

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