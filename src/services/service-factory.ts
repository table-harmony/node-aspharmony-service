import { BooksWebService } from "./books";
import { JokesWebService } from "./jokes";
import { WebService } from "./web-service";

export class ServiceFactory {
  createService(serviceName: string): WebService {
    switch (serviceName) {
      case "jokes":
        return new JokesWebService();
      case "books":
        return new BooksWebService();
      default:
        throw new Error("Invalid service name");
    }
  }
}
