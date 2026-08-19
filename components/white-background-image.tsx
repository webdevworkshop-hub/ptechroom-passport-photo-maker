"use client"

import { useEffect, useState } from "react"

interface WhiteBackgroundImageProps {
  src: string
  onResult?: (url: string) => void
}

export function WhiteBackgroundImage({
  src,
  onResult,
}: WhiteBackgroundImageProps) {
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    if (!src) return

    let outputUrl: string | null = null

    const processImage = async () => {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement("canvas")

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const ctx = canvas.getContext("2d")

        if (!ctx) return

        // White background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Put transparent person over white background
        ctx.drawImage(image, 0, 0)

        // Convert to PNG
        canvas.toBlob((blob) => {
          if (!blob) return

          outputUrl = URL.createObjectURL(blob)

          setResult(outputUrl)
          onResult?.(outputUrl)
        }, "image/png")
      }

      image.src = src
    }

    processImage()

    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl)
      }
    }
  }, [src, onResult])

  if (!result) {
    return (
      <div className="flex h-96 items-center justify-center">
        Preparing image...
      </div>
    )
  }

  return (
    <img
      src={result}
      alt="Passport photo with white background"
      className="max-h-[500px] max-w-full object-contain"
    />
  )
}
