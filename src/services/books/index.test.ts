import express from "express";
import request from "supertest";
import xml2js from "xml2js";
import { ServiceFactory } from "../service-factory";

const BASE_PATH = "https://aspharmony-production.up.railway.app";

const app = express();
const booksService = ServiceFactory.createService("books");
booksService.setupRoute(app);

describe("BooksWebService", () => {
  it("should return WSDL when requested", async () => {
    const response = await request(app).get("/BooksService?wsdl");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/xml");
    expect(response.text).toContain("<wsdl:definitions");
  });

  it("should create a book", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <CreateBookRequest xmlns="${BASE_PATH}">
            <book>
              <Id>1</Id>
              <Title>Test Book</Title>
              <Description>A test book description</Description>
              <ImageUrl>http://example.com/image.jpg</ImageUrl>
              <Chapters>
                <Chapter>
                  <Index>1</Index>
                  <Title>Chapter 1</Title>
                  <Content>Chapter 1 content</Content>
                </Chapter>
              </Chapters>
            </book>
          </CreateBookRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/BooksService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);
  });

  it("should get a book", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetBookRequest xmlns="${BASE_PATH}">
            <Id>1</Id>
          </GetBookRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/BooksService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);

    const result = await parseXmlResponse(response);
    const book = result["tns:GetBookResponse"][0]["book"][0];

    expect(book).toBeTruthy();
    expect(book.Id[0]).toBe("1");
    expect(book.Title[0]).toBe("Test Book");
  });

  it("should get all books", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetAllBooksRequest xmlns="${BASE_PATH}" />
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/BooksService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);

    const result = await parseXmlResponse(response);
    const books = result["tns:GetAllBooksResponse"][0]["books"];

    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  it("should update a book", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <UpdateBookRequest xmlns="https://aspharmony-production.up.railway.app/">
            <book>
              <Id>1</Id>
              <Title>Updated Test Book</Title>
              <Description>An updated test book description</Description>
              <ImageUrl>http://example.com/updated-image.jpg</ImageUrl>
              <Chapters>
                <Chapter>
                  <Index>1</Index>
                  <Title>Updated Chapter 1</Title>
                  <Content>Updated Chapter 1 content</Content>
                </Chapter>
              </Chapters>
            </book>
          </UpdateBookRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/BooksService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);
  });

  it("should delete a book", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <DeleteBookRequest xmlns="${BASE_PATH}">
            <Id>1</Id>
          </DeleteBookRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/BooksService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);
  });
});

const parseXmlResponse = async (response: request.Response) => {
  const result = await xml2js.parseStringPromise(response.text);
  return result["soap:Envelope"]["soap:Body"][0];
};
