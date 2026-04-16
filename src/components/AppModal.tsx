"use client";
// This component is a simple modal dialog that can be used to display messages, confirm actions, or show loading states. It accepts various props to customize its behavior and appearance.

import { ReactNode } from "react";

interface AppModalProps {
  open: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AppModal({
  open,
  title,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: AppModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* Header */}
            <div className="px-6 pt-6 pb-3">
                {title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                    </h2>
                )}

                {message && (
                    <p className="text-sm text-gray-500 mt-1">
                    {message}
                    </p>
                )}
            </div>

            {/* Body */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-xl cursor-pointer border border-gray-200 text-sm"
                >
                    {cancelText}
                </button>

                {onConfirm && (
                    <button
                    disabled={loading}
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-xl cursor-pointer bg-blue-600 text-white text-sm disabled:opacity-50"
                    >
                    {loading ? 'Please wait...' : confirmText}
                    </button>
                )}
                </div>
        </div>   
    </div>
  );
}
