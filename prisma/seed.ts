import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.paymentAttempt.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.trialClass.deleteMany();
  await prisma.parent.create({
    data: {
      name: "John Doe",
      students: {
        create: [{ name: "Alice" }, { name: "Bob" }],
      },
    },
  });

  await prisma.parent.create({
    data: {
      name: "Jane Smith",
      students: {
        create: [{ name: "Charlie" }],
      },
    },
  });

  await prisma.parent.create({
    data: {
      name: "Michael Brown",
      students: {
        create: [{ name: "David" }],
      },
    },
  });

  await prisma.parent.create({
    data: {
      name: "Sarah Wilson",
      students: {
        create: [{ name: "Emma" }],
      },
    },
  });

  await prisma.parent.create({
    data: {
      name: "Robert Taylor",
      students: {
        create: [{ name: "Frank" }],
      },
    },
  });

  await prisma.trialClass.create({
    data: {
      name: "Saturday Trial Class",
      capacity: 4,
    },
  });
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
