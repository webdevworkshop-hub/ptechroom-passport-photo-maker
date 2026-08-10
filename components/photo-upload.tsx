"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/image-utils";
import type { ProcessingStatus, UploadedPhotoMeta } from "@/types/passport-photo";
import { cn } from "@/lib/utils";

type PhotoUploadProps = {
  disabled?: boolean;
  status: ProcessingStatus;
  statusMessage: string;
  meta: UploadedPhotoMeta | null;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
};

const STATUS_PROGRESS: Record<ProcessingStatus, number> = {
  idle: 0,
  "removing-background": 30,
  "detecting-face": 55,
  "creating-passport": 75,
  "creating-sheet": 90,
  done: 100,
  error: 0,
};

export function PhotoUpload({
  disabled,
  status,
  statusMessage,
  meta,
  previewUrl,
  onFileSelected,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const isProcessing =
    status === "removing-background" ||
    status === "detecting-face" ||
    status === "creating-passport" ||
    status === "creating-sheet";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed lg:px-6 lg:py-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-muted/60"
              : "border-border bg-muted/20",
            disabled && "opacity-60",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            handleFiles(event.dataTransfer.files);
          }}
        >
          <Upload className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Drop a customer photo here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, or WEBP · up to 25 MB
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            Upload Photo
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {(isProcessing || statusMessage) && (
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <p
                className={cn(
                  "text-sm",
                  status === "error" ? "text-destructive" : "text-foreground",
                )}
              >
                {statusMessage || "Ready"}
              </p>
              {isProcessing && (
                <span className="text-xs text-muted-foreground">Processing</span>
              )}
            </div>
            {isProcessing && (
              <Progress value={STATUS_PROGRESS[status]} className="h-1.5" />
            )}
          </div>
        )}

        {meta && (
          <div className="grid gap-2 rounded-lg border p-3 text-sm grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Filename</p>
              <p className="truncate font-medium">{meta.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dimensions</p>
              <p className="font-medium">
                {meta.width} × {meta.height} px
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Size</p>
              <p className="font-medium">{formatBytes(meta.sizeBytes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="font-medium uppercase">
                {meta.type.replace("image/", "") || "image"}
              </p>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="rounded-lg border bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-size-[16px_16px] bg-position-[0_0,0_8px,8px_-8px,-8px_0] p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Processed (transparent subject)
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Background removed"
              className="mx-auto max-h-48 object-contain"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
