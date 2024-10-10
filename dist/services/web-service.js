"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const soap = require("soap");
const fs_1 = __importDefault(require("fs"));
class WebService {
    constructor(definition) {
        this.definition = definition;
    }
    setupRoute(app) {
        const wsdlContent = fs_1.default.readFileSync(this.definition.wsdlPath, "utf8");
        soap.listen(app, `/${this.definition.name}`, this.definition.service, wsdlContent);
        app.get(`/${this.definition.name}`, (req, res) => {
            if (req.query.wsdl !== undefined) {
                res.type("application/xml");
                res.send(wsdlContent);
            }
            else {
                res.type("text");
                res.send(`To view the WSDL for ${this.definition.name}, add ?wsdl to the URL.`);
            }
        });
    }
}
exports.WebService = WebService;
