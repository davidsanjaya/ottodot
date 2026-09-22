import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      student: true,
      trialClass: true,
    },
  });

  return NextResponse.json(bookings);
}
