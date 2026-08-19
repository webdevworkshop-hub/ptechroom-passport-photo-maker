import type { PaperSize, PhotoSize } from "@/types/passport-photo"

export const PRINT_DPI = 300

export const PHOTO_SIZES: PhotoSize[] = [
  {
    id: "35x45",
    label: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
  },
  {
    id: "25x35",
    label: "25 × 35 mm",
    widthMm: 25,
    heightMm: 35,
  },
  {
    id: "30x40",
    label: "30 × 40 mm",
    widthMm: 30,
    heightMm: 40,
  },
  {
    id: "50x50",
    label: "50 × 50 mm",
    widthMm: 50,
    heightMm: 50,
  },
  {
    id: "custom",
    label: "Custom",
    widthMm: 35,
    heightMm: 45,
  },
]

export const DEFAULT_PHOTO_SIZE_ID = "35x45"

export const BACKGROUND_COLORS = {
  white: "#FFFFFF",
  blue: "#3B82F6",
} as const

export const DEFAULT_BACKGROUND: keyof typeof BACKGROUND_COLORS = "white"
export const DEFAULT_CUSTOM_BACKGROUND = BACKGROUND_COLORS.blue

function inchesToPx(inches: number, dpi = PRINT_DPI): number {
  return Math.round(inches * dpi)
}

export const PAPER_SIZES: PaperSize[] = [
  {
    id: "4x6",
    label: "4 × 6 inch",
    widthInches: 4,
    heightInches: 6,
    widthPx: inchesToPx(4),
    heightPx: inchesToPx(6),
  },
  {
    id: "5x7",
    label: "5 × 7 inch",
    widthInches: 5,
    heightInches: 7,
    widthPx: inchesToPx(5),
    heightPx: inchesToPx(7),
  },
  {
    id: "6x8",
    label: "6 × 8 inch",
    widthInches: 6,
    heightInches: 8,
    widthPx: inchesToPx(6),
    heightPx: inchesToPx(8),
  },
  {
    id: "a4",
    label: "A4",
    widthInches: 8.27,
    heightInches: 11.69,
    widthPx: inchesToPx(8.27),
    heightPx: inchesToPx(11.69),
  },
]

export const DEFAULT_PAPER_SIZE_ID = "4x6"
export const DEFAULT_COPIES = 3
export const MIN_COPIES = 1
export const MAX_COPIES = 30
export const DEFAULT_GAP_MM = 2
export const DEFAULT_MARGIN_MM = 1
export const MAX_SOURCE_DIMENSION = 4096
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const

export function getPhotoSizeById(id: string): PhotoSize {
  return PHOTO_SIZES.find((size) => size.id === id) ?? PHOTO_SIZES[0]
}

export function getPaperSizeById(id: string): PaperSize {
  return PAPER_SIZES.find((size) => size.id === id) ?? PAPER_SIZES[0]
}

export function mmToPx(mm: number, dpi = PRINT_DPI): number {
  return Math.round((mm / 25.4) * dpi)
}

export function resolvePhotoDimensions(
  photoSizeId: string,
  customWidthMm: number,
  customHeightMm: number
): {
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
  label: string
} {
  if (photoSizeId === "custom") {
    const widthMm = Math.max(10, Math.min(100, customWidthMm))
    const heightMm = Math.max(10, Math.min(100, customHeightMm))
    return {
      widthMm,
      heightMm,
      widthPx: mmToPx(widthMm),
      heightPx: mmToPx(heightMm),
      label: `${widthMm} × ${heightMm} mm`,
    }
  }

  const size = getPhotoSizeById(photoSizeId)
  return {
    widthMm: size.widthMm,
    heightMm: size.heightMm,
    widthPx: mmToPx(size.widthMm),
    heightPx: mmToPx(size.heightMm),
    label: size.label,
  }
}

export function resolveBackgroundColor(
  backgroundId: "white" | "blue" | "custom",
  customColor: string
): string {
  if (backgroundId === "custom") {
    return customColor || BACKGROUND_COLORS.blue
  }
  return BACKGROUND_COLORS[backgroundId]
}
