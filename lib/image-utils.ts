import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_SOURCE_DIMENSION,
} from "@/lib/photo-config";

export function isAcceptedImageFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (
    (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type) ||
    type === "image/jpg"
  ) {
    return true;
  }

  const name = file.name.toLowerCase();
  return (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".webp")
  );
}

export function validateImageFile(file: File): string | null {
  if (!isAcceptedImageFile(file)) {
    return "Unsupported file type. Please upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File is too large. Please upload an image under 25 MB.";
  }

  return null;
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to load image. Please try another photo."));
    image.src = url;
  });
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await loadImageFromUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Downscale extremely large sources to avoid browser memory issues.
 * Does not downscale typical camera photos used for passport printing.
 */
export async function maybeDownscaleImage(
  image: HTMLImageElement,
  maxDimension = MAX_SOURCE_DIMENSION,
): Promise<{ blob: Blob; width: number; height: number }> {
  const { naturalWidth: width, naturalHeight: height } = image;
  const largest = Math.max(width, height);

  if (largest <= maxDimension) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not prepare image for processing.");
    }
    ctx.drawImage(image, 0, 0);
    const blob = await canvasToBlob(canvas, "image/png");
    return { blob, width, height };
  }

  const scale = maxDimension / largest;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare image for processing.");
  }
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  const blob = await canvasToBlob(canvas, "image/png");
  return { blob, width: targetWidth, height: targetHeight };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/jpeg",
  quality = 0.95,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  try {
    downloadDataUrl(url, filename);
  } finally {
    // Allow the download to start before revoking.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function toUserFriendlyError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const message = error.message;

    if (
      message.includes("No face detected") ||
      message.includes("Multiple faces") ||
      message.includes("Unsupported file") ||
      message.includes("too large") ||
      message.includes("Failed to load") ||
      message.includes("Only ")
    ) {
      return message;
    }
  }

  console.error(error);
  return fallback;
}
