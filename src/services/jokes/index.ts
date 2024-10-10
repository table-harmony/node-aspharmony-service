import { WebService, WebServiceDefinition } from "../web-service";
import path from "path";

export class JokesWebService extends WebService {
  constructor() {
    const definition: WebServiceDefinition = {
      name: "JokesService",
      service: {
        GetInfo: JokesWebService.GetInfo,
        AddNumbers: JokesWebService.AddNumbers,
        GenerateJoke: JokesWebService.GenerateJoke,
        GetJokes: JokesWebService.GetJokes,
      },
      wsdlPath: path.join(__dirname, "index.wsdl"),
    };

    super(definition);
  }

  private static async AddNumbers(args: { a: number; b: number }) {
    return args.a + args.b;
  }

  private static async GetInfo() {
    return {
      Name: "JokesService",
      Version: "1.0.0",
    };
  }

  private static async GenerateJoke() {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
    const data = await response.json();
    return data.joke;
  }

  private static async GetJokes(count: number) {
    const MAX_JOKES = 50;
    const jokeCount = Math.min(Math.abs(count), MAX_JOKES);

    const jokePromises = Array(jokeCount).map(() =>
      JokesWebService.GenerateJoke()
    );
    return Promise.all(jokePromises);
  }
}
