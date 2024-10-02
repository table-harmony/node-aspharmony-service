const express = require("express");
const cors = require("cors");
const soap = require("soap");
const bodyParser = require("body-parser");
const fs = require("fs");
const { create } = require("xmlbuilder2");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(
  bodyParser.raw({
    type: () => true,
    limit: "5mb",
  })
);

const serviceObject = {
  AspHarmonyService: {
    AspHarmonyPort: {
      GetServiceInfo: () => {
        const xml = create({ version: "1.0", encoding: "UTF-8" })
          .ele("GetServiceInfoResponse")
          .ele("Service")
          .txt("AspHarmony")
          .up()
          .ele("Version")
          .txt("1.0.0")
          .end({ prettyPrint: true });

        return xml;
      },
      AddNumbers: (args) => {
        const result = args.a + args.b;

        const xml = create({ version: "1.0", encoding: "UTF-8" })
          .ele("AddNumbersResponse")
          .ele("result")
          .txt(result.toString())
          .end({ prettyPrint: true });

        return xml;
      },
      GenerateJoke: async () => {
        try {
          const response = await fetch(
            "https://v2.jokeapi.dev/joke/Any?type=single"
          );
          const data = await response.json();

          const xml = create({ version: "1.0", encoding: "UTF-8" })
            .ele("GenerateJokeResponse")
            .ele("joke")
            .txt(data.joke)
            .end({ prettyPrint: true });

          return xml;
        } catch (error) {
          console.error(error);
          const xml = create({ version: "1.0", encoding: "UTF-8" })
            .ele("GenerateJokeResponse")
            .ele("joke")
            .txt("No joke found")
            .end({ prettyPrint: true });

          return xml;
        }
      },
    },
  },
};

// WSDL definition
const xml = fs.readFileSync("service.wsdl", "utf8");

// Create SOAP server
soap.listen(app, "/service", serviceObject, xml);

// Serve WSDL file or service information
app.get("/service", (req, res) => {
  if (req.query.wsdl !== undefined) {
    res.type("application/xml");
    res.send(xml);
  } else {
    res.type("text");
    res.send("To view the WSDL, add ?wsdl to the URL.");
  }
});

app.get("/", (req, res) => {
  res.send("This is AspHarmony SOAP Service");
});

app.listen(port, () => {
  console.log(`SOAP Service running at port: ${port}`);
});
