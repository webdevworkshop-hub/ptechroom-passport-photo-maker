"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PassportPreviewProps = {
  passportPhotoUrl: string | null
  photoLabel: string
  backgroundColor: string
  widthPx: number
  heightPx: number
  onEdit: () => void
  disabled?: boolean
}

export function PassportPreview({
  passportPhotoUrl,
  photoLabel,
  backgroundColor,
  widthPx,
  heightPx,
  onEdit,
  disabled,
}: PassportPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Passport Preview</CardTitle>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !passportPhotoUrl}
          onClick={onEdit}
        >
          Edit Photo
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex min-h-[320px] items-center justify-center rounded-lg bg-muted/40 p-6">
          {passportPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={passportPhotoUrl}
              alt="Passport photo preview"
              className="max-h-[420px] shadow-sm"
              style={{
                aspectRatio: `${widthPx} / ${heightPx}`,
                backgroundColor,
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Upload a photo to generate a passport preview.
            </p>
          )}
        </div>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>Photo: {photoLabel}</p>
          <p>
            Output: {widthPx} × {heightPx} px (300 DPI)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
