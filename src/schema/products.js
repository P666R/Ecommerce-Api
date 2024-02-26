"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductSchema = void 0;
const zod_1 = require("zod");
exports.CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
});
