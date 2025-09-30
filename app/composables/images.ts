/**
 * reformat-image.ts
 *
 * Purpose
 * -------
 * Single public API: `useformatImage(imageFormatPreset, file)` that reformats an input image
 * into dimensions/format dictated by your Nuxt `app.config.ts` presets.
 *
 * Design
 * ------
 * - The ONLY exported symbol is `useApplyImageFormatPreset(imageFormatPreset, file)`.
 * - Presets are defined in `app.config.ts` under `useApplyImageFormatPresets` (with keys like 'bootyPhoto', 'avatar').
 * - The function:
 *    1) Reads the preset from `useAppConfig()`.
 *    2) Loads pixels (EXIF-aware when possible).
 *    3) Decides final W/H from preset:
 *         - If square (shortSidePx === longSidePx), orientation is ignored.
 *         - Else it uses:
 *             - 'portrait': width=shortSidePx, height=longSidePx
 *             - 'landscape': width=longSidePx, height=shortSidePx
 *             - 'auto':     infer from source orientation (w≥h → landscape else portrait)
 *    4) Center-crops the source to the target aspect, then scales to target size.
 *       If `allowUpscale` is false, scaling is capped at 1× (no enlargement).
 *    5) Encodes to `mimeType` (WebP recommended) with `quality`, optionally reducing
 *       quality to meet `sizeBudgetKB` if provided.
 *    6) Returns a new File with a suffix and correct extension.
 */

import {
    imageFormatPresets
} from '#shared/imageFormatPresets'

import type {
    ImageFormatPreset,
    ImageFormatPresetKey
} from '#shared/imageFormatPresets'


export {
    useApplyImageFormatPreset
}

async function useApplyImageFormatPreset(
  imageFormatPresetKey: ImageFormatPresetKey,
  inputFile: File
): Promise<File> {
    if (!inputFile || !inputFile.type.startsWith('image/')) {
        throw new Error('Provided file is not an image.');
    }

    const preset : ImageFormatPreset = imageFormatPresets[imageFormatPresetKey];
    
    if (!preset) {
        throw new Error(`Unknown imageFormatPreset preset: ${imageFormatPresetKey}`);
    }

    // 1) Load pixels with EXIF-aware path if possible
    const { source, width: srcW, height: srcH, bitmap } = await loadCanvasImageSource(inputFile);

    // 2) Determine target dimensions (respect square & orientation)
    const { targetW, targetH } = resolveTargetSize(preset, srcW, srcH);

    // 3) Compute center crop to match target aspect
    const targetAspect = targetW / targetH;
    const { cropX, cropY, cropW, cropH } = computeCenteredCrop(srcW, srcH, targetAspect, preset);

    // 4) Scale to fill target dimensions completely
    const outW = targetW;
    const outH = targetH;

    // 5) Draw crop → scaled output
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d', { alpha: preset.mimeType !== 'image/jpeg' });
    if (!ctx) {
        if (bitmap) bitmap.close?.();
        throw new Error('Failed to get 2D context.');
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (preset.fit === 'contain') {
        // Calculate dimensions to fit within canvas while maintaining aspect ratio
        const scale = Math.min(outW / cropW, outH / cropH);
        const scaledW = cropW * scale;
        const scaledH = cropH * scale;
        const x = (outW - scaledW) / 2;
        const y = (outH - scaledH) / 2;

        // Clear canvas with white background if needed
        if (preset.mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, outW, outH);
        }

        // Draw image centered
        ctx.drawImage(
            source as CanvasImageSource,
            cropX, cropY, cropW, cropH,
            x, y, scaledW, scaledH
        );
    } else {
        // Cover - fill entire canvas
        ctx.drawImage(
            source as CanvasImageSource,
            cropX, cropY, cropW, cropH,
            0, 0, outW, outH
        );
    }

    // 6) Encode (optionally meet size budget by stepping quality down)
    const blob = await encodeWithBudget(canvas, preset.mimeType, preset.quality, preset.sizeBudgetKB);

    // 7) Build output filename with suffix + correct extension
    const desiredExt = extensionForMime(blob.type || preset.mimeType);
    const outputName = ensureSuffixAndExtension(inputFile.name, preset.filenameSuffix, desiredExt);

    if (bitmap) bitmap.close?.();

    return new File([blob], outputName, {
        type: blob.type,
        lastModified: Date.now(),
    });
}







/* --------------------- Internals --------------------- */

/** Try EXIF-aware decoding first; fall back to <img>. */
async function loadCanvasImageSource(
  file: File
): Promise<{ 
    source: CanvasImageSource; 
    width: number; 
    height: number; bitmap?: 
    ImageBitmap 
}> {
  if ('createImageBitmap' in window) {
    try {
      // @ts-expect-error: older TS DOM libs may not know this option
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, bitmap };
    } catch {
      // fall through
    }
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    return { source: img, width: w, height: h };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

/** Compute centered crop rectangle matching target aspect ratio. */
function computeCenteredCrop(
  srcW: number,
  srcH: number,
  targetAspect: number, // width / height
  preset: ImageFormatPreset
): { cropX: number; cropY: number; cropW: number; cropH: number } {
  const srcAspect = srcW / srcH;

  if (preset.fit === 'contain') {
    // For 'contain', use the entire source image
    return {
      cropX: 0,
      cropY: 0,
      cropW: srcW,
      cropH: srcH
    };
  }

  // For 'cover', crop to fill
  let cropW = srcW;
  let cropH = srcH;
  
  if (srcAspect > targetAspect) {
    // Source is wider than target - match height and crop width
    cropW = Math.round(srcH * targetAspect);
    cropH = srcH;
  } else {
    // Source is taller than target - match width and crop height
    cropW = srcW;
    cropH = Math.round(srcW / targetAspect);
  }

  // Center the crop
  const cropX = Math.round((srcW - cropW) / 2);
  const cropY = Math.round((srcH - cropH) / 2);

  return { cropX, cropY, cropW, cropH };
}

/** Decide final target size using preset and (for 'auto') source orientation. */
function resolveTargetSize(
  preset: ImageFormatPreset,
  srcW: number,
  srcH: number
): { targetW: number; targetH: number } {
  const isSquareTarget = preset.shortSidePx === preset.longSidePx;
  if (isSquareTarget) {
    return { targetW: preset.shortSidePx, targetH: preset.longSidePx }; // same value
  }

  const srcIsLandscape = srcW >= srcH;
  const orientation =
    preset.orientation === 'auto'
      ? (srcIsLandscape ? 'landscape' : 'portrait')
      : preset.orientation;

  if (orientation === 'landscape') {
    return { targetW: preset.longSidePx, targetH: preset.shortSidePx };
  } else {
    // 'portrait'
    return { targetW: preset.shortSidePx, targetH: preset.longSidePx };
  }
}

/** Encode canvas to a Blob, optionally reducing quality to meet a size budget. */
async function encodeWithBudget(
  canvas: HTMLCanvasElement,
  mime: ImageFormatPreset['mimeType'],
  initialQuality: number,
  sizeBudgetKB?: number
): Promise<Blob> {
  // Attempt a few quality steps to fit within budget if provided.
  const qualities = buildQualityLadder(initialQuality);
  for (const q of qualities) {
    const blob = await canvasToBlob(canvas, mime, q);
    if (!sizeBudgetKB) return blob;

    const kb = Math.ceil(blob.size / 1024);
    if (kb <= sizeBudgetKB || q === qualities[qualities.length - 1]) {
      return blob;
    }
    // else continue lowering quality
  }
  // Fallback (shouldn’t reach here)
  return canvasToBlob(canvas, mime, Math.max(0.3, Math.min(initialQuality, 0.92)));
}

function buildQualityLadder(initial: number): number[] {
  const clamp = (v: number) => Math.max(0.3, Math.min(0.98, v));
  const steps = [1.0, 0.92, 0.85, 0.78, 0.7, 0.62, 0.55, 0.48, 0.4, 0.35, 0.3];
  // Start from the closest lower-or-equal step to the initial quality.
  const startIdx =
    steps.findIndex((s) => s <= initial + 1e-6) >= 0
      ? steps.findIndex((s) => s <= initial + 1e-6)
      : 0;
  return steps.slice(startIdx).map(clamp);
}

/** Promisified canvas.toBlob with MIME + quality. */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas conversion failed.'))),
      mimeType,
      quality
    );
  });
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/webp':
      return '.webp';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/avif':
      return '.avif';
    default:
      return '';
  }
}

function ensureSuffixAndExtension(
  filename: string,
  suffix: string,
  desiredExt: string
): string {
  const dot = filename.lastIndexOf('.');
  const base = dot === -1 ? filename : filename.slice(0, dot);
  const newBase = base.endsWith(suffix) ? base : `${base}${suffix}`;
  return `${newBase}${desiredExt || (dot === -1 ? '' : filename.slice(dot))}`;
}