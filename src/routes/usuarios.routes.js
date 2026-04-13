import { Router } from "express";
import { createUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

// INSERT Usuario (tabla: usuarios)
router.post("/usuarios", createUsuario);

export default router;
