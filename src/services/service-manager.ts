import express from "express";
import { WebService } from "./web-service";

export class ServiceManager {
  private services: WebService[] = [];

  registerService(service: WebService) {
    this.services.push(service);
  }

  setupServices(app: express.Application) {
    this.services.forEach((service) => {
      service.setupRoute(app);
    });
  }
}
