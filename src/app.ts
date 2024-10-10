import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ServiceManager } from "./services/service-manager";
import { JokesWebService } from "./services/jokes";

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

serviceManager.registerService(new JokesWebService());

serviceManager.setupServices(app);

app.get("/", (req, res) => {
  res.send("AspHarmony SOAP Services");
});

app.listen(port, () => {
  console.log(`SOAP Services running at port: ${port}`);
});
