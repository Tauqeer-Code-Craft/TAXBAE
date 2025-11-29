import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { ChatbotService } from "./chatbot.service";

const chatbotService = new ChatbotService();

export const chatHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  // if (!userId || !message) {
  //   return res.status(400).json({ error: "Missing userId or message" });
  // }

  const aiResponse = await chatbotService.getChatbotResponse(userId, message);
  return res.json({ message: aiResponse });
});



