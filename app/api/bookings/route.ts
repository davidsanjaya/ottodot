import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { studentId, classId } = body;

  if (!studentId || !classId) {
    return NextResponse.json(
      { error: "studentId and classId are required" },
      { status: 400 },
    );
  }

  // Check duplicate booking
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      classId,
    },
  });

  if (existingBooking) {
    return NextResponse.json(
      { error: "Student already booked this class" },
      { status: 409 },
    );
  }

  const booking = await prisma.booking.create({
    data: {
      studentId,
      classId,
      status: "PENDING_PAYMENT",
    },
  });

  return NextResponse.json(booking);
}
