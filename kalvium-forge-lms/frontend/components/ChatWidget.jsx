"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { Send, Bot, User, Trash2 } from "lucide-react";

const CHAT_STORAGE_KEY = (id) => `forge_chat_history_${id}`;

const WELCOME_MSG = {
  id: "welcome",
  role: "ai",
  text: "Hi! I'm your Forge AI Assistant. Ask me anything about your profile or courses — I can also update your details for you.",
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-gray-500" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI avatar (left) */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-gray-500" />
        </div>
      )}

      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>

      {/* User avatar (right) */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
          <User size={14} className="text-indigo-600" />
        </div>
      )}
    </div>
  );
}

export default function ChatWidget({ fetchProfile, studentId }) {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const didLoadRef = useRef(false);

  // Load persisted history when studentId is known
  useEffect(() => {
    if (!studentId || didLoadRef.current) return;
    function loadHistory() {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY(studentId));
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        // corrupted storage — ignore and keep welcome message
      }
    }
    loadHistory();
    didLoadRef.current = true;
  }, [studentId]);

  // Persist messages to localStorage on every change (skip lone welcome msg)
  useEffect(() => {
    if (!studentId) return;
    if (messages.length === 1 && messages[0].id === "welcome") return;
    function persistHistory() {
      localStorage.setItem(CHAT_STORAGE_KEY(studentId), JSON.stringify(messages));
    }
    persistHistory();
  }, [messages, studentId]);

  const clearHistory = useCallback(() => {
    if (!studentId) return;
    localStorage.removeItem(CHAT_STORAGE_KEY(studentId));
    didLoadRef.current = false;
    setMessages([WELCOME_MSG]);
  }, [studentId]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/chat`, {
        message: text,
        studentId: studentId ?? localStorage.getItem("studentId"),
      });

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: res.data.reply || "I didn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, aiMsg]);

      // CRITICAL: Re-fetch profile if the agent updated the database
      if (res.data.databaseUpdated === true) {
        await fetchProfile();
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Sorry, I couldn't reach the server. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Forge AI Assistant</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-green-500">
            AI Powered System
          </p>
        </div>
        <button
          onClick={() => {
            if (studentId) localStorage.removeItem(CHAT_STORAGE_KEY(studentId));
            setMessages([WELCOME_MSG]);
          }}
          title="Clear chat history"
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50/50">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to update your profile..."
            disabled={loading}
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400 text-gray-700 transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Forge AI can assist with profile updates and course information.
        </p>
      </div>
    </div>
  );
}
