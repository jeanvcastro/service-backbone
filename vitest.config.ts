import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      $: path.resolve(__dirname, "./tests")
    }
  },
  test: {
    include: ["src/**/*.{spec,test}.ts"]
  }
});
