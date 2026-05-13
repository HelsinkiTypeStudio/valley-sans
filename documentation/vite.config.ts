import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoFonts = path.resolve(__dirname, "../fonts/webfonts");
const allowed = new Set([
  "ValleySans[wght].woff2",
  "ValleySans-Italic[wght].woff2",
]);

function valleyRepoFonts(): Plugin {
  return {
    name: "valley-repo-fonts",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url?.split("?")[0] ?? "";
        if (!raw.startsWith("/fonts/webfonts/")) return next();
        const name = path.basename(decodeURIComponent(raw));
        if (!allowed.has(name)) return next();
        const fp = path.join(repoFonts, name);
        if (!fp.startsWith(repoFonts)) return next();
        if (!fs.existsSync(fp)) return next();
        res.setHeader("Content-Type", "font/woff2");
        fs.createReadStream(fp).pipe(res);
      });
    },
    closeBundle() {
      if (!fs.existsSync(repoFonts)) return;
      const outDir = path.resolve(__dirname, "dist/fonts/webfonts");
      fs.mkdirSync(outDir, { recursive: true });
      for (const name of allowed) {
        const src = path.join(repoFonts, name);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outDir, name));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), valleyRepoFonts()],
  server: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
