"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CropAdjustments } from "@/types/passport-photo";

const DEFAULT_CROP: CropAdjustments = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

type PhotoEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transparentUrl: string | null;
  backgroundColor: string;
  crop: CropAdjustments;
  aspectRatio: number;
  onApply: (crop: CropAdjustments) => void;
};

export function PhotoEditorDialog({
  open,
  onOpenChange,
  transparentUrl,
  backgroundColor,
  crop,
  aspectRatio,
  onApply,
}: PhotoEditorDialogProps) {
  const [draft, setDraft] = useState<CropAdjustments>(crop);

  useEffect(() => {
    if (open) {
      setDraft(crop);
    }
  }, [open, crop]);

  const previewTransform = {
    transform: `translate(${draft.offsetX * 18}%, ${draft.offsetY * 18}%) scale(${draft.zoom})`,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogDescription>
            Adjust zoom and position. Changes apply to the passport crop only —
            background removal is not run again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div
            className="mx-auto flex h-64 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg border"
            style={{
              backgroundColor,
              aspectRatio,
            }}
          >
            {transparentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={transparentUrl}
                alt="Editable subject"
                className="h-full w-full object-cover transition-transform"
                style={previewTransform}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No photo loaded</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Zoom</Label>
              <span className="text-xs text-muted-foreground">
                {draft.zoom.toFixed(2)}×
              </span>
            </div>
            <Slider
              min={1}
              max={2.5}
              step={0.01}
              value={[draft.zoom]}
              onValueChange={(value) => {
                const zoom = Array.isArray(value) ? value[0] : value;
                if (typeof zoom === "number") {
                  setDraft((current) => ({ ...current, zoom }));
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Horizontal</Label>
              <span className="text-xs text-muted-foreground">
                {draft.offsetX.toFixed(2)}
              </span>
            </div>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={[draft.offsetX]}
              onValueChange={(value) => {
                const offsetX = Array.isArray(value) ? value[0] : value;
                if (typeof offsetX === "number") {
                  setDraft((current) => ({ ...current, offsetX }));
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Vertical</Label>
              <span className="text-xs text-muted-foreground">
                {draft.offsetY.toFixed(2)}
              </span>
            </div>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={[draft.offsetY]}
              onValueChange={(value) => {
                const offsetY = Array.isArray(value) ? value[0] : value;
                if (typeof offsetY === "number") {
                  setDraft((current) => ({ ...current, offsetY }));
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDraft(DEFAULT_CROP)}
          >
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DEFAULT_CROP };
