import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: {
      email: "admin@shop.com",
      password: passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      cart: { create: {} },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@shop.com" },
    update: {},
    create: {
      email: "customer@shop.com",
      password: passwordHash,
      firstName: "John",
      lastName: "Doe",
      role: "CUSTOMER",
      cart: { create: {} },
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: "laptops" },
    update: {},
    create: { name: "Laptops", slug: "laptops", description: "Portable computers" },
  });

  const phones = await prisma.category.upsert({
    where: { slug: "smartphones" },
    update: {},
    create: { name: "Smartphones", slug: "smartphones", description: "Mobile phones" },
  });

  const headphones = await prisma.category.upsert({
    where: { slug: "headphones" },
    update: {},
    create: { name: "Headphones", slug: "headphones", description: "Audio gear" },
  });

  const products = [
    {
      name: "MacBook Pro 14",
      slug: "macbook-pro-14",
      brand: "Apple",
      price: 2199.0,
      stock: 10,
      categoryId: laptops.id,
      description: "M3 Pro chip, 18GB RAM, 512GB SSD",
    },
    {
      name: "Dell XPS 15",
      slug: "dell-xps-15",
      brand: "Dell",
      price: 1799.0,
      stock: 8,
      categoryId: laptops.id,
      description: "Intel i7, 16GB RAM, 1TB SSD",
    },
    {
      name: "Lenovo ThinkPad X1",
      slug: "lenovo-thinkpad-x1",
      brand: "Lenovo",
      price: 1599.0,
      stock: 12,
      categoryId: laptops.id,
      description: "Carbon Gen 11, 16GB RAM, 512GB SSD",
    },
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      brand: "Apple",
      price: 1199.0,
      stock: 25,
      categoryId: phones.id,
      description: "A17 Pro chip, 256GB",
    },
    {
      name: "Samsung Galaxy S24",
      slug: "galaxy-s24",
      brand: "Samsung",
      price: 999.0,
      stock: 30,
      categoryId: phones.id,
      description: "Snapdragon 8 Gen 3, 256GB",
    },
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      brand: "Sony",
      price: 399.0,
      stock: 50,
      categoryId: headphones.id,
      description: "Industry-leading noise cancellation",
    },
    {
      name: "AirPods Pro 2",
      slug: "airpods-pro-2",
      brand: "Apple",
      price: 249.0,
      stock: 100,
      categoryId: headphones.id,
      description: "Adaptive audio, USB-C",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("✅ Seed complete!");
  console.log("   Admin:    admin@shop.com / Password123!");
  console.log("   Customer: customer@shop.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
