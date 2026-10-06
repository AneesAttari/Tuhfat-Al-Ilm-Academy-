// Cloudflare D1 Type Definitions for type safety
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[]; success: boolean; error?: string }>;
  run<T = unknown>(): Promise<{ success: boolean; error?: string }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results?: T[]; success: boolean }[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface Env {
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_INITIAL_PASSWORD?: string;
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });
  return cookies;
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateId(): string {
  return crypto.randomUUID();
}

export async function verifySession(request: Request, env: Env): Promise<{ id: string; email: string } | null> {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['admin_session'];

  if (!sessionToken) return null;

  const now = new Date().toISOString();
  const query = `
    SELECT s.id as session_id, s.expires_at, a.id as admin_id, a.email
    FROM sessions s
    JOIN admins a ON s.admin_id = a.id
    WHERE s.id = ? AND s.expires_at > ?
  `;

  const session = await env.DB.prepare(query).bind(sessionToken, now).first<{ admin_id: string; email: string }>();
  if (!session) return null;

  return { id: session.admin_id, email: session.email };
}

export function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}
