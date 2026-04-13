import { pool } from "../db.js";
import { hashPassword } from "../utils/auth.js";

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return res.status(200).json(rows);
  } catch (error) {
    console.error("getUsuarios error:", error);
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

function validateRequiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export const createUsuario = async (req, res) => {
  try {
    const {
      nombre_completo,
      tipo_documento_id,
      tipo_documento_codigo,
      numero_documento,
      email,
      prefijo_telefono,
      telefono,
      password,
    } = req.body ?? {};

    const missing = [];
    if (!validateRequiredString(nombre_completo)) missing.push("nombre_completo");
    if (!validateRequiredString(numero_documento)) missing.push("numero_documento");
    if (!validateRequiredString(email)) missing.push("email");
    if (!validateRequiredString(telefono)) missing.push("telefono");
    if (!validateRequiredString(password)) missing.push("password");

    const hasTipoDocId =
      typeof tipo_documento_id === "number" && Number.isInteger(tipo_documento_id);
    const hasTipoDocCodigo = validateRequiredString(tipo_documento_codigo);
    if (!hasTipoDocId && !hasTipoDocCodigo)
      missing.push("tipo_documento_id|tipo_documento_codigo");

    if (missing.length > 0) {
      return res.status(400).json({
        message: "Missing/invalid fields",
        fields: missing,
      });
    }

    let resolvedTipoDocumentoId = tipo_documento_id;
    if (!hasTipoDocId) {
      const [rows] = await pool.query(
        "SELECT id FROM tipo_documento WHERE codigo = ?",
        [tipo_documento_codigo]
      );
      if (rows.length === 0) {
        return res.status(400).json({ message: "tipo_documento_codigo inválido" });
      }
      resolvedTipoDocumentoId = rows[0].id;
    }

    const password_hash = await hashPassword(password);

    const [result] = await pool.query(
      `INSERT INTO usuarios 
        (nombre_completo, tipo_documento_id, numero_documento, email, prefijo_telefono, telefono, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_completo.trim(),
        resolvedTipoDocumentoId,
        numero_documento.trim(),
        email.trim().toLowerCase(),
        validateRequiredString(prefijo_telefono) ? prefijo_telefono.trim() : "+57",
        telefono.trim(),
        password_hash,
      ]
    );

    return res.status(201).json({
      id: result.insertId,
      nombre_completo: nombre_completo.trim(),
      tipo_documento_id: resolvedTipoDocumentoId,
      numero_documento: numero_documento.trim(),
      email: email.trim().toLowerCase(),
      prefijo_telefono: validateRequiredString(prefijo_telefono)
        ? prefijo_telefono.trim()
        : "+57",
      telefono: telefono.trim(),
      activo: 1,
    });
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Registro duplicado (email/documento)" });
    }
    console.error("createUsuario error:", error);
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
