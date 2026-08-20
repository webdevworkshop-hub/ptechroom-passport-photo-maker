import { ImageResponse } from "next/og"

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const alt =
  "PTechRoom Passport Photo Maker — free online ID photos with AI background removal"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "linear-gradient(145deg, #10242c 0%, #16343a 42%, #1a6b75 100%)",
        color: "#f7fbfb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 28,
          letterSpacing: -0.4,
          color: "#b7e4dc",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #2d9d8a 0%, #1a6b75 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 22,
              height: 16,
              border: "2px solid #fff",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                border: "2px solid #fff",
                borderRadius: 6,
              }}
            />
          </div>
        </div>
        {SITE_NAME}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1.8,
            maxWidth: 980,
          }}
        >
          Free Passport Photo Maker
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.4,
            color: "#d4eee9",
            maxWidth: 860,
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          color: "#9fd4cb",
        }}
      >
        <span>35×45 mm · 300 DPI · JPG &amp; PDF</span>
        <span>passport-photo.ptechroom.online</span>
      </div>
    </div>,
    { ...size }
  )
}
