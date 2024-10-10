const soap = require("soap");
import express from "express";
import fs from "fs";

export interface WebServiceDefinition {
  name: string;
  service: Record<string, any>;
  wsdlPath: string;
}

export abstract class WebService {
  constructor(public definition: WebServiceDefinition) {}

  setupRoute(app: express.Application) {
    const wsdlContent = fs.readFileSync(this.definition.wsdlPath, "utf8");

    soap.listen(
      app,
      `/${this.definition.name}`,
      this.definition.service,
      wsdlContent
    );

    app.get(`/${this.definition.name}`, (req, res) => {
      if (req.query.wsdl !== undefined) {
        res.type("application/xml");
        res.send(wsdlContent);
      } else {
        res.type("text");
        res.send(
          `To view the WSDL for ${this.definition.name}, add ?wsdl to the URL.`
        );
      }
    });
  }
}
