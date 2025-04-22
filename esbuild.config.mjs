import { build } from "esbuild";
import { rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

build({
  entryPoints: ["src/infra/http/express/app.ts"],
  outdir: "dist",
  platform: "node",
  format: "cjs",
  sourcemap: true,
  bundle: true,
  external: ["better-sqlite3", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3", "tedious"]
}).catch(() => process.exit(1));
