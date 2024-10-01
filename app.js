const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "ASPHarmony",
    version: "1.0.0",
    endpoints: [
      { path: "/", method: "GET", description: "Service information" },
      { path: "/api", method: "GET", description: "API root" },
    ],
  });
});

// API endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the ASPHarmony API" });
});

// Service metadata endpoint
app.get("/$metadata", (req, res) => {
  res.json({
    serviceName: "ASPHarmony",
    version: "1.0.0",
    description: "A simple API service for ASPHarmony",
    endpoints: [
      {
        path: "/",
        method: "GET",
        description: "Service information",
        responseFormat: {
          service: "string",
          version: "string",
          endpoints: "array",
        },
      },
      {
        path: "/api",
        method: "GET",
        description: "API root",
        responseFormat: {
          message: "string",
        },
      },
    ],
    dataTypes: {},
    authenticationMethod: "None",
    contactInformation: {
      developer: "TableHarmony",
      email: "tableharmony123@gmail.com",
    },
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
