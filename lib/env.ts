/**
 * Environment variable validation and type-safe access
 */

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}\n\nPlease check your .env.local file.`,
    );
  }
}

/**
 * Get a required environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the environment variable is not set
 */
export function getEnv(key: EnvVar): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set. Please check your .env.local file.`,
    );
  }
  return value;
}

/**
 * Get an optional environment variable with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if the app is running in production
 */
export const isProduction = process.env.NODE_ENV === "production";

/**
 * Check if the app is running in development
 */
export const isDevelopment = process.env.NODE_ENV === "development";
