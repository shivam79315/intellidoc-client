"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import FileUploadModal from "@/components/chat/FileUploadModal";

import { useSendMessage, useCreateChat } from "@/hooks/useChat";
import { IMessage } from "@/api/chats.api";
import { FileUploadIcon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ChatPage() {
  const router = useRouter();
  const { docId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create chat on first load
  useEffect(() => {
    if (!docId || typeof docId !== "string" || chatId) return;

    const initChat = async () => {
      try {
        const result = await createChatMutation.mutateAsync({
          documentId: docId,
          title: `Chat - ${new Date().toLocaleString()}`,
        });

        setChatId(result.data._id);
        setMessages(result.data.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };

    initChat();
  }, [docId, chatId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatId || sendMessageMutation.isPending) return;

    const userMsg: IMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const result = await sendMessageMutation.mutateAsync({
        chatId,
        message: input,
      });

      setMessages(result.data.messages);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm cursor-pointer text-gray-500 hover:text-gray-900"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </button>
        <span className="font-semibold text-gray-900">Document Chat</span>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-20">
            Ask anything about your document
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {sendMessageMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => setUploadOpen(true)}
            className="w-11 h-11 cursor-pointer rounded-xl border border-gray-200 flex items-center justify-center"
          >
            <HugeiconsIcon
              icon={FileUploadIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question about your document..."
            disabled={!chatId || sendMessageMutation.isPending}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !input.trim() || !chatId}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <FileUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConfirm={(file: File) => {
          setSelectedFile(file)
          setUploadOpen(false)
        }}
      />
    </div>
  );
}
