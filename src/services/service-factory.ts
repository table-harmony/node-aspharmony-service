import { JokesWebService } from "./jokes";
import { BooksWebService } from "./books";
import { WebService } from "./web-service";

export class ServiceFactory {
  static createService(serviceName: string): WebService {
    switch (serviceName) {
      case "jokes":
        return JokesWebService.getInstance();
      case "books":
        return BooksWebService.getInstance();
      default:
        throw new Error("Invalid service name");
    }
  }
}
