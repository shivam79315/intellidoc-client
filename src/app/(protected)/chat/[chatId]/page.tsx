"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  ArrowLeft02Icon,
  File01Icon,
  FileUploadIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import FileUploadModal from "@/components/chat/FileUploadModal";

import {
  useChat,
  useSendMessage,
} from "@/hooks/useChat";

import { useUploadChatDocument } from "@/hooks/useDocument";

import { IMessage } from "@/api/chats.api";

export default function ChatPage() {
  const router = useRouter();

  const params = useParams();

  const chatId =
    typeof params.chatId === "string"
      ? params.chatId
      : "";

  const [messages, setMessages] =
    useState<IMessage[]>([]);

  const [input, setInput] =
    useState("");

  const [uploadOpen, setUploadOpen] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  /* fetch chat */
  const {
    data,
    isLoading,
    isError,
  } = useChat(chatId);

  const sendMessageMutation =
    useSendMessage();

  const uploadDoc =
    useUploadChatDocument();

  /* load chat messages */
  useEffect(() => {
    if (
      data?.data?.messages
    ) {
      setMessages(
        data.data.messages
      );
    }
  }, [data]);

  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (
      !chatId ||
      !input.trim() ||
      sendMessageMutation.isPending
    ) {
      return;
    }

    const text = input;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    try {
      const res =
        await sendMessageMutation.mutateAsync({
          chatId,
          message: text,
        });

      setMessages(res.data.messages);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);
    }
  };

  if (!chatId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Invalid chat
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading chat...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Failed to load
          chat
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="fixed w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() =>
            router.push(
              "/dashboard"
            )
          }
          className="cursor-pointer text-gray-500 hover:text-gray-900"
        >
          <HugeiconsIcon
            icon={
              ArrowLeft02Icon
            }
            size={24}
            color="currentColor"
            strokeWidth={
              1.5
            }
          />
        </button>

        <span className="font-semibold text-gray-900">
          Chat
        </span>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-24 max-w-3xl w-full mx-auto space-y-4">
        {messages.length ===
          0 && (
          <p className="text-center text-gray-400 text-sm mt-20">
            Start chatting
          </p>
        )}

        {messages.map(
          (
            msg,
            i
          ) => (
            <div
              key={i}
              className={`flex ${
                msg.role ===
                "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.type ===
              "document" ? (
                <div className="max-w-md bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <HugeiconsIcon
                        icon={
                          File01Icon
                        }
                        size={
                          24
                        }
                        color="currentColor"
                        strokeWidth={
                          1.5
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {
                          msg
                            .document
                            ?.originalName
                        }
                      </p>

                      <p className="text-xs text-gray-500">
                        Document
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role ===
                    "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <ReactMarkdown>
                    {
                      msg.content
                    }
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )
        )}

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
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() =>
              setUploadOpen(
                true
              )
            }
            className="w-11 h-11 cursor-pointer rounded-xl border border-gray-200 flex items-center justify-center"
          >
            <HugeiconsIcon
              icon={
                FileUploadIcon
              }
              size={24}
              color="currentColor"
              strokeWidth={
                1.5
              }
            />
          </button>

          <input
            value={input}
            onChange={(
              e
            ) =>
              setInput(
                e.target
                  .value
              )
            }
            onKeyDown={(
              e
            ) =>
              e.key ===
                "Enter" &&
              handleSendMessage()
            }
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={
              handleSendMessage
            }
            disabled={
              !input.trim() ||
              sendMessageMutation.isPending
            }
            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Upload */}
      <FileUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        loading={uploadDoc.isPending}
        accept={{
          "application/pdf": [".pdf"],
          "text/plain": [".txt"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
            ".docx",
          ],
        }}
        onConfirm={(file) => {
          uploadDoc.mutate(
            { chatId, file },
            {
              onSuccess: (res) => {
                const doc = res.data.document;

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "user",
                    content: "",
                    type: "document",
                    document: {
                      _id: doc._id,
                      originalName: doc.originalName,
                      mimeType: doc.mimeType,
                      size: doc.size,
                    },
                  },
                ]);

                toast.success("File uploaded successfully");
                setUploadOpen(false);
              },

              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message ||
                    "Upload failed"
                );
              },
            }
          );
        }}
      />
    </div>
  );
}