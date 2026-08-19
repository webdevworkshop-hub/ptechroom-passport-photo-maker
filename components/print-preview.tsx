"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PrintSheetResult } from "@/types/passport-photo"

type PrintPreviewProps = {
  sheets: string[]
  sheetInfo: PrintSheetResult | null
  paperLabel: string
  paperWidthPx: number
  paperHeightPx: number
  copies: number
  photoLabel: string
}

export function PrintPreview({
  sheets,
  sheetInfo,
  paperLabel,
  paperWidthPx,
  paperHeightPx,
  copies,
  photoLabel,
}: PrintPreviewProps) {
  const fitWarning =
    sheetInfo && sheetInfo.maxPerSheet > 0 && copies > sheetInfo.maxPerSheet
      ? `Only ${sheetInfo.maxPerSheet} photos fit on this sheet. ${sheetInfo.sheetsNeeded} sheets required.`
      : null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Print Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Paper: {paperLabel}</p>
          <p>
            Resolution: {paperWidthPx} × {paperHeightPx} px
          </p>
          <p>Copies: {copies}</p>
          <p>Photo: {photoLabel}</p>
          {sheetInfo && (
            <>
              <p>
                Layout: {sheetInfo.columns} × {sheetInfo.rows} (
                {sheetInfo.maxPerSheet} / sheet)
              </p>
              <p>Sheets: {sheetInfo.sheetsNeeded}</p>
            </>
          )}
        </div>

        {fitWarning && (
          <div className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {fitWarning}
          </div>
        )}

        <div className="bg-gradient-surface flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl lg:p-4">
          {sheets.length > 0 ? (
            sheets.map((sheet, index) => (
              <div key={`${index}-${sheet.slice(0, 32)}`} className="w-full">
                {sheets.length > 1 && (
                  <p className="mb-2 text-center text-xs text-muted-foreground">
                    Sheet {index + 1} of {sheets.length}
                  </p>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sheet}
                  alt={`Print sheet ${index + 1}`}
                  className="mx-auto w-full max-w-[420px] rounded-md shadow-md"
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Print sheet will appear automatically after processing.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
