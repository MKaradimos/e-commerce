import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const app = buildApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Cart", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "customer@shop.com", password: "Password123!" });
    token = res.body.token;
  });

  it("requires auth to view cart", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });

  it("returns the customer cart with total", async () => {
    if (!token) return; // skip if seed not run
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("total");
  });
});
