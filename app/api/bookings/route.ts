import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { studentId, classId } = body;

    // Validation
    if (!studentId || !classId) {
      return NextResponse.json(
        { error: "studentId and classId are required" },
        { status: 400 },
      );
    }

    // Student must exist
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Rule #1:
    // Student cannot book the same class twice
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

    // Rule #2:
    // Parent cannot book multiple children
    // into the same trial class
    const parentBooking = await prisma.booking.findFirst({
      where: {
        classId,
        student: {
          parentId: student.parentId,
        },
      },
      include: {
        student: true,
      },
    });

    if (parentBooking) {
      return NextResponse.json(
        {
          error: "Parent already has a child booked into this class",
        },
        { status: 409 },
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        studentId,
        classId,
        status: "PENDING_PAYMENT",
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      student: true,
      trialClass: true,
    },
  });

  return NextResponse.json(bookings);
}
