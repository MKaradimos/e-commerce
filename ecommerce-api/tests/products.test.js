import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const app = buildApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Products", () => {
  it("lists products with pagination", async () => {
    const res = await request(app).get("/api/products?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("pages");
  });

  it("filters products by brand", async () => {
    const res = await request(app).get("/api/products?brand=Apple");
    expect(res.status).toBe(200);
    res.body.items.forEach((p) => expect(p.brand).toBe("Apple"));
  });

  it("rejects product creation without auth", async () => {
    const res = await request(app).post("/api/products").send({});
    expect(res.status).toBe(401);
  });
});
