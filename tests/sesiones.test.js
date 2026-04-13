import request from "supertest";
import app from "../src/app";

describe("Sesiones Routes", () => {
  it("should create a new sesion with email/password", async () => {
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const email = `login.${unique}@example.com`;
    const password = "Secret123";

    const createUser = await request(app).post("/api/usuarios").send({
      nombre_completo: "Login User",
      tipo_documento_codigo: "CC",
      numero_documento: `DOC-${unique}`,
      email,
      telefono: "3000000000",
      password,
    });
    expect(createUser.statusCode).toEqual(201);

    const res = await request(app).post("/api/sesiones").send({ email, password });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        usuario_id: createUser.body.id,
        token: expect.any(String),
        expira_en: expect.any(String),
      })
    );
    expect(res.body.token).toHaveLength(64);
  });
});
