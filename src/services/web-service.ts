const soap = require("soap");
import express from "express";
import fs from "fs";

export interface WebServiceDefinition {
  name: string;
  methods: Record<string, any>;
  wsdlPath: string;
}

export abstract class WebService {
  private definition: WebServiceDefinition;

  constructor() {
    this.definition = this.generateDefinition();
  }

  abstract generateDefinition(): WebServiceDefinition;

  private generateSoapService() {
    return {
      [this.definition.name]: {
        [this.definition.name + "Soap"]: this.definition.methods,
      },
    };
  }

  setupRoute(app: express.Application) {
    const wsdlContent = fs.readFileSync(this.definition.wsdlPath, "utf8");
    const soapService = this.generateSoapService();

    soap.listen(app, `/${this.definition.name}`, soapService, wsdlContent);

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
