const express = require("express");
const cors = require("cors");
const soap = require("soap");
const bodyParser = require("body-parser");
const fs = require("fs");

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
        return { Service: "AspHarmony", Version: "1.0.0" };
      },
      AddNumbers: (args) => {
        const result = args.a + args.b;
        return { result };
      },
      GenerateJoke: async () => {
        try {
          const response = await fetch(
            "https://v2.jokeapi.dev/joke/Any?type=single"
          );
          const data = await response.json();
          return { joke: data.joke };
        } catch (error) {
          console.error(error);
          return { joke: "No joke found" };
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

app.get("/jokes.xml", async (req, res) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
                    <jokes>`;

  const MAX_JOKES = 50;
  const count = Math.min(parseInt(req.query.count) || 10, MAX_JOKES);

  try {
    const jokePromises = Array(count)
      .fill()
      .map(() =>
        fetch("https://v2.jokeapi.dev/joke/Any?type=single")
          .then((response) => response.json())
          .then((data) => data.joke)
          .catch(() => "Failed to fetch joke")
      );

    const jokes = await Promise.all(jokePromises);

    jokes.forEach((joke) => {
      xmlContent += `<joke>${joke}</joke>`;
    });

    xmlContent += `</jokes>`;

    res.header("Content-Type", "application/xml");
    res.send(xmlContent);
  } catch (error) {
    console.error("Error fetching jokes:", error);
    res.status(500).send("Error generating jokes");
  }
});

app.get("/", (req, res) => {
  res.send("This is AspHarmony SOAP Service");
});

app.listen(port, () => {
  console.log(`SOAP Service running at port: ${port}`);
});
