"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { createPassportPhoto } from "@/lib/create-passport-photo"
import { loadImageFromUrl } from "@/lib/image-utils"
import type { CropAdjustments, FaceBox } from "@/types/passport-photo"

const DEFAULT_CROP: CropAdjustments = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
}

type PhotoEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transparentUrl: string | null
  backgroundColor: string
  faceBox: FaceBox | null
  widthPx: number
  heightPx: number
  crop: CropAdjustments
  onApply: (crop: CropAdjustments) => void
}

export function PhotoEditorDialog({
  open,
  onOpenChange,
  transparentUrl,
  backgroundColor,
  faceBox,
  widthPx,
  heightPx,
  crop,
  onApply,
}: PhotoEditorDialogProps) {
  const [draft, setDraft] = useState<CropAdjustments>(crop)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraft(crop)
      setPreviewUrl(null)
      imageRef.current = null
    }
    onOpenChange(nextOpen)
  }

  // Load the transparent subject once while the dialog is open.
  useEffect(() => {
    if (!open || !transparentUrl) return

    let cancelled = false

    void loadImageFromUrl(transparentUrl)
      .then((image) => {
        if (!cancelled) {
          imageRef.current = image
        }
      })
      .catch((error) => {
        console.error(error)
        if (!cancelled) {
          imageRef.current = null
          setPreviewUrl(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [open, transparentUrl])

  // Live passport preview from the same crop pipeline used by the main preview.
  useEffect(() => {
    if (!open || !faceBox || widthPx <= 0 || heightPx <= 0) return

    let cancelled = false
    let frame = 0

    const render = async () => {
      try {
        let image = imageRef.current
        if (!image && transparentUrl) {
          image = await loadImageFromUrl(transparentUrl)
          if (cancelled) return
          imageRef.current = image
        }
        if (!image) return

        const nextPreview = createPassportPhoto(image, {
          widthPx,
          heightPx,
          backgroundColor,
          faceBox,
          zoom: draft.zoom,
          offsetX: draft.offsetX,
          offsetY: draft.offsetY,
        })

        if (!cancelled) {
          setPreviewUrl(nextPreview)
        }
      } catch (error) {
        console.error(error)
      }
    }

    frame = window.requestAnimationFrame(() => {
      void render()
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
    }
  }, [
    open,
    transparentUrl,
    faceBox,
    widthPx,
    heightPx,
    backgroundColor,
    draft.zoom,
    draft.offsetX,
    draft.offsetY,
  ])

  const aspectRatio = widthPx / heightPx

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogDescription>
            Adjust zoom and position. This preview is the actual passport crop —
            background removal is not run again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div
            className="bg-gradient-surface mx-auto flex h-64 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl border"
            style={{ aspectRatio }}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Passport photo preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Preparing passport preview…
              </p>
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
                const zoom = Array.isArray(value) ? value[0] : value
                if (typeof zoom === "number") {
                  setDraft((current) => ({ ...current, zoom }))
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
                const offsetX = Array.isArray(value) ? value[0] : value
                if (typeof offsetX === "number") {
                  setDraft((current) => ({ ...current, offsetX }))
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
                const offsetY = Array.isArray(value) ? value[0] : value
                if (typeof offsetY === "number") {
                  setDraft((current) => ({ ...current, offsetY }))
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
                onApply(draft)
                onOpenChange(false)
              }}
            >
              Apply Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DEFAULT_CROP }
