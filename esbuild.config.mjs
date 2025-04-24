import { build } from "esbuild";
import { rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

const commonOptions = {
  platform: "node",
  format: "cjs",
  sourcemap: true,
  bundle: true,
  entryNames: "app", // app.js
  external: ["better-sqlite3", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3", "tedious"]
};

const targets = [
  { name: "web", entry: "src/infra/http/entrypoint.ts" },
  { name: "cli", entry: "src/infra/cli/entrypoint.ts" },
  { name: "schedule", entry: "src/infra/schedule/entrypoint.ts" },
  { name: "eventbus", entry: "src/infra/eventBus/entrypoint.ts" }
];

await Promise.all(
  targets.map(target =>
    build({
      ...commonOptions,
      entryPoints: [target.entry],
      outdir: `dist/${target.name}`
    })
  )
);
