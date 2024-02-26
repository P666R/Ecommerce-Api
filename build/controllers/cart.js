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
exports.getCart = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const unauthorized_1 = require("../exceptions/unauthorized");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.CreateCartSchema.parse(req.body);
    let cartItem;
    // Check if the same product is already in the user's cart
    cartItem = yield __1.prismaClient.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: validatedData.productId,
        },
    });
    if (cartItem) {
        // If the product is already in the cart, update the quantity
        cartItem = yield __1.prismaClient.cartItem.update({
            where: {
                id: cartItem.id,
            },
            data: {
                quantity: cartItem.quantity + validatedData.quantity,
            },
        });
        return res.json(cartItem);
    }
    let product;
    // If the product is not in the cart, fetch the product details
    try {
        product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId,
            },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    // Create a new cart item for the user
    const cart = yield __1.prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity,
        },
    });
    res.json(cart);
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItem = yield __1.prismaClient.cartItem.findUnique({
        where: {
            id: +req.params.id,
        },
    });
    if (!cartItem || cartItem.userId !== req.user.id) {
        throw new unauthorized_1.UnauthorizedException('Unauthorized!', root_1.ErrorCode.UNAUTHORIZED);
    }
    yield __1.prismaClient.cartItem.delete({
        where: {
            id: +req.params.id,
        },
    });
    res.json({ success: true });
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.ChangeQuantitySchema.parse(req.body);
    const cartItem = yield __1.prismaClient.cartItem.findUnique({
        where: {
            id: +req.params.id,
        },
    });
    if (!cartItem || cartItem.userId !== req.user.id) {
        throw new unauthorized_1.UnauthorizedException('Unauthorized!', root_1.ErrorCode.UNAUTHORIZED);
    }
    const updatedCart = yield __1.prismaClient.cartItem.update({
        where: {
            id: +req.params.id,
        },
        data: {
            quantity: validatedData.quantity,
        },
    });
    res.json(updatedCart);
});
exports.changeQuantity = changeQuantity;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield __1.prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id,
        },
        include: {
            product: true,
        },
    });
    res.json(cart);
});
exports.getCart = getCart;
