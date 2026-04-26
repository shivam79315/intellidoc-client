"use client";

import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileUploadIcon } from "@hugeicons/core-free-icons";
import AppModal from "@/components/AppModal";

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
  accept?: Accept;
  loading?: boolean;
}

export default function FileUploadModal({
  open,
  onClose,
  onConfirm,
  accept,
  loading = false,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });

  const handleClose = () => {
    if (loading) return;
    setFile(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!file || loading) return;
    onConfirm(file);
  };

  return (
    <AppModal
      open={open}
      title="Upload File"
      message="Drag & drop file here or browse"
      confirmText="Upload"
      cancelText="Cancel"
      onCancel={handleClose}
      onConfirm={handleConfirm}
      loading={loading}
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed  cursor-pointer rounded-2xl p-8 text-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />

        <HugeiconsIcon
            className="mx-auto mb-3 text-gray-400"
            icon={FileUploadIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
        />

        <p className="text-sm text-gray-600">
          {file ? file.name : "Drop file here or click to select"}
        </p>
      </div>
    </AppModal>
  );
}
