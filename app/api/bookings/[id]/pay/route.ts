import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/app/generated/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const bookingId = Number(id);

  const body = await request.json();
  const { success } = body;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  await prisma.paymentAttempt.create({
    data: {
      bookingId,
      success,
    },
  });

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: success
        ? $Enums.BookingStatus.CONFIRMED
        : $Enums.BookingStatus.PAYMENT_FAILED,
    },
  });

  return NextResponse.json(updatedBooking);
}
