import fs from "fs";
import { WebService } from "../web-service";
import { parseString, Builder } from "xml2js";
import express from "express";

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
  private xmlFilePath: string = "src/services/books/storage.xml";

  constructor() {
    super();
    this.loadXml();
  }

  setupRoute(app: express.Application): void {
    super.setupRoute(app);

    app.get("/books", async (req, res) => {
      try {
        const data = fs.readFileSync(this.xmlFilePath, "utf8");

        res.header("Content-Type", "application/xml");
        res.send(data);
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

  async getBook(args: { id: number }) {
    const book = this.books.find((b) => b.Id === args.id) || null;
    return { book };
  }

  async getAllBooks() {
    return { books: this.books };
  }

  async createBook(args: { book: Book }) {
    this.books.push(args.book);
    this.saveXml();
  }

  async updateBook(args: { book: Book }) {
    const index = this.books.findIndex((b) => b.Id === args.book.Id);
    if (index !== -1) {
      this.books[index] = args.book;
      this.saveXml();
    }
  }

  async deleteBook(args: { id: number }) {
    this.books = this.books.filter((b) => b.Id !== args.id);
    this.saveXml();
  }

  private loadXml() {
    if (!fs.existsSync(this.xmlFilePath)) throw new Error("XML file not found");

    const data = fs.readFileSync(this.xmlFilePath, "utf8");

    parseString(data, (err, result) => {
      if (err) throw new Error("Failed to parse XML");

      if (!result.books) return;

      this.books = result.books.book.map((b: any) => ({
        Id: parseInt(b.Id[0], 10),
        Title: b.Title[0],
        Description: b.Description[0],
        ImageUrl: b.ImageUrl[0],
        Chapters:
          b.Chapters && b.Chapters[0] !== ""
            ? b.Chapters[0].Chapter.map((c: any) => ({
                Index: parseInt(c.Index[0], 10),
                Title: c.Title[0],
                Content: c.Content[0],
              }))
            : [],
      }));
    });
  }

  private saveXml() {
    const builder = new Builder();
    const xml = builder.buildObject({ books: { book: this.books } });
    fs.writeFileSync(this.xmlFilePath, xml);
  }
}
