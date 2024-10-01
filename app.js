const express = require("express");
const app = express();
const port = process.env.NODE_ENV === "development" ? 3000 : process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
