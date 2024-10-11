import express from "express";

import request from "supertest";
import xml2js from "xml2js";
import { JokesWebService } from ".";

const app = express();

const BASE_PATH = "https://aspharmony-production.up.railway.app";

const jokesService = new JokesWebService();
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

    const result = await xml2js.parseStringPromise(response.text);
    const addNumbersResult =
      result["soap:Envelope"]["soap:Body"][0]["tns:AddNumbersResponse"][0][
        "sum"
      ][0];

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

    const result = await xml2js.parseStringPromise(response.text);
    const joke =
      result["soap:Envelope"]["soap:Body"][0]["tns:GenerateJokeResponse"][0][
        "joke"
      ][0];

    expect(joke).toBeTruthy();
  });

  it("should get multiple jokes", async () => {
    const requestBody = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetJokesRequest xmlns="${BASE_PATH}">
            <count>3</count>
          </GetJokesRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await request(app)
      .post("/JokesService")
      .set("Content-Type", "text/xml")
      .send(requestBody);

    expect(response.status).toBe(200);

    const result = await xml2js.parseStringPromise(response.text);
    const jokes =
      result["soap:Envelope"]["soap:Body"][0]["tns:GetJokesResponse"][0][
        "jokes"
      ];

    expect(jokes).toBeTruthy();
    expect(jokes.length).toBe(3);
    jokes.forEach((joke: string) => {
      expect(joke).toBeTruthy();
    });
  });
});
