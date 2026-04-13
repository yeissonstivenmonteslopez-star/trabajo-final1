import request from "supertest";
import app from "../src/app";

describe("Usuarios Routes", () => {
  it("should create a new usuario", async () => {
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const email = `test.${unique}@example.com`;

    const res = await request(app).post("/api/usuarios").send({
      nombre_completo: "Test User",
      tipo_documento_codigo: "CC",
      numero_documento: `DOC-${unique}`,
      email,
      telefono: "3000000000",
      password: "Secret123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        nombre_completo: "Test User",
        tipo_documento_id: expect.any(Number),
        numero_documento: `DOC-${unique}`,
        email,
        prefijo_telefono: "+57",
        telefono: "3000000000",
        activo: 1,
      })
    );
  });
});
