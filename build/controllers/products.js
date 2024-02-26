"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const __1 = require("..");
const products_1 = require("../schema/products");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    products_1.CreateProductSchema.parse(req.body);
    const product = yield __1.prismaClient.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(',') }),
    });
    res.json(product);
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const updatedProduct = yield __1.prismaClient.product.update({
            where: {
                id: +req.params.id,
            },
            data: product,
        });
        res.json(updatedProduct);
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield __1.prismaClient.product.delete({
            where: {
                id: +req.params.id,
            },
        });
        res.json(deletedProduct);
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.deleteProduct = deleteProduct;
const listProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield __1.prismaClient.product.count();
    const products = yield __1.prismaClient.product.findMany({
        skip: req.query.skip ? +req.query.skip : 0,
        take: req.query.take ? +req.query.take : 5,
    });
    res.json({ count, data: products });
});
exports.listProducts = listProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id,
            },
        });
        res.json(product);
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.getProductById = getProductById;
