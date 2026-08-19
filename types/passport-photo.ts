export type FaceBox = {
  originX: number
  originY: number
  width: number
  height: number
}

export type PhotoSize = {
  id: string
  label: string
  widthMm: number
  heightMm: number
}

export type PaperSize = {
  id: string
  label: string
  widthInches: number
  heightInches: number
  widthPx: number
  heightPx: number
}

export type BackgroundOptionId = "white" | "blue" | "custom"

export type CropAdjustments = {
  zoom: number
  offsetX: number
  offsetY: number
}

export type UploadedPhotoMeta = {
  name: string
  width: number
  height: number
  sizeBytes: number
  type: string
}

export type ProcessingStatus =
  | "idle"
  | "removing-background"
  | "detecting-face"
  | "creating-passport"
  | "creating-sheet"
  | "done"
  | "error"

export type PrintSheetResult = {
  sheets: string[]
  maxPerSheet: number
  columns: number
  rows: number
  sheetsNeeded: number
  photosRequested: number
  photosPlaced: number
}
