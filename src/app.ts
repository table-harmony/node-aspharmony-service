import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ServiceManager } from "./services/service-manager";
import { ServiceFactory } from "./services/service-factory";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(
  bodyParser.raw({
    type: () => true,
    limit: "5mb",
  })
);

const serviceManager = new ServiceManager();

const serviceFactory = new ServiceFactory();
const jokesService = serviceFactory.createService("jokes");

serviceManager.registerService(jokesService);

serviceManager.setupServices(app);

app.get("/", (req, res) => {
  res.send("AspHarmony SOAP Services");
});

app.listen(port, () => {
  console.log(`SOAP Services running at port: ${port}`);
});
