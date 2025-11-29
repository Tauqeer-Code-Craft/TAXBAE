import { Router } from "express";
import { chatHandler } from "./chatbot.controller";

const router = Router();

router.post("/", chatHandler);

export default router;
