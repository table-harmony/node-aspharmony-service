const express = require("express");
const cors = require("cors");
const soap = require("soap");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(
  bodyParser.raw({
    type: function () {
      return true;
    },
    limit: "5mb",
  })
);

// SOAP service
const serviceObject = {
  ASPHarmonyService: {
    ASPHarmonyPort: {
      GetServiceInfo: function (args) {
        return {
          Service: "ASPHarmony",
          Version: "1.0.0",
        };
      },
      AddNumbers: function (args) {
        const result = args.a + args.b;
        return { AddResult: result };
      },
    },
  },
};

// WSDL definition
const xml = require("fs").readFileSync("service.wsdl", "utf8");

// Create SOAP server
soap.listen(app, "/service", serviceObject, xml);

// Serve WSDL file
app.get("/service", function (req, res) {
  if (req.query.wsdl !== undefined) {
    res.type("application/xml");
    res.send(xml);
  } else {
    res.status(500).send("WSDL query parameter is missing");
  }
});

app.listen(port, () => {
  console.log(`SOAP Service running at port: ${port}`);
});
