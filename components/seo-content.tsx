import {
  Crop,
  Download,
  Printer,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FAQ_ITEMS, SITE_NAME } from "@/lib/site"

const STEPS = [
  {
    title: "Upload a photo",
    body: "Drop in a JPG, PNG, or WEBP (up to 25 MB). A clear, front-facing portrait works best.",
    icon: Upload,
  },
  {
    title: "AI removes the background",
    body: "Background removal and face detection run locally in your browser. The original photo is not uploaded.",
    icon: Sparkles,
  },
  {
    title: "Adjust size and crop",
    body: "Pick 35 × 45 mm or another ID size, choose a white, blue, or custom background, then fine-tune the crop.",
    icon: Crop,
  },
  {
    title: "Print or download",
    body: "Lay out 1–30 copies on 4 × 6, 5 × 7, 6 × 8, or A4 paper and export a 300 DPI JPG or PDF.",
    icon: Printer,
  },
] as const

const FEATURES = [
  {
    title: "Private by design",
    body: "Processing stays on your device. Nothing is stored on a server after you close the tab.",
    icon: ShieldCheck,
  },
  {
    title: "Print-ready 300 DPI",
    body: "Photos are sized in millimetres and rendered at 300 DPI so they stay sharp at the photo lab or home printer.",
    icon: Download,
  },
  {
    title: "One upload, many outputs",
    body: "Change copies, paper size, gap, and background without running AI again.",
    icon: Sparkles,
  },
] as const

const PHOTO_SIZES = [
  { size: "35 × 45 mm", use: "Most passports and visas" },
  { size: "25 × 35 mm", use: "Smaller ID formats" },
  { size: "30 × 40 mm", use: "Common national ID size" },
  { size: "50 × 50 mm", use: "Square ID and visa photos" },
  { size: "Custom mm", use: "Any size from 10 × 10 mm to 100 × 100 mm" },
] as const

export function SeoContent() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 pb-12 md:px-10">
      <section aria-labelledby="how-it-works-heading" className="space-y-4">
        <div className="space-y-2">
          <h2
            id="how-it-works-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            How to make a passport photo online
          </h2>
          <p className="max-w-3xl text-muted-foreground">
            PTechRoom Passport Photo Maker turns a casual portrait into a
            print-ready ID photo. Upload once, then change settings and export
            without sending the image anywhere.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="group/step h-full">
              <Card className="relative h-full overflow-hidden transition-[transform,box-shadow] duration-300 ease-out group-hover/step:-translate-y-1.5 group-hover/step:shadow-lg group-hover/step:shadow-primary/15 before:pointer-events-none before:absolute before:-top-12 before:-right-10 before:size-28 before:rounded-full before:bg-primary/20 before:opacity-0 before:blur-2xl before:transition-opacity before:duration-300 group-hover/step:before:opacity-100 motion-reduce:transition-none motion-reduce:group-hover/step:translate-y-0">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-primary flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-sm shadow-primary/20 transition-transform duration-300 ease-out group-hover/step:scale-110 motion-reduce:transition-none">
                      <step.icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors duration-300 group-hover/step:text-primary">
                      Step {index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-base transition-colors duration-300 group-hover/step:text-primary">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="features-heading" className="space-y-4">
        <h2
          id="features-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Why use this ID photo tool
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="transition-[box-shadow,ring-color] duration-300 hover:shadow-md hover:shadow-primary/15 hover:ring-primary/40 dark:hover:ring-primary/50"
            >
              <CardHeader className="space-y-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <feature.icon className="size-4" aria-hidden />
                </span>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sizes-heading" className="space-y-4">
        <div className="space-y-2">
          <h2
            id="sizes-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Passport and ID photo sizes
          </h2>
          <p className="max-w-3xl text-muted-foreground">
            Choose a preset or enter a custom millimetre size. Always confirm
            the latest size, background, and head-height rules for the country
            or document you are applying for.
          </p>
        </div>
        <Card>
          <CardContent className="pt-1">
            <ul className="divide-y divide-border">
              {PHOTO_SIZES.map((item) => (
                <li
                  key={item.size}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-3"
                >
                  <span className="font-medium">{item.size}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.use}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="faq-heading" className="space-y-4">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
          Passport photo FAQ
        </h2>
        <Accordion defaultValue={[FAQ_ITEMS[0].id]} className="gap-3">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-gradient-card overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-[box-shadow,ring-color] not-last:border-b-0 dark:ring-white/10 data-open:shadow-md data-open:shadow-primary/10 data-open:ring-primary/25 dark:data-open:ring-primary/35"
            >
              <AccordionTrigger className="rounded-none px-4 py-4 hover:bg-primary/5 aria-expanded:bg-primary/5 **:data-[slot=accordion-trigger-icon]:size-8 **:data-[slot=accordion-trigger-icon]:rounded-full **:data-[slot=accordion-trigger-icon]:bg-secondary **:data-[slot=accordion-trigger-icon]:p-2 **:data-[slot=accordion-trigger-icon]:text-primary sm:px-5">
                <span className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-semibold text-primary tabular-nums shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="min-w-0 text-left font-heading text-base leading-snug font-semibold tracking-tight">
                    {item.question}
                  </h3>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-5 sm:px-5">
                <p className="max-w-3xl leading-relaxed text-muted-foreground sm:pl-12">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>
          {SITE_NAME} Passport Photo Maker · Photos are processed in your
          browser and are not uploaded to our servers.
        </p>
      </footer>
    </div>
  )
}
