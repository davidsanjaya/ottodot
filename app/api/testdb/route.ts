// app/api/testdb/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  const students = await prisma.student.findMany();

  return NextResponse.json(students);
}
