import {
  FAQ_ITEMS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site"

function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function JsonLd() {
  const webApplication = {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: "Passport Photo Maker",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in a modern web browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    featureList: [
      "AI background removal in the browser",
      "Passport and ID photo sizes including 35 × 45 mm",
      "300 DPI print sheets",
      "JPG and PDF download",
      "White, blue, or custom backgrounds",
    ],
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Passport Photo Maker",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#app` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/opengraph-image`,
        },
      },
      webApplication,
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Passport Photo Maker",
            item: SITE_URL,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }}
    />
  )
}
