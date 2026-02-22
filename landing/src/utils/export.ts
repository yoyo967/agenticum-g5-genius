import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

/**
 * Universal Export Utilities for AGENTICUM G5 OS
 * Used by all modules to provide multi-format download capabilities.
 */

// ──────── JSON ────────
export function downloadJSON(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `${filename}.json`);
}

// ──────── CSV ────────
export function downloadCSV(rows: Record<string, unknown>[], filename: string): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const val = String(row[h] ?? '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    )
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}.csv`);
}

// ──────── Text / Markdown ────────
export function downloadTextFile(text: string, filename: string, ext = 'txt'): void {
  const mimeTypes: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    html: 'text/html',
  };
  const blob = new Blob([text], { type: mimeTypes[ext] || 'text/plain' });
  triggerDownload(blob, `${filename}.${ext}`);
}

// ──────── PNG (Screenshot) ────────
export async function downloadPNG(elementId: string, filename: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, {
    backgroundColor: '#0a0118',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  canvas.toBlob(blob => {
    if (blob) triggerDownload(blob, `${filename}.png`);
  }, 'image/png');
}

// ──────── PDF (from DOM element) ────────
export async function downloadPDF(elementId: string, filename: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, {
    backgroundColor: '#0a0118',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

// ──────── SVG Export ────────
export function downloadSVG(svgElement: SVGSVGElement | null, filename: string): void {
  if (!svgElement) return;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  triggerDownload(blob, `${filename}.svg`);
}

// ──────── ZIP (Batch Download) ────────
export async function downloadZIP(
  files: { name: string; content: Blob | string }[],
  zipName: string
): Promise<void> {
  const zip = new JSZip();
  for (const file of files) {
    if (typeof file.content === 'string') {
      zip.file(file.name, file.content);
    } else {
      zip.file(file.name, file.content);
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, `${zipName}.zip`);
}

// ──────── Image Format Conversion ────────
export async function convertImageFormat(
  imageUrl: string,
  format: 'image/png' | 'image/jpeg' | 'image/webp',
  filename: string
): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
      ctx.drawImage(img, 0, 0);
      const ext = format.split('/')[1];
      canvas.toBlob(blob => {
        if (blob) {
          triggerDownload(blob, `${filename}.${ext}`);
          resolve();
        } else {
          reject(new Error('Blob conversion failed'));
        }
      }, format, 0.95);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ──────── Helper ────────
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
