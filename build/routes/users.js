"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const admin_1 = __importDefault(require("../middlewares/admin"));
const users_1 = require("../controllers/users");
const userRoutes = (0, express_1.Router)();
userRoutes.post('/address', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.addAddress));
userRoutes.delete('/address/:id', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.deleteAddress));
userRoutes.get('/address', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.listAddress));
userRoutes.put('/', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.updateUser));
userRoutes.put('/:id/role', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.changeUserRole));
userRoutes.get('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.listUsers));
userRoutes.get('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.getUserById));
exports.default = userRoutes;
