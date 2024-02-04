"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 8000;
app.get('/test', (req, res) => {
    res.json({ data: "testing pgdgage" });
});
app.listen(PORT, () => {
    console.log(`Server is running on this port ${PORT}`);
});
