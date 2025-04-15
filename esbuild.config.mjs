import { build } from "esbuild";
import { rmSync } from "fs";
import { glob } from "glob";

rmSync("dist", { recursive: true, force: true });

const entryPoints = await glob("src/**/*.ts", {
  ignore: ["**/*.spec.ts", "**/*.test.ts"]
});

build({
  entryPoints,
  outdir: "dist",
  platform: "node",
  target: "node22",
  format: "esm",
  sourcemap: true,
  bundle: false,
  outbase: "src"
}).catch(() => process.exit(1));
