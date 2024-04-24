import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Tamizh S",
      email: "tamizh.s@prisma.io",
      phone: 987678
    }
  });

  const allUsers = await prisma.user.findMany();
  console.dir(allUsers);
}
main();
