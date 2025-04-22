import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]),
  DATABASE_URL: z.string().url(),
  APP_NAME: z.string().optional(),
  PORT: z.string().regex(/^\d+$/).optional(),
  APP_URL: z.string().url().optional()
});

envSchema.parse(process.env);

const NODE_ENV = (process.env.NODE_ENV ?? "development").toLowerCase();

export const isDevelopment = NODE_ENV === "development";
export const isTest = NODE_ENV === "test";
export const isStaging = NODE_ENV === "staging";
export const isProduction = NODE_ENV === "production";

export const databaseUrl = process.env.DATABASE_URL!;
export const appName = process.env.APP_NAME ?? "app";
export const appPort = Number(process.env.PORT ?? 3000);
export const appUrl = process.env.APP_URL ?? `http://localhost:${appPort}`;
