"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, req, res, next) => {
    const { message, errorCode, statusCode, errors } = error;
    res.status(statusCode).json({
        message,
        errorCode,
        errors,
    });
};
exports.errorMiddleware = errorMiddleware;
