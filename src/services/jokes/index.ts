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
      wsdlPath: "src/services/jokes/index.wsdl",
    };
  }

  private static AddNumbers(args: { a: number; b: number }) {
    return args.a + args.b;
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
