const soap = require("soap");
import express from "express";

export interface WebServiceDefinition {
  name: string;
  methods: Record<string, any>;
  wsdl: string;
}

export abstract class WebService {
  protected definition: WebServiceDefinition;

  constructor() {
    this.definition = this.generateDefinition();
  }

  protected abstract generateDefinition(): WebServiceDefinition;
  protected abstract getWSDL(): string;

  private generateSoapService() {
    return {
      [this.definition.name]: {
        [this.definition.name + "Port"]: this.definition.methods,
      },
    };
  }

  setupRoute(app: express.Application) {
    const { name, wsdl } = this.definition;
    const soapService = this.generateSoapService();

    soap.listen(app, `/${name}`, soapService, wsdl);

    app.get(`/${name}`, (req, res) => {
      if (req.query.wsdl !== undefined) {
        res.type("application/xml");
        res.send(wsdl);
      } else {
        res.type("text");
        res.send(`To view the WSDL for ${name}, add ?wsdl to the URL.`);
      }
    });
  }
}
