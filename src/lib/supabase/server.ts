import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client. Uses the user's session cookie when present.
 *
 * For privileged operations (seed scripts, ingestion workers), import
 * `createServiceClient` instead and use the service role key — never on the
 * client.
 */
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // route handlers cannot mutate cookies; ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // route handlers cannot mutate cookies; ignore.
          }
        }
      }
    }
  );
}

/**
 * Privileged client for server-only workloads. Never expose this to the browser.
 */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {}
      }
    }
  );
}
