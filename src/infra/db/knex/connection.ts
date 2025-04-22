import knex, { Knex } from "knex";
import knexConfig from "./knexfile";

const env = (process.env.NODE_ENV ?? "development") as keyof typeof knexConfig;
export const connection: Knex = knex(knexConfig[env]);
