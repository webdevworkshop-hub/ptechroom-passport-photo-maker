import type { PrintSheetResult } from "@/types/passport-photo"
import { loadImageFromUrl } from "@/lib/image-utils"

export type CreatePrintSheetOptions = {
  photoUrl: string
  copies: number
  paperWidthPx: number
  paperHeightPx: number
  photoWidthPx: number
  photoHeightPx: number
  gapPx?: number
  marginPx?: number
}

/**
 * Lay out passport photos on one or more print sheets.
 * Automatically calculates columns/rows from paper size, photo size, gap, and margin.
 */
export async function createPrintSheet(
  options: CreatePrintSheetOptions
): Promise<PrintSheetResult> {
  const {
    photoUrl,
    copies,
    paperWidthPx,
    paperHeightPx,
    photoWidthPx,
    photoHeightPx,
    gapPx = 24,
    marginPx = 24,
  } = options

  if (copies < 1) {
    throw new Error("Copies must be at least 1.")
  }

  const image = await loadImageFromUrl(photoUrl)

  const layout = calculateLayout({
    paperWidthPx,
    paperHeightPx,
    photoWidthPx,
    photoHeightPx,
    gapPx,
    marginPx,
  })

  if (layout.maxPerSheet < 1) {
    throw new Error(
      "No photos fit on this sheet. Try a smaller photo size or smaller margins/gap."
    )
  }

  const sheetsNeeded = Math.ceil(copies / layout.maxPerSheet)
  const sheets: string[] = []

  for (let sheetIndex = 0; sheetIndex < sheetsNeeded; sheetIndex++) {
    const start = sheetIndex * layout.maxPerSheet
    const count = Math.min(layout.maxPerSheet, copies - start)

    sheets.push(
      drawSheet({
        image,
        paperWidthPx,
        paperHeightPx,
        photoWidthPx,
        photoHeightPx,
        gapPx,
        marginPx,
        columns: layout.columns,
        photosOnSheet: count,
      })
    )
  }

  return {
    sheets,
    maxPerSheet: layout.maxPerSheet,
    columns: layout.columns,
    rows: layout.rows,
    sheetsNeeded,
    photosRequested: copies,
    photosPlaced: copies,
  }
}

export function calculateLayout({
  paperWidthPx,
  paperHeightPx,
  photoWidthPx,
  photoHeightPx,
  gapPx,
  marginPx,
}: {
  paperWidthPx: number
  paperHeightPx: number
  photoWidthPx: number
  photoHeightPx: number
  gapPx: number
  marginPx: number
}) {
  const availableWidth = paperWidthPx - marginPx * 2
  const availableHeight = paperHeightPx - marginPx * 2

  const columns = Math.max(
    0,
    Math.floor((availableWidth + gapPx) / (photoWidthPx + gapPx))
  )
  const rows = Math.max(
    0,
    Math.floor((availableHeight + gapPx) / (photoHeightPx + gapPx))
  )

  return {
    columns,
    rows,
    maxPerSheet: columns * rows,
  }
}

function drawSheet({
  image,
  paperWidthPx,
  paperHeightPx,
  photoWidthPx,
  photoHeightPx,
  gapPx,
  marginPx,
  columns,
  photosOnSheet,
}: {
  image: HTMLImageElement
  paperWidthPx: number
  paperHeightPx: number
  photoWidthPx: number
  photoHeightPx: number
  gapPx: number
  marginPx: number
  columns: number
  photosOnSheet: number
}): string {
  const canvas = document.createElement("canvas")
  canvas.width = paperWidthPx
  canvas.height = paperHeightPx

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Could not create canvas context.")
  }

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, paperWidthPx, paperHeightPx)

  const gridWidth = columns * photoWidthPx + (columns - 1) * gapPx

  // Center horizontally, pin to the top with a low margin for shop printing.
  const startX = (paperWidthPx - gridWidth) / 2
  const startY = marginPx

  for (let index = 0; index < photosOnSheet; index++) {
    const column = index % columns
    const row = Math.floor(index / columns)
    const x = startX + column * (photoWidthPx + gapPx)
    const y = startY + row * (photoHeightPx + gapPx)

    ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx)
  }

  return canvas.toDataURL("image/jpeg", 0.95)
}
