import { Router } from "express";
import { createSesion } from "../controllers/sesiones.controller.js";

const router = Router();

// INSERT Sesión (tabla: sesiones)
router.post("/sesiones", createSesion);

export default router;
