import jwt from "jsonwebtoken";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import db from "./db";

// Never ship a hard-coded signing key. If JWT_SECRET is not configured we derive
// a deployment-specific key from DATABASE_URL (itself a secret), so tokens can't
// be forged with a value that is visible in the source code.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("JWT_SECRET is not configured");
  return createHash("sha256").update(`jwt-secret:${dbUrl}`).digest("hex");
}

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type AuthPayload = {
  userId: string;
  email: string;
  role: string;
  name: string;
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] }) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  // The token is stateless: confirm the account still exists and use the
  // current role from the DB (a deleted or demoted user loses access immediately).
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, name: true },
  });
  if (!user) return null;
  return { userId: user.id, email: user.email, role: user.role, name: user.name };
}

export async function requireAuth(): Promise<AuthPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthPayload> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

// ================= Passwords =================
// Salted scrypt (memory-hard KDF from Node's crypto, no extra dependency).
// Stored format: scrypt$<salt hex>$<hash hex>

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

/** True when the stored hash uses the legacy unsalted SHA-256 format and should be upgraded. */
export function needsRehash(hash: string): boolean {
  return !hash.startsWith("scrypt$");
}

export function comparePassword(password: string, stored: string): boolean {
  if (stored.startsWith("scrypt$")) {
    const [, salt, hash] = stored.split("$");
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  // Legacy accounts (unsalted SHA-256): verified in constant time, then upgraded on login.
  const legacy = Buffer.from(createHash("sha256").update(password).digest("hex"));
  const expected = Buffer.from(stored);
  return legacy.length === expected.length && timingSafeEqual(legacy, expected);
}
