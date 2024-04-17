import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.requester.create({
    data: {
      name: "Tamizh S",
      email: "tamizh.s@prisma.io",
      phone: 987678
    }
  });

  const allUsers = await prisma.requester.findMany();
  console.dir(allUsers);
}
main();
