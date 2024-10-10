"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const service_manager_1 = require("./services/service-manager");
const jokes_1 = require("./services/jokes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.raw({
    type: () => true,
    limit: "5mb",
}));
const serviceManager = new service_manager_1.ServiceManager();
serviceManager.registerService(new jokes_1.JokesWebService());
serviceManager.setupServices(app);
app.get("/", (req, res) => {
    res.send("AspHarmony SOAP Services");
});
app.listen(port, () => {
    console.log(`SOAP Services running at port: ${port}`);
});
