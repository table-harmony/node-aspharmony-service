import fs from "fs";
import { WebService } from "../web-service";
import { parseString, Builder } from "xml2js";

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

  getWSDL() {
    return fs.readFileSync("src/services/books/index.wsdl", "utf8");
  }

  generateDefinition() {
    return {
      name: "BooksService",
      methods: {
        GetBook: this.getBook,
        GetAllBooks: this.getAllBooks,
        CreateBook: this.createBook,
        UpdateBook: this.updateBook,
        DeleteBook: this.deleteBook,
      },
      wsdl: this.getWSDL(),
    };
  }

  constructor() {
    super();
    this.loadXml();
  }

  private loadXml() {
    if (!fs.existsSync(this.xmlFilePath)) throw new Error("XML file not found");

    const data = fs.readFileSync(this.xmlFilePath, "utf8");

    parseString(data, (err, result) => {
      if (err) throw new Error("Failed to parse XML");

      if (!result.Books) return;

      this.books = result.Books.Book.map((b: any) => ({
        Id: parseInt(b.Id[0], 10),
        Title: b.Title[0],
        Description: b.Description[0],
        ImageUrl: b.ImageUrl[0],
        Chapters: b.Chapters
          ? b.Chapters.map((c: any) => ({
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
}
