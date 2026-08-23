import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env");

// console.log("Resolved __dirname:", __dirname);
// console.log("Looking for .env at:", envPath);

const result = dotenv.config({ path: envPath });

// if (result.error) {
//   console.error("dotenv failed:", result.error);
// } else {
//   console.log("dotenv loaded keys:", Object.keys(result.parsed ?? {}));
// }

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  WS_PORT: z.coerce.number().optional(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;