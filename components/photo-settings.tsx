"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  BACKGROUND_COLORS,
  MAX_COPIES,
  MIN_COPIES,
  PAPER_SIZES,
  PHOTO_SIZES,
} from "@/lib/photo-config"
import type { BackgroundOptionId } from "@/types/passport-photo"

type PhotoSettingsProps = {
  disabled?: boolean
  photoSizeId: string
  customWidthMm: number
  customHeightMm: number
  backgroundId: BackgroundOptionId
  customBackgroundColor: string
  copies: number
  paperSizeId: string
  gapMm: number
  marginMm: number
  onPhotoSizeIdChange: (id: string) => void
  onCustomWidthMmChange: (value: number) => void
  onCustomHeightMmChange: (value: number) => void
  onBackgroundIdChange: (id: BackgroundOptionId) => void
  onCustomBackgroundColorChange: (value: string) => void
  onCopiesChange: (value: number) => void
  onPaperSizeIdChange: (id: string) => void
  onGapMmChange: (value: number) => void
  onMarginMmChange: (value: number) => void
}

export function PhotoSettings({
  disabled,
  photoSizeId,
  customWidthMm,
  customHeightMm,
  backgroundId,
  customBackgroundColor,
  copies,
  paperSizeId,
  gapMm,
  marginMm,
  onPhotoSizeIdChange,
  onCustomWidthMmChange,
  onCustomHeightMmChange,
  onBackgroundIdChange,
  onCustomBackgroundColorChange,
  onCopiesChange,
  onPaperSizeIdChange,
  onGapMmChange,
  onMarginMmChange,
}: PhotoSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="photo-size">Photo Size</Label>
          <Select
            value={photoSizeId}
            onValueChange={(value) => {
              if (value) onPhotoSizeIdChange(value)
            }}
            disabled={disabled}
          >
            <SelectTrigger id="photo-size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHOTO_SIZES.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {photoSizeId === "custom" && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="custom-width">Width (mm)</Label>
                <Input
                  id="custom-width"
                  type="number"
                  min={10}
                  max={100}
                  step={1}
                  value={customWidthMm}
                  disabled={disabled}
                  onChange={(event) =>
                    onCustomWidthMmChange(Number(event.target.value) || 10)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custom-height">Height (mm)</Label>
                <Input
                  id="custom-height"
                  type="number"
                  min={10}
                  max={100}
                  step={1}
                  value={customHeightMm}
                  disabled={disabled}
                  onChange={(event) =>
                    onCustomHeightMmChange(Number(event.target.value) || 10)
                  }
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Background</Label>
          <RadioGroup
            value={backgroundId}
            disabled={disabled}
            onValueChange={(value) => {
              if (value === "white" || value === "blue" || value === "custom") {
                onBackgroundIdChange(value)
              }
            }}
            className="grid gap-2"
          >
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2">
              <RadioGroupItem value="white" />
              <span
                className="size-4 rounded-sm border"
                style={{ backgroundColor: BACKGROUND_COLORS.white }}
              />
              <span className="text-sm">White</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2">
              <RadioGroupItem value="blue" />
              <span
                className="size-4 rounded-sm border"
                style={{ backgroundColor: BACKGROUND_COLORS.blue }}
              />
              <span className="text-sm">Blue</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2">
              <RadioGroupItem value="custom" />
              <span className="text-sm">Custom</span>
            </label>
          </RadioGroup>

          {backgroundId === "custom" && (
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={customBackgroundColor}
                disabled={disabled}
                className="h-10 w-14 cursor-pointer p-1"
                onChange={(event) =>
                  onCustomBackgroundColorChange(event.target.value)
                }
              />
              <Input
                type="text"
                value={customBackgroundColor}
                disabled={disabled}
                className="font-mono uppercase"
                onChange={(event) =>
                  onCustomBackgroundColorChange(event.target.value)
                }
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Copies</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || copies <= MIN_COPIES}
              onClick={() => onCopiesChange(Math.max(MIN_COPIES, copies - 1))}
            >
              <Minus />
            </Button>
            <span className="w-10 text-center text-lg font-semibold">
              {copies}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || copies >= MAX_COPIES}
              onClick={() => onCopiesChange(Math.min(MAX_COPIES, copies + 1))}
            >
              <Plus />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="paper-size">Paper Size</Label>
          <Select
            value={paperSizeId}
            disabled={disabled}
            onValueChange={(value) => {
              if (value) onPaperSizeIdChange(value)
            }}
          >
            <SelectTrigger id="paper-size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAPER_SIZES.map((paper) => (
                <SelectItem key={paper.id} value={paper.id}>
                  {paper.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="gap-mm">Gap (mm)</Label>
            <Input
              id="gap-mm"
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={gapMm}
              disabled={disabled}
              onChange={(event) =>
                onGapMmChange(Math.max(0, Number(event.target.value) || 0))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="margin-mm">Margin (mm)</Label>
            <Input
              id="margin-mm"
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={marginMm}
              disabled={disabled}
              onChange={(event) =>
                onMarginMmChange(Math.max(0, Number(event.target.value) || 0))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
