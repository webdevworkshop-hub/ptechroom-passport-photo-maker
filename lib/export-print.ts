import { jsPDF } from "jspdf"

import type { PaperSize } from "@/types/passport-photo"

export async function createPrintPdf(
  sheets: string[],
  paper: PaperSize
): Promise<Blob> {
  if (sheets.length === 0) {
    throw new Error("No print sheets available to export.")
  }

  const orientation =
    paper.widthInches >= paper.heightInches ? "landscape" : "portrait"

  const pdf = new jsPDF({
    orientation,
    unit: "in",
    format: [paper.widthInches, paper.heightInches],
    compress: true,
  })

  sheets.forEach((sheet, index) => {
    if (index > 0) {
      pdf.addPage([paper.widthInches, paper.heightInches], orientation)
    }

    pdf.addImage(
      sheet,
      "JPEG",
      0,
      0,
      paper.widthInches,
      paper.heightInches,
      undefined,
      "FAST"
    )
  })

  return pdf.output("blob")
}

export function openPrintDialog(sheets: string[], paper: PaperSize): void {
  if (sheets.length === 0) {
    throw new Error("No print sheets available to print.")
  }

  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    throw new Error(
      "Unable to open the print dialog. Please allow pop-ups for this site."
    )
  }

  const pagesHtml = sheets
    .map(
      (sheet, index) => `
      <div class="page">
        <img src="${sheet}" alt="Print sheet ${index + 1}" />
      </div>
    `
    )
    .join("")

  printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Print Passport Photos</title>
    <style>
      @page {
        size: ${paper.widthInches}in ${paper.heightInches}in;
        margin: 0 !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff;
        width: ${paper.widthInches}in;
        height: ${paper.heightInches}in;
      }
      .page {
        width: ${paper.widthInches}in;
        height: ${paper.heightInches}in;
        margin: 0;
        padding: 0;
        page-break-after: always;
        page-break-inside: avoid;
        overflow: hidden;
        break-after: page;
      }
      .page:last-child {
        page-break-after: auto;
        break-after: auto;
      }
      img {
        width: ${paper.widthInches}in;
        height: ${paper.heightInches}in;
        margin: 0;
        padding: 0;
        border: 0;
        display: block;
        object-fit: fill;
        vertical-align: top;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: ${paper.widthInches}in;
          height: ${paper.heightInches}in;
        }
        .page, img {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
      @media screen {
        body {
          background: #e5e5e5;
          padding: 16px;
          width: auto;
          height: auto;
        }
        .page {
          margin: 0 auto 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      }
    </style>
  </head>
  <body>
    ${pagesHtml}
    <script>
      window.onload = function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 250);
      };
    </script>
  </body>
</html>`)
  printWindow.document.close()
}
