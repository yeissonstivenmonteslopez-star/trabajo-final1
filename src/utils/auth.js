import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("password_required");
  }

  const salt = crypto.randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);

  return `scrypt$${salt.toString("base64")}$${Buffer.from(derivedKey).toString(
    "base64"
  )}`;
}

export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;
  const [scheme, saltB64, keyB64] = storedHash.split("$");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;

  const salt = Buffer.from(saltB64, "base64");
  const derivedKey = await scryptAsync(password, salt, 64);
  const storedKey = Buffer.from(keyB64, "base64");
  const computedKey = Buffer.from(derivedKey);

  if (storedKey.length !== computedKey.length) return false;
  return crypto.timingSafeEqual(computedKey, storedKey);
}

export function generateToken() {
  // 32 bytes => 64 hex chars (fits sesiones.token CHAR(64))
  return crypto.randomBytes(32).toString("hex");
}
