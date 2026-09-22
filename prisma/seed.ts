import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.paymentAttempt.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.trialClass.deleteMany();
  const parent = await prisma.parent.create({
    data: {
      name: "John Doe",
      students: {
        create: [{ name: "Alice" }, { name: "Bob" }],
      },
    },
  });

  console.log("Parent created:", parent);

  const trialClass = await prisma.trialClass.create({
    data: {
      name: "Saturday Trial Class",
      capacity: 4,
    },
  });

  console.log("Trial class created:", trialClass);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
