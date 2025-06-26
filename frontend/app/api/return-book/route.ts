import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, bookId } = await req.json();

  const borrow = await prisma.borrow.findFirst({
    where: {
      userId,
      bookId,
      returned: false
    }
  });

  if (!borrow) {
    return NextResponse.json({ error: "No active borrow record found" }, { status: 404 });
  }

  const updated = await prisma.borrow.update({
    where: { id: borrow.id },
    data: {
      returned: true,
      returnDate: new Date()
    }
  });

  return NextResponse.json(updated);
}
