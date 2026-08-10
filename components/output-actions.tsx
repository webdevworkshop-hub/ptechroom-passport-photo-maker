"use client";

import { Download, FileDown, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OutputActionsProps = {
  disabled?: boolean;
  onDownloadJpg: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
};

export function OutputActions({
  disabled,
  onDownloadJpg,
  onDownloadPdf,
  onPrint,
}: OutputActionsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={disabled}
            onClick={onDownloadJpg}
          >
            <Download data-icon="inline-start" />
            Download JPG
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={disabled}
            onClick={onDownloadPdf}
          >
            <FileDown data-icon="inline-start" />
            Download PDF
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={disabled}
            onClick={onPrint}
          >
            <Printer data-icon="inline-start" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
