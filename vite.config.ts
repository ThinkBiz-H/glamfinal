import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Standard Vite React SPA config. This project previously ran on TanStack
// Start (SSR + Nitro); that pipeline has been removed. TanStack Router
// itself is unchanged — the router-plugin here just runs in plain
// client-side codegen mode (target: "react") instead of Start's SSR mode,
// so file-based routing and routeTree.gen.ts generation work exactly as
// before, minus server rendering.
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
