import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const adminExists = await prisma.user.findFirst({
    where: {
      role: "admin",
    },
  });

  if (!adminExists) {
    // Create admin user
    await prisma.user.create({
      data: {
        firstName: "Grace",
        lastName: "Munezero",
        email: "grace@gmail.com",
        password: await bcrypt.hash("12345678", 10),
        registrationNumber: `ADM-${Math.floor(Math.random() * 10000)}-2025`,
        dateOfBirth: new Date("2000-01-01"),
        role: "admin",
      },
    });
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
