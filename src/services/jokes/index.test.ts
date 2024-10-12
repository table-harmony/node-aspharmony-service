import express from "express";

import request from "supertest";
import xml2js from "xml2js";
import { ServiceFactory } from "../service-factory";

const BASE_PATH = "https://aspharmony-production.up.railway.app";

const app = express();

const jokesService = ServiceFactory.createService("jokes");
jokesService.setupRoute(app);

describe("JokesWebService", () => {
  it("should return WSDL when requested", async () => {
    const response = await request(app).get("/JokesService?wsdl");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/xml");
    expect(response.text).toContain("<wsdl:definitions");
  });

  it("should add two numbers", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <AddNumbersRequest xmlns="${BASE_PATH}">
            <a>5</a>
            <b>3</b>
          </AddNumbersRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/JokesService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);

    const result = await parseXmlResponse(response);
    const addNumbersResult = result["tns:AddNumbersResponse"][0]["sum"][0];

    expect(addNumbersResult).toBe("8");
  });

  it("should generate a joke", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GenerateJokeRequest xmlns="${BASE_PATH}" />
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/JokesService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);

    const result = await parseXmlResponse(response);
    const joke = result["tns:GenerateJokeResponse"][0]["joke"][0];

    expect(joke).toBeTruthy();
  });

  it("should get multiple jokes", async () => {
    const response = await request(app).get("/jokes.xml?count=3");

    expect(response.status).toBe(200);

    const result = await xml2js.parseStringPromise(response.text);
    const jokes = result["jokes"]["joke"];

    expect(jokes).toBeTruthy();
    expect(jokes.length).toBe(3);

    jokes.forEach((joke: string) => {
      expect(joke).toBeTruthy();
    });
  });
});

async function parseXmlResponse(response: request.Response) {
  const result = await xml2js.parseStringPromise(response.text);
  return result["soap:Envelope"]["soap:Body"][0];
}
