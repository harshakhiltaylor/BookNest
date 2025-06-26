import { Store, UserId, Book } from "./store";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class InMemoryStore implements Store {
  private store: Map<string, Book>;

  constructor() {
    this.store = new Map<string, Book>();
  }

  async addBook(title: string, pages: number, author: string, publisher: string) {
    const prismaBook = await prisma.book.create({
      data: { title, pages, author, publisher, likes: [] }
    });

    this.store.set(prismaBook.id, prismaBook);

    console.log("Book Created Successfully:", prismaBook);
  }

  getBooks(title: string) {
    const books = Array.from(this.store.values()).filter(book => book.title === title);

    if (books.length === 0) {
      console.log("Book Not found");
    }

    return books;
  }

  async like(userId: UserId, id: string) {
    const book = this.store.get(id);

    if (!book) {
      console.log("No Book Found");
      return;
    }

    if (book.likes.includes(userId)) return book;

    // Update in-memory
    book.likes.push(userId);
    this.store.set(id, book);

    // Update in DB
    await prisma.book.update({
      where: { id },
      data: { likes: book.likes }
    });

    return book;
  }

  async borrowBook(userId: string, title: string) {
    const bookEntry = Array.from(this.store.entries()).find(([_, book]) => book.title === title);

    if (!bookEntry) {
      console.log("Book is not in the library");
      return;
    }

    const [bookId, book] = bookEntry;

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
    const returned = false;

    const borrowRecord = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        borrowDate,
        dueDate,
        returned
      }
    });

    console.log(`User ${userId} borrowed book "${title}" (ID: ${bookId}) on ${borrowDate.toDateString()} due on ${dueDate.toDateString()}`);
    return borrowRecord;
  }

  async returnBook(userId: string, title: string) {
    const bookEntry = Array.from(this.store.entries()).find(([_, book]) => book.title === title);

    if (!bookEntry) {
      console.log("Book is not in the library");
      return;
    }

    const [bookId] = bookEntry;

    const borrowRecord = await prisma.borrow.findFirst({
      where: {
        bookId,
        userId,
        returned: false
      }
    });

    if (!borrowRecord) {
      console.log("No active borrow record found for this user and book.");
      return;
    }

    await prisma.borrow.update({
      where: { id: borrowRecord.id },
      data: {
        returnDate: new Date(),
        returned: true
      }
    });

    console.log(`User ${userId} returned book "${title}" (ID: ${bookId})`);
  }
}
