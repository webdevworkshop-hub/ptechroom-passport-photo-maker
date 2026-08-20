import { Camera } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="bg-page-mesh flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="bg-gradient-primary mb-6 flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-md shadow-primary/25">
        <Camera className="size-6" aria-hidden />
      </div>
      <p className="text-sm font-medium tracking-wide text-primary uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This page does not exist. Go back to {SITE_NAME} Passport Photo Maker to
        create a passport or ID photo.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "mt-8")}
      >
        Back to photo maker
      </Link>
    </main>
  )
}
