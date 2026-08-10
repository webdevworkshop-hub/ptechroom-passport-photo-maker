import type { CropAdjustments, FaceBox } from "@/types/passport-photo";

export type CreatePassportPhotoOptions = {
  widthPx: number;
  heightPx: number;
  backgroundColor: string;
  faceBox: FaceBox;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
};

/**
 * Build a passport photo from a transparent (or source) person image.
 * Does not stretch the subject — crops to the output aspect ratio.
 */
export function createPassportPhoto(
  image: HTMLImageElement,
  options: CreatePassportPhotoOptions,
): string {
  const {
    widthPx,
    heightPx,
    backgroundColor,
    faceBox,
    zoom = 1,
    offsetX = 0,
    offsetY = 0,
  } = options;

  if (widthPx <= 0 || heightPx <= 0) {
    throw new Error("Invalid passport photo dimensions.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  const crop = computeCropRect(image, faceBox, widthPx / heightPx, {
    zoom,
    offsetX,
    offsetY,
  });

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, widthPx, heightPx);

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    widthPx,
    heightPx,
  );

  return canvas.toDataURL("image/jpeg", 0.95);
}

function computeCropRect(
  image: HTMLImageElement,
  faceBox: FaceBox,
  outputAspect: number,
  adjustments: CropAdjustments,
) {
  const imgW = image.naturalWidth;
  const imgH = image.naturalHeight;

  const faceCenterX = faceBox.originX + faceBox.width / 2;
  const faceTop = faceBox.originY;

  // Base framing: headroom above face, chin + upper shoulders below.
  let cropHeight = faceBox.height * 3.05;
  let cropWidth = cropHeight * outputAspect;

  // Ensure face is not cropped horizontally.
  const minFaceWidth = faceBox.width * 1.75;
  if (cropWidth < minFaceWidth) {
    cropWidth = minFaceWidth;
    cropHeight = cropWidth / outputAspect;
  }

  const safeZoom = Math.min(3, Math.max(1, adjustments.zoom));
  cropWidth /= safeZoom;
  cropHeight /= safeZoom;

  // Face top sits ~18% down from the top of the crop.
  let cropX = faceCenterX - cropWidth / 2;
  let cropY = faceTop - cropHeight * 0.18;

  // Manual pan — relative to crop size.
  cropX += adjustments.offsetX * cropWidth * 0.45;
  cropY += adjustments.offsetY * cropHeight * 0.45;

  // If the ideal crop is larger than the image, shrink while keeping aspect.
  if (cropWidth > imgW || cropHeight > imgH) {
    const scale = Math.min(imgW / cropWidth, imgH / cropHeight);
    const nextWidth = cropWidth * scale;
    const nextHeight = cropHeight * scale;
    cropX += (cropWidth - nextWidth) / 2;
    cropY += (cropHeight - nextHeight) / 2;
    cropWidth = nextWidth;
    cropHeight = nextHeight;
  }

  cropX = clamp(cropX, 0, Math.max(0, imgW - cropWidth));
  cropY = clamp(cropY, 0, Math.max(0, imgH - cropHeight));

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
