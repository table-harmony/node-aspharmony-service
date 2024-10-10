"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceManager = void 0;
class ServiceManager {
    constructor() {
        this.services = [];
    }
    registerService(service) {
        this.services.push(service);
    }
    setupServices(app) {
        this.services.forEach((service) => {
            service.setupRoute(app);
        });
    }
}
exports.ServiceManager = ServiceManager;
