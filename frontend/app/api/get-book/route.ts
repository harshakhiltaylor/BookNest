import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(){

    const books = await prisma.book.findMany();
    return NextResponse.json(books);

}

