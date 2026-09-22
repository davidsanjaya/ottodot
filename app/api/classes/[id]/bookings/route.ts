import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const classId = Number(id);

  const trialClass = await prisma.trialClass.findUnique({
    where: {
      id: classId,
    },
    include: {
      bookings: {
        include: {
          student: {
            include: {
              parent: true,
            },
          },
        },
      },
    },
  });

  if (!trialClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: trialClass.id,
    name: trialClass.name,
    capacity: trialClass.capacity,
    totalBookings: trialClass.bookings.length,
    remainingSeats: trialClass.capacity - trialClass.bookings.length,
    bookings: trialClass.bookings.map((booking) => ({
      bookingId: booking.id,
      status: booking.status,
      student: {
        id: booking.student.id,
        name: booking.student.name,
      },
      parent: {
        id: booking.student.parent.id,
        name: booking.student.parent.name,
      },
    })),
  });
}
