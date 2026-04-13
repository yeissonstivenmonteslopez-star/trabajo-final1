import { pool } from "../db.js";
import { generateToken, verifyPassword } from "../utils/auth.js";

function validateRequiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export const createSesion = async (req, res) => {
  try {
    const { email, password, expira_en } = req.body ?? {};

    const missing = [];
    if (!validateRequiredString(email)) missing.push("email");
    if (!validateRequiredString(password)) missing.push("password");
    if (missing.length > 0) {
      return res.status(400).json({ message: "Missing/invalid fields", fields: missing });
    }

    const [users] = await pool.query(
      "SELECT id, password_hash, activo FROM usuarios WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    if (users.length === 0 || users[0].activo !== 1) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await verifyPassword(password, users[0].password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken();
    const ip = req.ip;
    const user_agent = req.get("user-agent") ?? null;

    const expiration =
      validateRequiredString(expira_en) && !Number.isNaN(Date.parse(expira_en))
        ? new Date(expira_en)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [result] = await pool.query(
      "INSERT INTO sesiones (usuario_id, token, ip, user_agent, expira_en) VALUES (?, ?, ?, ?, ?)",
      [users[0].id, token, ip, user_agent, expiration]
    );

    return res.status(201).json({
      id: result.insertId,
      usuario_id: users[0].id,
      token,
      expira_en: expiration.toISOString().slice(0, 19).replace("T", " "),
    });
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Token duplicado, reintenta" });
    }
    console.error("createSesion error:", error);
    const isProduction = process.env.NODE_ENV === "production";
    return res.status(500).json(
      isProduction
        ? { message: "Something goes wrong" }
        : {
            message: "Something goes wrong",
            error: {
              code: error?.code,
              message: error?.message,
            },
          }
    );
  }
};
