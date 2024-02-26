"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalException = void 0;
const root_1 = require("./root");
class internalException extends root_1.HttpException {
    constructor(message, errors, errorCode) {
        super(message, errorCode, 500, errors);
    }
}
exports.internalException = internalException;
