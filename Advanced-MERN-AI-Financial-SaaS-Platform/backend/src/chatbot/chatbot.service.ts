// src/chatbot/chatbot.service.ts

import axios from "axios";
import { summaryAnalyticsService } from "../services/analytics.service";
import { convertAnalyticsToTOON } from "./toon.converter";

export class ChatbotService {
  private geminiApiKey = process.env.GEMINI_API_KEY || "";

  async getChatbotResponse(userId: string, message: string): Promise<string> {
    // 1. Fetch analytics for last 1 year (customize parameters as needed)
    const analytics = await summaryAnalyticsService(userId, "lastYear"); // adjust enum or param as per your code

    // 2. Convert analytics to TOON format
    const toonData = convertAnalyticsToTOON(analytics);

    // 3. Construct prompt for Gemini
    const prompt = `
You are a friendly financial assistant. Analyze the following TOON data and user message and provide helpful insights and recommendations.

${toonData}

User question: "${message}"
`;

    // 4. Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", // replace with actual Gemini API endpoint
      {
        model: "gemini-2.0-flash",
        input: prompt,
      },
      {
        headers: { Authorization: `Bearer ${this.geminiApiKey}` },
      }
    );

    // 5. Extract AI message from response (adjust based on API)
    return response.data.output_text || "Sorry, I couldn't generate a response.";
  }
}
