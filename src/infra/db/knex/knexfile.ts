import { databaseUrl } from "@/shared/env";
import "dotenv/config";
import type { Knex } from "knex";
import path from "node:path";

const ROOT = path.resolve(__dirname);
const migrationsDir = path.join(ROOT, "migrations");
const seedsDir = path.join(ROOT, "seeds");

const common: Partial<Knex.Config> = {
  client: "pg",
  migrations: { directory: migrationsDir, extension: "ts" },
  seeds: { directory: seedsDir, extension: "ts" }
};

const config: Record<string, Knex.Config> = {
  development: { ...common, connection: databaseUrl },
  staging: { ...common, connection: databaseUrl, pool: { min: 2, max: 10 } },
  production: {
    ...common,
    connection: databaseUrl,
    pool: { min: 2, max: 10 },
    migrations: { directory: migrationsDir, extension: "js" },
    seeds: { directory: seedsDir, extension: "js" }
  }
};

export default config;
