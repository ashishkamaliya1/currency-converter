import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // Load .env

// Schema only for PORT
const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a valid number")
    .transform(Number)
    .default("5000"),
});

// Validate
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid .env configuration:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
