import { PassportPhotoMaker } from "@/components/passport-photo-maker"
import { SeoContent } from "@/components/seo-content"

export default function Home() {
  return (
    <main className="bg-page-mesh min-h-screen">
      <PassportPhotoMaker />
      <SeoContent />
    </main>
  )
}
