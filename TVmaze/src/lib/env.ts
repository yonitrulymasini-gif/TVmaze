import "server-only";
import { z } from "zod";

const envSchema = z.object({
  TCGDEX_BASE_URL: z.string().url().default("https://api.tcgdex.net/v2"),
  TCGDEX_LANGUAGE: z
    .string()
    .regex(/^[a-z]{2}$/)
    .default("fr"),
});

export const env = envSchema.parse({
  TCGDEX_BASE_URL: process.env.TCGDEX_BASE_URL,
  TCGDEX_LANGUAGE: process.env.TCGDEX_LANGUAGE,
});
