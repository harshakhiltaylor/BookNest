import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { bookId, userId } = await req.json();

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const alreadyLiked = book.likes.includes(userId);
  if (alreadyLiked) return NextResponse.json(book); 

  const updated = await prisma.book.update({
    where: { id: bookId },
    data: {
      likes: [...book.likes, userId]
    }
  });

  return NextResponse.json(updated);
}
