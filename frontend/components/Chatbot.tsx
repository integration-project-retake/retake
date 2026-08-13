"use client";
import { useState, useEffect, useRef } from "react";
import { ChatMessage, sendChatRequest } from "@/services/chatService";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];   
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
        try {
        return JSON.parse(savedChat);
        } catch {
        return [];
        }
    }
    return [];
    });
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await sendChatRequest(currentMessages);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {isOpen && (
            <div className="mb-4 flex h-96 w-80 flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-white shadow-xl">
            <div className="flex items-center justify-between bg-pink-500 p-3">
                <img src="/logo_darkmode.png" alt="Proton AI" className="h-5 w-auto [image-rendering:pixelated]" />
                <h3 className="m-0 text-sm font-semibold text-white">Proton AI</h3>
                <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                >
                ✕
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-gray-900 p-3">
                {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                        ? "self-end bg-pink-500 text-white"
                        : "self-start bg-gray-700 text-gray-200"
                    }`}
                >
                    {msg.content}
                </div>
                ))}
                {isLoading && (
                <div className="max-w-[80%] self-start rounded-lg bg-gray-700 px-3 py-2 text-sm italic text-gray-400">
                    Typing…
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t border-gray-700 bg-gray-800 p-3">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
                className="flex-1 rounded bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
                placeholder="Ask about a game…"
                />
                <button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600 disabled:opacity-50"
                >
                Send
                </button>
            </div>
            </div>
        )}

          <button onClick={() => setIsOpen(!isOpen)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 shadow-lg transition-all hover:scale-105 hover:bg-pink-600"
            aria-label="Toggle AI Chat"
          >
            {isOpen ? (
              <span className="text-lg text-white">✕</span>
            ) : (
              <img
                src="/logo_lightmode.png"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 [image-rendering:pixelated]"
              />
            )}
          </button>
        </div>
    );
}
