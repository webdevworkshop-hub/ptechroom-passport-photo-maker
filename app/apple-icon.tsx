import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2d9d8a 0%, #1a6b75 100%)",
        borderRadius: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 96,
          height: 78,
          border: "8px solid #fff",
          borderRadius: 16,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "8px solid #fff",
            borderRadius: 36,
          }}
        />
      </div>
    </div>,
    { ...size }
  )
}
