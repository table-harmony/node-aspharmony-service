import express from "express";
import { WebService } from "../web-service";

type Chapter = {
  index: number;
  title: string;
  content: string;
};

type Book = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  chapters: Chapter[];
};

export const books: Book[] = [];

export class BooksWebService extends WebService {
  setupRoute(app: express.Application) {
    super.setupRoute(app);

    app.get("/books.xml", (req, res) => {
      let xmlContent = "<Books>";

      books.forEach((book) => {
        xmlContent += `
          <Book>
            <Id>${book.id}</Id>
            <Title>${book.title}</Title>
            <Description>${book.description}</Description>
            <ImageUrl>${book.imageUrl}</ImageUrl>
            <Chapters>${book.chapters
              .map((chapter) => `<Chapter>${chapter.index}</Chapter>`)
              .join("")}</Chapters>
          </Book>
        `;
      });

      xmlContent += `</Books>`;

      res.type("application/xml");
      res.send(xmlContent);
    });
  }

  generateDefinition() {
    return {
      name: "BooksService",
      methods: {
        GetBook: BooksWebService.getBook,
        GetAllBooks: BooksWebService.getAllBooks,
        CreateBook: BooksWebService.createBook,
        UpdateBook: BooksWebService.updateBook,
        DeleteBook: BooksWebService.deleteBook,
      },
      wsdlPath: "src/services/books/index.wsdl",
    };
  }

  private static getBook(args: { id: number }) {
    return books.find((b) => b.id === args.id) || null;
  }

  private static getAllBooks() {
    return books;
  }

  private static createBook(args: { book: Book }) {
    books.push(args.book);
  }

  private static updateBook(args: { book: Book }) {
    const book = BooksWebService.getBook({ id: args.book.id });
    if (!book) return null;

    book.title = args.book.title ?? book.title;
    book.description = args.book.description ?? book.description;
    book.imageUrl = args.book.imageUrl ?? book.imageUrl;
    book.chapters =
      args.book.chapters?.map((c) => ({
        index: c.index,
        title: c.title,
        content: c.content,
      })) ?? book.chapters;
  }

  private static deleteBook(args: { id: number }) {
    const index = books.findIndex((b) => b.id === args.id);
    if (index !== -1) {
      books.splice(index, 1);
    }
  }
}
