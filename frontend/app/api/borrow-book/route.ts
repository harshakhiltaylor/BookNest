import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, bookId } = await req.json();

  const borrowDate = new Date();
  const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const record = await prisma.borrow.create({
    data: {
      userId,
      bookId,
      borrowDate,
      dueDate,
      returned: false
    }
  });

  return NextResponse.json(record);
}
