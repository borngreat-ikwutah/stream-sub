// src/env.ts
import { z } from "zod";

const clientSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_APP_NAME: z.string().min(1),
});

const serverSchema = z.object({
  DATABASE_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
});

const envSchema = z.object({
  ...clientSchema.shape,
  ...serverSchema.shape,
});

// 4. Runtime Validation Function
function validateEnv() {
  // If we are in the browser (client-side), we only validate client vars
  if (import.meta.env.SSR === false) {
    const parsed = clientSchema.safeParse(import.meta.env);
    if (!parsed.success) {
      console.error(parsed.error.format());
      throw new Error("Invalid Client Environment Variables");
    }
    return parsed.data;
  }

  // If we are on the server, we validate BOTH (since server can access client vars too)
  const combinedEnv = {
    ...import.meta.env, // VITE_ vars
    ...process.env, // Server vars
  };

  const parsed = envSchema.safeParse(combinedEnv);

  if (!parsed.success) {
    console.error(
      "❌ Invalid Server Environment Variables:",
      parsed.error.format(),
    );
    throw new Error("Invalid Server Environment Variables");
  }

  return parsed.data;
}

// 5. Export the validated object
export const env = validateEnv() as z.infer<typeof envSchema>;
