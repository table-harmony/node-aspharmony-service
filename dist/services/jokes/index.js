"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JokesWebService = void 0;
const web_service_1 = require("../web-service");
const path_1 = __importDefault(require("path"));
class JokesWebService extends web_service_1.WebService {
    constructor() {
        const definition = {
            name: "JokesService",
            service: {
                GetInfo: JokesWebService.GetInfo,
                AddNumbers: JokesWebService.AddNumbers,
                GenerateJoke: JokesWebService.GenerateJoke,
                GetJokes: JokesWebService.GetJokes,
            },
            wsdlPath: path_1.default.join(__dirname, "index.wsdl"),
        };
        super(definition);
    }
    static async AddNumbers(args) {
        return args.a + args.b;
    }
    static async GetInfo() {
        return {
            Name: "JokesService",
            Version: "1.0.0",
        };
    }
    static async GenerateJoke() {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
        const data = await response.json();
        return data.joke;
    }
    static async GetJokes(count) {
        const MAX_JOKES = 50;
        const jokeCount = Math.min(Math.abs(count), MAX_JOKES);
        const jokePromises = Array(jokeCount).map(() => JokesWebService.GenerateJoke());
        return Promise.all(jokePromises);
    }
}
exports.JokesWebService = JokesWebService;
