import fs from "fs";
import { WebService } from "../web-service";

export class JokesWebService extends WebService {
  generateDefinition() {
    return {
      name: "JokesService",
      methods: {
        AddNumbers: JokesWebService.AddNumbers,
        GenerateJoke: JokesWebService.GenerateJoke,
        GetJokes: JokesWebService.GetJokes,
      },
      wsdl: fs.readFileSync("src/services/jokes/index.wsdl", "utf8"),
    };
  }

  private static AddNumbers(args: { a: number; b: number }) {
    return args.a + args.b;
  }

  private static async GenerateJoke() {
    try {
      const response = await fetch(
        "https://v2.jokeapi.dev/joke/Any?type=single"
      );
      const data = await response.json();
      return data.joke;
    } catch (error) {
      return "Failed to generate joke.";
    }
  }

  private static async GetJokes(args: { count: number }) {
    const count = args.count;

    try {
      const jokeCount = Math.max(1, Math.min(count, 50));

      const jokePromises = Array(jokeCount)
        .fill(null)
        .map(() => JokesWebService.GenerateJoke());

      return await Promise.all(jokePromises);
    } catch (error) {
      return Array(count).fill("Failed to fetch joke.");
    }
  }
}
