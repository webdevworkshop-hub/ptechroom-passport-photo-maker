import { PassportPhotoMaker } from "@/components/passport-photo-maker"

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef2f7_45%,#e8edf5_100%)]">
      <PassportPhotoMaker />
    </main>
  )
}
