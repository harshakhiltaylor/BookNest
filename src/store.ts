
export type UserId = string

export interface Book {
    title: string;
    author: string;
    pages: number;
    publisher: string;
    likes: UserId[];
}


export abstract class Store {

    constructor() {

    }

    getBooks(title : string){

    }

    addBook(title : string , pages: number , author: string , publisher: string){

    }

    like(userId : UserId , bookId : string){

    }

    returnBook(userId: string, title: string){

    }

    borrowBook(userId: string, title: string){
        
    }

}