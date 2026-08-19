"use client"

import { ChevronDown, Download, FileDown, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type OutputActionsProps = {
  disabled?: boolean
  onDownloadJpg: () => void
  onDownloadPdf: () => void
  onPrint: () => void
}

export function OutputActions({
  disabled,
  onDownloadJpg,
  onDownloadPdf,
  onPrint,
}: OutputActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={<Button size="lg" />}
      >
        <Download data-icon="inline-start" />
        Export
        <ChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onClick={onDownloadJpg}>
          <Download />
          JPG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDownloadPdf}>
          <FileDown />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint}>
          <Printer />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
