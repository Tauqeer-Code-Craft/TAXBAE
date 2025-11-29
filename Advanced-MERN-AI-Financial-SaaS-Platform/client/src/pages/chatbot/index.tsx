import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="w-full h-3/5 bg-[#f7f7f8] text-gray-900">
      {/* Top Header */}
      <header className="w-full px-6 py-4 border-b bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">AI Tax Assistant</h1>
          <p className="text-sm text-gray-500">Connected • RAG Powered</p>
        </div>

        <Button variant="outline">New Chat</Button>
      </header>

      {/* Body layout */}
      <div className="flex-1 flex flex-col items-center py-10 overflow-y-auto">
        {/* Welcome message card */}
        <div className="bg-white border shadow-sm rounded-xl p-6 w-full max-w-2xl">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            ✨ Hello there! 👋 Welcome to TaxBae AI!
          </h2>

          <p className="text-sm text-gray-600 mb-3">
            I'm here to help you with:
          </p>

          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Tax planning & saving strategies 💰</li>
            <li>• Investment guidance 📈</li>
            <li>• ITR filing assistance 📝</li>
            <li>• Section-wise deduction explanations 📚</li>
            <li>• Personalized financial advice 🎯</li>
          </ul>
        </div>

        {/* Existing messages */}
        <div className="w-full max-w-2xl mt-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-lg w-fit ml-auto max-w-[70%]"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className="w-full max-w-2xl mt-8 flex flex-wrap gap-3">
          {[
            "How can I save tax this year?",
            "Explain Section 80C benefits",
            "Should I choose old or new tax regime?",
            "When should I file my ITR?",
            "Best investment options for tax saving",
          ].map((q) => (
            <Button
              key={q}
              variant="outline"
              className="text-sm rounded-full"
            >
              {q}
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Input Bar */}
      <div className="w-full border-t bg-white px-6 py-4 flex items-center gap-3">
        <Input
          placeholder="Ask me about taxes, investments, or financial planning..."
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <Button onClick={sendMessage} className="px-6">
          Send
        </Button>
      </div>
    </div>
  );
}
