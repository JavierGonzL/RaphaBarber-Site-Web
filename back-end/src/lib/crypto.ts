import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error("ENCRYPTION_KEY debe ser una cadena hexadecimal de 64 caracteres (32 bytes).");
  }
  return Buffer.from(key, "hex");
}

export function encrypt(texto: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const cifrado = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), cifrado.toString("hex")].join(":");
}

export function decrypt(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(":");
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const descifrado = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return descifrado.toString("utf8");
}
