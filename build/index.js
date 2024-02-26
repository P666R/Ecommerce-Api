"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query'],
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, () => {
    console.log(`Server is running at port:${secrets_1.PORT}`);
});
