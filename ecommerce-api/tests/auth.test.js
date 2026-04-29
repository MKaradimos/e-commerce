import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const app = buildApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth", () => {
  const email = `test-${Date.now()}@test.com`;

  it("registers a new user and returns a JWT", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "Password123",
      firstName: "Jane",
      lastName: "Doe",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe("CUSTOMER");
    expect(res.body.user.email).toBe(email);
  });

  it("rejects duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "Password123",
      firstName: "Jane",
      lastName: "Doe",
    });
    expect(res.status).toBe(409);
  });

  it("rejects invalid credentials on login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nope@test.com", password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("logs in successfully with seeded customer", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "customer@shop.com", password: "Password123!" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
