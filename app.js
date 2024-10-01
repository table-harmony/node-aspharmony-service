const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

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

app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
