import fs from "fs";
import express from "express";
import { Builder } from "xml2js";
import { WebService } from "../web-service";

export class JokesWebService extends WebService {
  setupRoute(app: express.Application) {
    super.setupRoute(app);

    app.get("/jokes.xml", async (req, res) => {
      const MAX_COUNT = 50;
      const count = Math.min(Number(req.query.count) || 1, MAX_COUNT);

      try {
        const { jokes } = await this.getJokes({ count });

        const builder = new Builder();
        const xml = builder.buildObject({ jokes: { joke: jokes } });

        res.header("Content-Type", "application/xml");
        res.send(xml);
      } catch (error) {
        res.status(500).send("Failed to load jokes.");
      }
    });
  }

  getWSDL() {
    return fs.readFileSync("src/services/jokes/index.wsdl", "utf8");
  }

  generateDefinition() {
    return {
      name: "JokesService",
      methods: {
        AddNumbers: this.addNumbers.bind(this),
        GenerateJoke: this.generateJoke.bind(this),
      },
      wsdl: this.getWSDL(),
    };
  }

  addNumbers(args: { a: number; b: number }) {
    return { sum: args.a + args.b };
  }

  async generateJoke() {
    try {
      const response = await fetch(
        "https://v2.jokeapi.dev/joke/Any?type=single"
      );
      const data = await response.json();
      return { joke: data.joke };
    } catch (error) {
      return { joke: "Failed to generate joke." };
    }
  }

  async getJokes(args: { count: number }) {
    const count = args.count;

    try {
      const jokeCount = Math.max(1, Math.min(count, 50));

      const jokePromises = Array(jokeCount)
        .fill(null)
        .map(() => this.generateJoke());

      const jokes = await Promise.all(jokePromises);
      return { jokes: jokes.map((item) => item.joke) };
    } catch (error) {
      return { jokes: Array(count).fill("Failed to fetch joke.") };
    }
  }
}
