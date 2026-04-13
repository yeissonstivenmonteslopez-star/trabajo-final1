import { Router } from "express";
import { createUsuario, getUsuarios } from "../controllers/usuarios.controller.js";

const router = Router();

// GET all Usuarios (tabla: usuarios)
router.get("/usuarios", getUsuarios);

// INSERT Usuario (tabla: usuarios)
router.post("/usuarios", createUsuario);

export default router;
