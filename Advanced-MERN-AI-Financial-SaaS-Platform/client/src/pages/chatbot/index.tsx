import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  // Static responses for quick actions
  const quickAnswers: Record<string, string> = {
    "How can I save tax this year?":
      "You can save tax using Section 80C (₹1.5L), ELSS funds, PPF, NPS additional ₹50,000 under 80CCD(1B), health insurance under 80D, and home loan deductions under 24B and 80EE/80EEA.",
    "Explain Section 80C benefits":
      "Section 80C allows deductions up to ₹1.5L for investments like ELSS, PPF, EPF, life insurance premiums, home loan principal, Sukanya Samriddhi Yojana, and tax-saving FDs.",
    "Should I choose old or new tax regime?":
      "Choose the **old regime** if you claim many deductions (80C, HRA, etc). Choose the **new regime** if your deductions are low — it offers lower tax slabs with no major exemptions.",
    "When should I file my ITR?":
      "For most individuals, the ITR filing deadline is **31st July** each year. If books of accounts need audit, the deadline is **31st October**.",
    "Best investment options for tax saving":
      "Top tax-saving investments include ELSS mutual funds, PPF, NPS, tax-saving FDs, and life insurance. ELSS offers the best liquidity + high return potential.",
  };

  const sendMessage = (msg: string) => {
    setMessages((prev) => [...prev, { role: "user", text: msg }]);

    // Add bot reply (if available)
    if (quickAnswers[msg]) {
      setMessages((prev) => [...prev, { role: "bot", text: quickAnswers[msg] }]);
    }
  };

  const sendTypedMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const quickQuestions = Object.keys(quickAnswers);

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
        
        {/* Welcome Message */}
        <div className="bg-white border shadow-sm rounded-xl p-6 w-full max-w-2xl">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            ✨ Hello there! 👋 Welcome to TaxBae AI!
          </h2>

          <p className="text-sm text-gray-600 mb-3">I'm here to help you with:</p>

          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Tax planning & saving strategies 💰</li>
            <li>• Investment guidance 📈</li>
            <li>• ITR filing assistance 📝</li>
            <li>• Section-wise deduction explanations 📚</li>
            <li>• Personalized financial advice 🎯</li>
          </ul>
        </div>

        {/* Messages */}
        <div className="w-full max-w-2xl mt-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-lg w-fit ml-auto max-w-[70%]"
                  : "bg-gray-100 border border-gray-300 p-3 rounded-lg w-fit max-w-[80%]"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className="w-full max-w-2xl mt-8 flex flex-wrap gap-3">
          {quickQuestions.map((q) => (
            <Button
              key={q}
              variant="outline"
              className="text-sm rounded-full"
              onClick={() => sendMessage(q)}
            >
              {q}
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Input Bar */}
      <div className="w-full border-t bg-white mt-20 px-6 py-4 flex items-center gap-3">
        <Input
          placeholder="Ask me about taxes, investments, or financial planning..."
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendTypedMessage()}
        />

        <Button onClick={sendTypedMessage} className="px-6">
          Send
        </Button>
      </div>
    </div>
  );
}
