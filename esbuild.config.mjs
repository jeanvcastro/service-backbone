import { build } from "esbuild";
import { rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

build({
  entryPoints: ["src/infra/http/express/app.ts"],
  outdir: "dist",
  platform: "node",
  target: "node22",
  format: "esm",
  sourcemap: true,
  bundle: true,
  banner: {
    js: `
      import { createRequire } from "node:module";
      import { fileURLToPath } from "node:url";
      import * as pathModule from "node:path";
      const require = createRequire(import.meta.url);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname  = pathModule.dirname(__filename);
    `
  },
  external: ["better-sqlite3", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3", "tedious"]
}).catch(() => process.exit(1));
