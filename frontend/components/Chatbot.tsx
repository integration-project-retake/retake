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
        <div className="theme-surface theme-border mb-4 flex h-96 w-80 flex-col overflow-hidden rounded-lg border shadow-xl">
          <div className="theme-accent flex items-center gap-2 p-3">
            <img
              src="/logo_darkmode.png"
              alt=""
              className="h-5 w-auto [image-rendering:pixelated]"
            />
            <h3 className="m-0 flex-1 text-sm font-semibold">Proton AI</h3>
            <button onClick={() => setIsOpen(false)} className="opacity-80 hover:opacity-100">
              ✕
            </button>
          </div>

          <div className="theme-surface-secondary flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "theme-accent self-end"
                    : "theme-primary-text self-start"
                }`}
                style={
                  msg.role === "assistant"
                    ? { backgroundColor: "var(--surface-hover)" }
                    : undefined
                }
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div
                className="theme-secondary-text max-w-[80%] self-start rounded-lg px-3 py-2 text-sm italic"
                style={{ backgroundColor: "var(--surface-hover)" }}
              >
                Typing…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="theme-surface theme-border flex gap-2 border-t p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="theme-input theme-border flex-1 rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
              placeholder="Ask about a game…"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="theme-accent rounded px-4 py-2 text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-accent flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <span className="text-lg">✕</span>
        ) : (
          <img
            src="/logo_darkmode.png"
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
