import { build } from "esbuild";
import { rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

const commonOptions = {
  platform: "node",
  format: "cjs",
  sourcemap: true,
  bundle: true,
  external: ["better-sqlite3", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3", "tedious"]
};

build({
  ...commonOptions,
  entryPoints: ["src/infra/http/express/app.ts"],
  outdir: "dist/web"
});

build({
  ...commonOptions,
  entryPoints: ["src/infra/cli/app.ts"],
  outdir: "dist/cli"
});

build({
  ...commonOptions,
  entryPoints: ["src/infra/schedule/app.ts"],
  outdir: "dist/schedule"
});

build({
  ...commonOptions,
  entryPoints: ["src/infra/eventBus/rabbitMQ/app.ts"],
  outdir: "dist/eventbus"
});
