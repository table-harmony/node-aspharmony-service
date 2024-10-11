import fs from "fs";
import { WebService } from "../web-service";

export class JokesWebService extends WebService {
  getWSDL() {
    return fs.readFileSync("src/services/jokes/index.wsdl", "utf8");
  }

  generateDefinition() {
    return {
      name: "JokesService",
      methods: {
        addNumbers: JokesWebService.bind(this),
        generateJoke: this.generateJoke.bind(this),
        getJokes: this.getJokes.bind(this),
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
