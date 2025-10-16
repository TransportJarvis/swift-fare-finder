import { createClient, type SupabaseClient, type User } from "https://esm.sh/@supabase/supabase-js@2";

let cachedClient: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export function getServiceRoleClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return cachedClient;
}

export function extractAccessToken(req: Request): string {
  const authHeader = req.headers.get("Authorization") ?? "";
  const [, token] = authHeader.split("Bearer ");

  if (!token) {
    throw new Error("Missing or invalid authorization token");
  }

  return token.trim();
}

export async function getUserFromRequest(req: Request): Promise<User> {
  const token = extractAccessToken(req);
  const client = getServiceRoleClient();
  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Unable to authenticate user");
  }

  return data.user;
}
