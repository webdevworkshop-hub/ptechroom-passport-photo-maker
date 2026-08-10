"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { removeBackground } from "rembg-webgpu";

import { OutputActions } from "@/components/output-actions";
import { PassportPreview } from "@/components/passport-preview";
import {
  DEFAULT_CROP,
  PhotoEditorDialog,
} from "@/components/photo-editor-dialog";
import { PhotoSettings } from "@/components/photo-settings";
import { PhotoUpload } from "@/components/photo-upload";
import { PrintPreview } from "@/components/print-preview";
import { createPassportPhoto } from "@/lib/create-passport-photo";
import { createPrintSheet } from "@/lib/create-print-sheet";
import { createPrintPdf, openPrintDialog } from "@/lib/export-print";
import { getFaceDetector } from "@/lib/face-detector";
import {
  downloadBlob,
  downloadDataUrl,
  loadImageFromFile,
  loadImageFromUrl,
  maybeDownscaleImage,
  toUserFriendlyError,
  validateImageFile,
} from "@/lib/image-utils";
import {
  DEFAULT_BACKGROUND,
  DEFAULT_COPIES,
  DEFAULT_CUSTOM_BACKGROUND,
  DEFAULT_GAP_MM,
  DEFAULT_MARGIN_MM,
  DEFAULT_PAPER_SIZE_ID,
  DEFAULT_PHOTO_SIZE_ID,
  getPaperSizeById,
  mmToPx,
  resolveBackgroundColor,
  resolvePhotoDimensions,
} from "@/lib/photo-config";
import type {
  BackgroundOptionId,
  CropAdjustments,
  FaceBox,
  PrintSheetResult,
  ProcessingStatus,
  UploadedPhotoMeta,
} from "@/types/passport-photo";

export function PassportPhotoMaker() {
  const [transparentUrl, setTransparentUrl] = useState<string | null>(null);
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string | null>(null);
  const [printSheets, setPrintSheets] = useState<string[]>([]);
  const [sheetInfo, setSheetInfo] = useState<PrintSheetResult | null>(null);
  const [faceBox, setFaceBox] = useState<FaceBox | null>(null);
  const [meta, setMeta] = useState<UploadedPhotoMeta | null>(null);

  const [photoSizeId, setPhotoSizeId] = useState(DEFAULT_PHOTO_SIZE_ID);
  const [customWidthMm, setCustomWidthMm] = useState(35);
  const [customHeightMm, setCustomHeightMm] = useState(45);
  const [backgroundId, setBackgroundId] =
    useState<BackgroundOptionId>(DEFAULT_BACKGROUND);
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>(
    DEFAULT_CUSTOM_BACKGROUND,
  );
  const [copies, setCopies] = useState(DEFAULT_COPIES);
  const [paperSizeId, setPaperSizeId] = useState(DEFAULT_PAPER_SIZE_ID);
  const [gapMm, setGapMm] = useState(DEFAULT_GAP_MM);
  const [marginMm, setMarginMm] = useState(DEFAULT_MARGIN_MM);
  const [crop, setCrop] = useState<CropAdjustments>(DEFAULT_CROP);

  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const transparentUrlRef = useRef<string | null>(null);
  const originalPreviewUrlRef = useRef<string | null>(null);
  const processIdRef = useRef(0);

  const photoDimensions = useMemo(
    () => resolvePhotoDimensions(photoSizeId, customWidthMm, customHeightMm),
    [photoSizeId, customWidthMm, customHeightMm],
  );

  const paper = useMemo(() => getPaperSizeById(paperSizeId), [paperSizeId]);

  const backgroundColor = useMemo(
    () => resolveBackgroundColor(backgroundId, customBackgroundColor),
    [backgroundId, customBackgroundColor],
  );

  const revokeUrl = (url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const resetOutputs = () => {
    setPassportPhotoUrl(null);
    setPrintSheets([]);
    setSheetInfo(null);
    setFaceBox(null);
  };

  const handleFileSelected = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setStatus("error");
      setStatusMessage(validationError);
      return;
    }

    const processId = ++processIdRef.current;
    let inputUrl: string | null = null;
    let preparedUrl: string | null = null;

    try {
      setAiBusy(true);
      setStatus("removing-background");
      setStatusMessage("Removing background...");
      resetOutputs();

      revokeUrl(transparentUrlRef.current);
      revokeUrl(originalPreviewUrlRef.current);
      transparentUrlRef.current = null;
      originalPreviewUrlRef.current = null;
      setTransparentUrl(null);

      const sourceImage = await loadImageFromFile(file);
      if (processId !== processIdRef.current) return;

      setMeta({
        name: file.name,
        width: sourceImage.naturalWidth,
        height: sourceImage.naturalHeight,
        sizeBytes: file.size,
        type: file.type || "image",
      });

      const prepared = await maybeDownscaleImage(sourceImage);
      preparedUrl = URL.createObjectURL(prepared.blob);
      originalPreviewUrlRef.current = preparedUrl;
      inputUrl = preparedUrl;
      const result = await removeBackground(inputUrl);
      if (processId !== processIdRef.current) {
        if (result.blobUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(result.blobUrl);
        }
        return;
      }

      const nextTransparentUrl = result.blobUrl;
      transparentUrlRef.current = nextTransparentUrl;
      setTransparentUrl(nextTransparentUrl);
      setCrop(DEFAULT_CROP);

      setStatus("detecting-face");
      setStatusMessage("Detecting face...");

      const processedImage = await loadImageFromUrl(nextTransparentUrl);
      if (processId !== processIdRef.current) return;

      const detector = await getFaceDetector();
      const detection = detector.detect(processedImage);
      const detections = detection.detections ?? [];

      if (detections.length === 0) {
        throw new Error(
          "No face detected. Please upload a clear front-facing photo.",
        );
      }

      if (detections.length > 1) {
        throw new Error(
          "Multiple faces detected. Please upload a photo containing one person.",
        );
      }

      const box = detections[0]?.boundingBox;
      if (!box) {
        throw new Error(
          "No face detected. Please upload a clear front-facing photo.",
        );
      }

      setFaceBox({
        originX: box.originX,
        originY: box.originY,
        width: box.width,
        height: box.height,
      });

      setStatus("creating-passport");
      setStatusMessage("Creating passport photo...");
    } catch (error) {
      if (processId !== processIdRef.current) return;
      console.error(error);
      setStatus("error");
      setStatusMessage(
        toUserFriendlyError(
          error,
          "Failed to process image. Please try another photo.",
        ),
      );
      resetOutputs();
    } finally {
      if (processId === processIdRef.current) {
        setAiBusy(false);
      }
    }
  };

  // Derived: regenerate passport photo when settings / crop change.
  // Does NOT rerun background removal.
  useEffect(() => {
    if (!transparentUrl || !faceBox) return;

    let cancelled = false;

    const regenerate = async () => {
      try {
        const image = await loadImageFromUrl(transparentUrl);
        if (cancelled) return;

        const passport = createPassportPhoto(image, {
          widthPx: photoDimensions.widthPx,
          heightPx: photoDimensions.heightPx,
          backgroundColor,
          faceBox,
          zoom: crop.zoom,
          offsetX: crop.offsetX,
          offsetY: crop.offsetY,
        });

        if (cancelled) return;
        setPassportPhotoUrl(passport);

        if (!aiBusy) {
          setStatus("creating-sheet");
          setStatusMessage("Updating print sheet...");
        }
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setStatus("error");
        setStatusMessage(
          toUserFriendlyError(
            error,
            "Failed to create passport photo. Please try again.",
          ),
        );
      }
    };

    void regenerate();

    return () => {
      cancelled = true;
    };
  }, [
    transparentUrl,
    faceBox,
    photoDimensions.widthPx,
    photoDimensions.heightPx,
    backgroundColor,
    crop.zoom,
    crop.offsetX,
    crop.offsetY,
    aiBusy,
  ]);

  // Derived: regenerate print sheet when passport / paper / copies / spacing change.
  useEffect(() => {
    if (!passportPhotoUrl) return;

    let cancelled = false;

    const regenerate = async () => {
      try {
        const result = await createPrintSheet({
          photoUrl: passportPhotoUrl,
          copies,
          paperWidthPx: paper.widthPx,
          paperHeightPx: paper.heightPx,
          photoWidthPx: photoDimensions.widthPx,
          photoHeightPx: photoDimensions.heightPx,
          gapPx: mmToPx(gapMm),
          marginPx: mmToPx(marginMm),
        });

        if (cancelled) return;
        setPrintSheets(result.sheets);
        setSheetInfo(result);
        setStatus("done");
        setStatusMessage(
          result.sheetsNeeded > 1
            ? `Done · ${result.sheetsNeeded} sheets prepared`
            : "Done",
        );
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setPrintSheets([]);
        setSheetInfo(null);
        setStatus("error");
        setStatusMessage(
          toUserFriendlyError(
            error,
            "Failed to create print sheet. Adjust size or spacing and try again.",
          ),
        );
      }
    };

    void regenerate();

    return () => {
      cancelled = true;
    };
  }, [
    passportPhotoUrl,
    copies,
    paper.widthPx,
    paper.heightPx,
    photoDimensions.widthPx,
    photoDimensions.heightPx,
    gapMm,
    marginMm,
  ]);

  useEffect(() => {
    return () => {
      revokeUrl(transparentUrlRef.current);
      revokeUrl(originalPreviewUrlRef.current);
    };
  }, []);

  const handleDownloadJpg = () => {
    if (printSheets.length === 0) return;
    try {
      printSheets.forEach((sheet, index) => {
        const suffix =
          printSheets.length > 1 ? `-sheet-${index + 1}` : "";
        downloadDataUrl(sheet, `passport-photos${suffix}.jpg`);
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage("Failed to download JPG. Please try again.");
    }
  };

  const handleDownloadPdf = async () => {
    if (printSheets.length === 0) return;
    try {
      const blob = await createPrintPdf(printSheets, paper);
      downloadBlob(blob, "passport-photos.pdf");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage("Failed to create PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    if (printSheets.length === 0) return;
    try {
      openPrintDialog(printSheets, paper);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage(
        toUserFriendlyError(
          error,
          "Unable to open print dialog. Please try again.",
        ),
      );
    }
  };

  const settingsDisabled = aiBusy;
  const hasOutput = printSheets.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <header className="space-y-1">
          <h1 className="text-left lg:text-3xl font-bold tracking-tight">
            Passport Photo Maker
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Upload once · AI removes the background · adjust settings and print
            without reprocessing.
          </p>
        </header>
        <OutputActions
            disabled={!hasOutput || aiBusy}
            onDownloadJpg={handleDownloadJpg}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
          />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4 lg:space-y-6">
          <PhotoUpload
            disabled={aiBusy}
            status={status}
            statusMessage={statusMessage}
            meta={meta}
            previewUrl={transparentUrl}
            onFileSelected={handleFileSelected}
          />
          <PhotoSettings
            disabled={settingsDisabled}
            photoSizeId={photoSizeId}
            customWidthMm={customWidthMm}
            customHeightMm={customHeightMm}
            backgroundId={backgroundId}
            customBackgroundColor={customBackgroundColor}
            copies={copies}
            paperSizeId={paperSizeId}
            gapMm={gapMm}
            marginMm={marginMm}
            onPhotoSizeIdChange={setPhotoSizeId}
            onCustomWidthMmChange={setCustomWidthMm}
            onCustomHeightMmChange={setCustomHeightMm}
            onBackgroundIdChange={setBackgroundId}
            onCustomBackgroundColorChange={setCustomBackgroundColor}
            onCopiesChange={setCopies}
            onPaperSizeIdChange={setPaperSizeId}
            onGapMmChange={setGapMm}
            onMarginMmChange={setMarginMm}
          />
          
        </div>

        <div className="space-y-4 lg:space-y-6">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            <PassportPreview
              passportPhotoUrl={passportPhotoUrl}
              photoLabel={photoDimensions.label}
              backgroundColor={backgroundColor}
              widthPx={photoDimensions.widthPx}
              heightPx={photoDimensions.heightPx}
              disabled={aiBusy || !transparentUrl}
              onEdit={() => setEditorOpen(true)}
            />
            <PrintPreview
              sheets={printSheets}
              sheetInfo={sheetInfo}
              paperLabel={paper.label}
              paperWidthPx={paper.widthPx}
              paperHeightPx={paper.heightPx}
              copies={copies}
              photoLabel={photoDimensions.label}
            />
          </div>
        </div>
      </div>

      <PhotoEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        transparentUrl={transparentUrl}
        backgroundColor={backgroundColor}
        crop={crop}
        aspectRatio={photoDimensions.widthPx / photoDimensions.heightPx}
        onApply={setCrop}
      />
    </div>
  );
}
