import { PrismaClient } from "@prisma/client"
import { NextRequest , NextResponse } from "next/server"


const prisma = new PrismaClient();

export async function POST(req : NextRequest) {

    const body = await req.json();

    const book = await prisma.book.create({
        data: {
            title: body.title,
            pages: body.pages,
            author: body.author,
            publisher: body.publisher,
            likes: []
        }
    });

    return NextResponse.json(book);
}

