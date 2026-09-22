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

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Rule 1
      const existingBooking = await tx.booking.findFirst({
        where: {
          studentId,
          classId,
        },
      });

      if (existingBooking) {
        throw new Error("Student already booked this class");
      }

      // Find student
      const student = await tx.student.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Rule 2
      const siblingBooking = await tx.booking.findFirst({
        where: {
          classId,
          student: {
            parentId: student.parentId,
          },
        },
      });

      if (siblingBooking) {
        throw new Error("Parent already has a child booked into this class");
      }

      // Rule 3
      const trialClass = await tx.trialClass.findUnique({
        where: {
          id: classId,
        },
      });

      if (!trialClass) {
        throw new Error("Class not found");
      }

      const bookingCount = await tx.booking.count({
        where: {
          classId,
        },
      });

      if (bookingCount >= trialClass.capacity) {
        throw new Error("Class is full");
      }

      // Create booking
      return await tx.booking.create({
        data: {
          studentId,
          classId,
          status: "PENDING_PAYMENT",
        },
      });
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Booking failed",
      },
      { status: 409 },
    );
  }
}
