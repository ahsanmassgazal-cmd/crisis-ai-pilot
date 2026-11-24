"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Ltr } from "@/components/layout/Ltr";

export interface FileDropzoneProps {
  accept?: string;
  maxSizeMb?: number;
  onFileSelect?: (file: File) => void;
  hint?: string;
}

export function FileDropzone({
  accept = ".csv,.xlsx,.json,.pdf",
  maxSizeMb = 15,
  onFileSelect,
  hint = "Supports CSV, XLSX, JSON or PDF up to 15 MB"
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMb} MB limit.`);
      return;
    }
    setError(null);
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          isDragOver
            ? "border-brand-500 bg-brand-500/10"
            : "border-border-subtle bg-surface-base hover:border-brand-500/50 hover:bg-surface-elevated"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="rounded-full bg-surface-elevated p-3 border border-border-subtle text-brand-500 mb-2">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-xs font-semibold text-text-main">
          Click to upload or drag and drop
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 rounded-lg bg-critical-500/10 border border-critical-500/20 px-3 py-2 text-xs text-critical-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && !error && (
        <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-elevated p-2.5 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-4 w-4 text-brand-500 shrink-0" />
            <div className="truncate">
              <p className="font-medium text-text-main truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-text-muted">
                <Ltr>{(selectedFile.size / 1024).toFixed(1)} KB</Ltr>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="rounded p-1 text-text-muted hover:bg-surface-base hover:text-text-main"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
