export interface PhotoAdjustments {
  // Light / Tone
  exposure: number;     // -100 to +100 (0 default)
  contrast: number;     // -100 to +100 (0 default)
  highlights: number;   // -100 to +100 (0 default)
  shadows: number;      // -100 to +100 (0 default)
  whites: number;       // -100 to +100 (0 default)
  blacks: number;       // -100 to +100 (0 default)

  // Color & White Balance
  temperature: number;  // -100 (Cool/Blue) to +100 (Warm/Yellow)
  tint: number;         // -100 (Green) to +100 (Magenta)
  vibrance: number;     // -100 to +100 (0 default)
  saturation: number;   // -100 to +100 (0 default)

  // Color Grading & Split Toning (Pro)
  shadowsTint: number;   // -100 (Teal/Cool) to +100 (Warm/Amber)
  highlightsTint: number;// -100 (Cool/Cyan) to +100 (Gold/Warm)

  // Detail & Effects
  clarity: number;      // -100 to +100 (0 default)
  dehaze: number;       // -100 to +100 (0 default)
  sharpness: number;    // 0 to 100 (0 default)
  vignette: number;     // -100 (Black vignette) to +100 (White vignette)
  grain: number;        // 0 to 100 (0 default)
  sepia: number;        // 0 to 100 (0 default)

  // Geometry
  rotation: number;     // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

export const DEFAULT_ADJUSTMENTS: PhotoAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  shadowsTint: 0,
  highlightsTint: 0,
  clarity: 0,
  dehaze: 0,
  sharpness: 0,
  vignette: 0,
  grain: 0,
  sepia: 0,
  rotation: 0,
  flipH: false,
  flipV: false
};

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  luma: number[];
  maxVal: number;
}

export interface Preset {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  settings: Partial<PhotoAdjustments>;
}

export const PRO_PRESETS: Preset[] = [
  {
    id: 'reset',
    name: 'Original (Reset)',
    category: 'Básicos',
    icon: 'lucide:rotate-ccw',
    description: 'Restaura todos los parámetros originales de la fotografía',
    settings: { ...DEFAULT_ADJUSTMENTS }
  },
  {
    id: 'auto_pro',
    name: '✨ Auto Revelado Pro',
    category: 'Inteligente',
    icon: 'lucide:sparkles',
    description: 'Balance dinámico inteligente de luz, contraste y nitidez deportiva',
    settings: {
      exposure: 6,
      contrast: 14,
      highlights: -18,
      shadows: 22,
      whites: 8,
      blacks: -6,
      vibrance: 18,
      clarity: 14,
      sharpness: 20,
      vignette: -10
    }
  },
  {
    id: 'sports_daylight',
    name: '⚽ Deportes Luz Día',
    category: 'Deportes',
    icon: 'lucide:sun',
    description: 'Contraste deportivo nítido, sombras abiertas y colores vivos',
    settings: {
      exposure: 8,
      contrast: 18,
      highlights: -15,
      shadows: 25,
      whites: 10,
      blacks: -5,
      temperature: 4,
      vibrance: 22,
      saturation: 8,
      clarity: 15,
      sharpness: 25,
      vignette: -12
    }
  },
  {
    id: 'stadium_night',
    name: '🏟️ Estadio Nocturno',
    category: 'Deportes',
    icon: 'lucide:zap',
    description: 'Compensación de reflectores artificiales, exposición alta y claridad',
    settings: {
      exposure: 18,
      contrast: 22,
      highlights: -30,
      shadows: 35,
      whites: 15,
      blacks: -12,
      temperature: -8,
      tint: 5,
      vibrance: 18,
      saturation: 10,
      clarity: 22,
      sharpness: 30,
      vignette: -18
    }
  },
  {
    id: 'golden_hour',
    name: '🌅 Golden Hour',
    category: 'Ambiente',
    icon: 'lucide:sunset',
    description: 'Tonos cálidos atardecer con iluminaciones doradas y sombras suaves',
    settings: {
      exposure: 5,
      contrast: 12,
      highlights: -20,
      shadows: 18,
      whites: 8,
      blacks: 4,
      temperature: 32,
      tint: 8,
      highlightsTint: 25,
      shadowsTint: 15,
      vibrance: 25,
      saturation: 12,
      clarity: 8,
      sharpness: 15,
      vignette: -20
    }
  },
  {
    id: 'action_punch',
    name: '⚡ Acción Extrema',
    category: 'Deportes',
    icon: 'lucide:flame',
    description: 'Impacto visual máximo, negros profundos y alta textura',
    settings: {
      exposure: 6,
      contrast: 28,
      highlights: -20,
      shadows: 20,
      whites: 15,
      blacks: -18,
      temperature: 2,
      vibrance: 30,
      saturation: 15,
      clarity: 32,
      sharpness: 35,
      vignette: -25
    }
  },
  {
    id: 'bw_drama',
    name: '🖤 B&W Drama',
    category: 'Monocromo',
    icon: 'lucide:circle',
    description: 'Blanco y negro dramático con contraste tonal profundo y grano sutil',
    settings: {
      exposure: 10,
      contrast: 35,
      highlights: -10,
      shadows: 15,
      whites: 20,
      blacks: -25,
      temperature: 0,
      tint: 0,
      vibrance: -100,
      saturation: -100,
      clarity: 28,
      sharpness: 25,
      vignette: -30,
      grain: 15
    }
  },
  {
    id: 'cine_teal_orange',
    name: '🎬 Cine Teal & Orange',
    category: 'Cinematográfico',
    icon: 'lucide:film',
    description: 'Look moderno de cine con contraste complementario azul y naranja',
    settings: {
      exposure: 4,
      contrast: 20,
      highlights: -25,
      shadows: 15,
      whites: 5,
      blacks: -10,
      temperature: 14,
      tint: -12,
      vibrance: 28,
      saturation: 12,
      clarity: 18,
      sharpness: 20,
      vignette: -22
    }
  },
  {
    id: 'matte_vintage',
    name: '🎞️ Matte Vintage',
    category: 'Retro',
    icon: 'lucide:camera',
    description: 'Negros desvanecidos estilo película analógica con grano fino',
    settings: {
      exposure: 2,
      contrast: -8,
      highlights: -20,
      shadows: 30,
      whites: -10,
      blacks: 22,
      temperature: 10,
      tint: 4,
      vibrance: -10,
      saturation: -15,
      clarity: -5,
      sharpness: 10,
      vignette: -15,
      grain: 28
    }
  }
];

/**
 * Applies adjustments to a 2D canvas context using fast pixel manipulation & mathematical tone curves.
 */
export function applyAdjustmentsToCanvas(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  adj: PhotoAdjustments,
  calcHistogram = false
): HistogramData | null {
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const w = sourceImage.width;
  const h = sourceImage.height;

  // Handle Rotation and Geometry
  const rad = (adj.rotation * Math.PI) / 180;
  const isRotated90 = adj.rotation % 180 !== 0;

  targetCanvas.width = isRotated90 ? h : w;
  targetCanvas.height = isRotated90 ? w : h;

  ctx.save();
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(adj.flipH ? -1 : 1, adj.flipV ? -1 : 1);
  ctx.drawImage(sourceImage, -w / 2, -h / 2, w, h);
  ctx.restore();

  // If no color adjustments, we can skip heavy pixel loop
  const isNeutral =
    adj.exposure === 0 &&
    adj.contrast === 0 &&
    adj.highlights === 0 &&
    adj.shadows === 0 &&
    adj.whites === 0 &&
    adj.blacks === 0 &&
    adj.temperature === 0 &&
    adj.tint === 0 &&
    adj.vibrance === 0 &&
    adj.saturation === 0 &&
    adj.shadowsTint === 0 &&
    adj.highlightsTint === 0 &&
    adj.clarity === 0 &&
    adj.dehaze === 0 &&
    adj.sharpness === 0 &&
    adj.vignette === 0 &&
    adj.grain === 0 &&
    adj.sepia === 0;

  if (isNeutral && !calcHistogram) {
    return null;
  }

  const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const data = imageData.data;
  const len = data.length;

  // Precompute Adjustment Coefficients
  const exposureMult = Math.pow(2, adj.exposure / 50); // EV curve
  const contrastFactor = (259 * (adj.contrast * 1.5 + 255)) / (255 * (259 - adj.contrast * 1.5));
  
  // White Balance shift
  const tempR = adj.temperature > 0 ? 1 + (adj.temperature / 100) * 0.3 : 1;
  const tempB = adj.temperature < 0 ? 1 + (-adj.temperature / 100) * 0.35 : 1 - (adj.temperature / 100) * 0.15;
  const tintG = adj.tint < 0 ? 1 + (-adj.tint / 100) * 0.25 : 1;
  const tintM = adj.tint > 0 ? 1 + (adj.tint / 100) * 0.25 : 1;

  const satMult = 1 + adj.saturation / 100;
  const vibMult = 1 + adj.vibrance / 100;
  const sepiaFactor = adj.sepia / 100;

  const highlightsShift = adj.highlights / 100;
  const shadowsShift = adj.shadows / 100;
  const whitesShift = (adj.whites / 100) * 35;
  const blacksShift = (adj.blacks / 100) * 35;
  const clarityShift = (adj.clarity / 100) * 40;
  const dehazeShift = (adj.dehaze / 100) * 30;

  // Color Grading / Split Toning
  const sTint = adj.shadowsTint / 100;       // -1 = Teal/Blue, +1 = Warm/Amber
  const hTint = adj.highlightsTint / 100;    // -1 = Cyan/Cool, +1 = Gold/Warm

  // Vignette pre-calculations
  const cw = targetCanvas.width;
  const ch = targetCanvas.height;
  const maxDist = Math.sqrt((cw / 2) ** 2 + (ch / 2) ** 2);
  const applyVignette = adj.vignette !== 0;
  const vignetteAmt = adj.vignette / 100;

  // Grain pre-calculations
  const applyGrain = adj.grain > 0;
  const grainAmount = (adj.grain / 100) * 28;

  // Histogram bins (256 values)
  const rHist = new Array(256).fill(0);
  const gHist = new Array(256).fill(0);
  const bHist = new Array(256).fill(0);
  const lHist = new Array(256).fill(0);
  let maxHist = 0;

  // Main Pixel Loop
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Exposure
    r *= exposureMult;
    g *= exposureMult;
    b *= exposureMult;

    // 2. White Balance / Tint
    r *= tempR * tintM;
    g *= tintG;
    b *= tempB;

    // 3. Dehaze (Contrast in haze regions)
    if (dehazeShift !== 0) {
      const minChan = Math.min(r, g, b);
      const hazeFactor = (minChan / 255) * dehazeShift;
      r = r * (1 + dehazeShift * 0.2) - hazeFactor * 40;
      g = g * (1 + dehazeShift * 0.2) - hazeFactor * 40;
      b = b * (1 + dehazeShift * 0.2) - hazeFactor * 40;
    }

    // 4. Highlights & Shadows curve
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const lumaNorm = luma / 255;

    // Highlights affect bright zones (luma > 0.4)
    if (highlightsShift !== 0 && lumaNorm > 0.4) {
      const hWeight = (lumaNorm - 0.4) / 0.6;
      const hDelta = highlightsShift * hWeight * 40;
      r += hDelta;
      g += hDelta;
      b += hDelta;
    }

    // Shadows affect dark zones (luma < 0.6)
    if (shadowsShift !== 0 && lumaNorm < 0.6) {
      const sWeight = (0.6 - lumaNorm) / 0.6;
      const sDelta = shadowsShift * sWeight * 50;
      r += sDelta;
      g += sDelta;
      b += sDelta;
    }

    // Whites & Blacks
    if (whitesShift !== 0 && lumaNorm > 0.7) {
      const wWeight = (lumaNorm - 0.7) / 0.3;
      r += whitesShift * wWeight;
      g += whitesShift * wWeight;
      b += whitesShift * wWeight;
    }
    if (blacksShift !== 0 && lumaNorm < 0.3) {
      const bWeight = (0.3 - lumaNorm) / 0.3;
      r += blacksShift * bWeight;
      g += blacksShift * bWeight;
      b += blacksShift * bWeight;
    }

    // 5. Split Toning / Color Grading (Shadows & Highlights Tint)
    if (sTint !== 0 && lumaNorm < 0.5) {
      const sWeight = (0.5 - lumaNorm) / 0.5;
      if (sTint > 0) {
        // Warm/Amber shadows
        r += sTint * sWeight * 30;
        g += sTint * sWeight * 15;
        b -= sTint * sWeight * 20;
      } else {
        // Teal/Blue shadows
        r -= (-sTint) * sWeight * 25;
        g += (-sTint) * sWeight * 10;
        b += (-sTint) * sWeight * 30;
      }
    }

    if (hTint !== 0 && lumaNorm > 0.5) {
      const hWeight = (lumaNorm - 0.5) / 0.5;
      if (hTint > 0) {
        // Gold/Warm highlights
        r += hTint * hWeight * 30;
        g += hTint * hWeight * 18;
        b -= hTint * hWeight * 15;
      } else {
        // Cyan/Cool highlights
        r -= (-hTint) * hWeight * 20;
        g += (-hTint) * hWeight * 15;
        b += (-hTint) * hWeight * 28;
      }
    }

    // 6. Clarity (Midtone contrast boost)
    if (clarityShift !== 0) {
      const midWeight = 1 - 2 * Math.abs(lumaNorm - 0.5);
      if (midWeight > 0) {
        const cDelta = (lumaNorm > 0.5 ? 1 : -1) * clarityShift * midWeight;
        r += cDelta;
        g += cDelta;
        b += cDelta;
      }
    }

    // 7. Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // 8. Vibrance & Saturation
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const currentSat = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;
    
    // Vibrance boosts unsaturated colors more
    const vibWeight = 1 - currentSat;
    const totalSatFactor = satMult * (1 + (vibMult - 1) * vibWeight);

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * totalSatFactor;
    g = gray + (g - gray) * totalSatFactor;
    b = gray + (b - gray) * totalSatFactor;

    // 9. Sepia / Tonal Warmth
    if (sepiaFactor > 0) {
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - sepiaFactor) + sr * sepiaFactor;
      g = g * (1 - sepiaFactor) + sg * sepiaFactor;
      b = b * (1 - sepiaFactor) + sb * sepiaFactor;
    }

    // 10. Vignette
    if (applyVignette) {
      const px = (i / 4) % cw;
      const py = Math.floor(i / 4 / cw);
      const distFromCenter = Math.sqrt((px - cw / 2) ** 2 + (py - ch / 2) ** 2);
      const vRatio = Math.min(1, distFromCenter / maxDist);
      const vFactor = Math.pow(vRatio, 1.8);

      if (vignetteAmt < 0) {
        // Dark vignette
        const darkMult = 1 + vignetteAmt * vFactor;
        r *= darkMult;
        g *= darkMult;
        b *= darkMult;
      } else {
        // White vignette
        const whiteAdd = vignetteAmt * vFactor * 120;
        r += whiteAdd;
        g += whiteAdd;
        b += whiteAdd;
      }
    }

    // 11. Film Grain
    if (applyGrain) {
      const noise = (Math.random() - 0.5) * grainAmount;
      r += noise;
      g += noise;
      b += noise;
    }

    // Clamp values 0 - 255
    const finalR = Math.max(0, Math.min(255, Math.round(r)));
    const finalG = Math.max(0, Math.min(255, Math.round(g)));
    const finalB = Math.max(0, Math.min(255, Math.round(b)));

    data[i] = finalR;
    data[i + 1] = finalG;
    data[i + 2] = finalB;

    // Calculate histogram data
    if (calcHistogram && i % 8 === 0) {
      rHist[finalR]++;
      gHist[finalG]++;
      bHist[finalB]++;
      const finalLuma = Math.round(0.299 * finalR + 0.587 * finalG + 0.114 * finalB);
      lHist[finalLuma]++;
      if (lHist[finalLuma] > maxHist) maxHist = lHist[finalLuma];
    }
  }

  // 12. Optional Sharpening (Convolution Kernel 3x3)
  if (adj.sharpness > 0) {
    applySharpenFilter(data, cw, ch, adj.sharpness / 100);
  }

  ctx.putImageData(imageData, 0, 0);

  if (calcHistogram) {
    return {
      r: rHist,
      g: gHist,
      b: bHist,
      luma: lHist,
      maxVal: maxHist || 1
    };
  }

  return null;
}

/**
 * Intelligent Auto-Enhance Analyzer
 * Samples the image to compute optimal exposure, highlights recovery, shadows lift, vibrance, and sharpness.
 */
export function analyzeAndAutoEnhance(sourceImage: HTMLImageElement | HTMLCanvasElement): Partial<PhotoAdjustments> {
  const offscreen = document.createElement('canvas');
  const sampleW = 200;
  const sampleH = Math.round((sampleW * sourceImage.height) / sourceImage.width) || 150;
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      exposure: 8,
      contrast: 15,
      highlights: -18,
      shadows: 22,
      vibrance: 18,
      clarity: 12,
      sharpness: 20
    };
  }

  ctx.drawImage(sourceImage, 0, 0, sampleW, sampleH);
  const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;
  let totalLuma = 0;
  let totalSat = 0;
  let darkPixels = 0;
  let brightPixels = 0;
  const count = imgData.length / 4;

  for (let i = 0; i < imgData.length; i += 4) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuma += luma;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    totalSat += sat;

    if (luma < 50) darkPixels++;
    if (luma > 205) brightPixels++;
  }

  const avgLuma = totalLuma / count; // 0 to 255 (ideal ~ 120-130)
  const avgSat = totalSat / count;   // 0 to 1
  const darkRatio = darkPixels / count;
  const brightRatio = brightPixels / count;

  // Compute calculated adjustments
  let exposure = 0;
  if (avgLuma < 110) {
    exposure = Math.min(25, Math.round((120 - avgLuma) * 0.4));
  } else if (avgLuma > 160) {
    exposure = Math.max(-20, Math.round((140 - avgLuma) * 0.3));
  }

  let shadows = 15;
  if (darkRatio > 0.2) shadows = Math.min(45, Math.round(darkRatio * 100));

  let highlights = -15;
  if (brightRatio > 0.15) highlights = Math.max(-45, Math.round(-brightRatio * 100));

  let vibrance = 15;
  if (avgSat < 0.25) vibrance = 28;
  else if (avgSat > 0.6) vibrance = 5;

  return {
    exposure,
    contrast: 14,
    highlights,
    shadows,
    whites: 8,
    blacks: -6,
    vibrance,
    clarity: 12,
    sharpness: 20
  };
}

/**
 * 3x3 Sharpen Kernel pass
 */
function applySharpenFilter(data: Uint8ClampedArray, width: number, height: number, strength: number) {
  const copy = new Uint8ClampedArray(data);
  const factor = strength * 0.8;
  const center = 1 + 4 * factor;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const top = copy[((y - 1) * width + x) * 4 + c];
        const bottom = copy[((y + 1) * width + x) * 4 + c];
        const left = copy[(y * width + (x - 1)) * 4 + c];
        const right = copy[(y * width + (x + 1)) * 4 + c];
        const curr = copy[idx + c];

        const val = curr * center - (top + bottom + left + right) * factor;
        data[idx + c] = Math.max(0, Math.min(255, Math.round(val)));
      }
    }
  }
}

/**
 * Generates an export data URL / Blob for a full-resolution processed photo
 */
export async function exportProcessedImageBlob(
  imgSrc: string,
  adjustments: PhotoAdjustments,
  quality = 0.95,
  watermarkText = ''
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      applyAdjustmentsToCanvas(img, canvas, adjustments, false);

      // Apply watermark if requested
      if (watermarkText) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const fontSize = Math.max(16, Math.round(canvas.width * 0.025));
          ctx.save();
          ctx.font = `600 ${fontSize}px sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 4;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText(watermarkText, canvas.width - fontSize, canvas.height - fontSize);
          ctx.restore();
        }
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to render canvas to blob'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = (e) => reject(e);
    img.src = imgSrc;
  });
}
