import fs from "fs";
import express from "express";
import { Builder } from "xml2js";
import { WebService } from "../web-service";

type Chapter = {
  Index: number;
  Title: string;
  Content: string;
};

type Book = {
  Id: number;
  Title: string;
  Description: string;
  ImageUrl: string;
  Chapters: Chapter[];
};

export class BooksWebService extends WebService {
  private books: Book[] = [];

  setupRoute(app: express.Application) {
    super.setupRoute(app);

    app.get("/books.xml", async (req, res) => {
      try {
        const builder = new Builder();
        const xml = builder.buildObject({ books: { book: this.books } });

        res.header("Content-Type", "application/xml");
        res.send(xml);
      } catch (error) {
        res.status(500).send("Failed to load books.");
      }
    });
  }

  getWSDL() {
    return fs.readFileSync("src/services/books/index.wsdl", "utf8");
  }

  generateDefinition() {
    return {
      name: "BooksService",
      methods: {
        GetBook: this.getBook.bind(this),
        GetAllBooks: this.getAllBooks.bind(this),
        CreateBook: this.createBook.bind(this),
        UpdateBook: this.updateBook.bind(this),
        DeleteBook: this.deleteBook.bind(this),
      },
      wsdl: this.getWSDL(),
    };
  }

  async getBook(args: { Id: number }) {
    const book = this.books.find((b) => b.Id === args.Id) || null;
    return { book };
  }

  async getAllBooks() {
    return { books: this.books };
  }

  async createBook(args: { book: Book }) {
    this.books.push(args.book);
  }

  async updateBook(args: { book: Book }) {
    const index = this.books.findIndex((b) => b.Id === args.book.Id);
    if (index !== -1) {
      this.books[index] = args.book;
    }
  }

  async deleteBook(args: { Id: number }) {
    this.books = this.books.filter((b) => b.Id !== args.Id);
  }
}
