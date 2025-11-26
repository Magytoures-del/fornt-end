// Simple DOM-to-PDF export using html2canvas + jsPDF
// Exports a given element to an A4 PDF, scaling content to fit width.

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportElementToPdf({
  element,
  fileName = "ticket.pdf",
  margin = 8,
  scale = 2,
}) {
  if (!element) throw new Error("Missing element for PDF export");

  try {
    // Create a completely clean clone with no CSS classes
    const cleanClone = element.cloneNode(true);

    // Remove all classes and inline styles that might contain oklch
    const removeProblematicStyles = (el) => {
      // Remove all classes
      el.removeAttribute("class");

      // Remove style attribute if it contains problematic values
      const styleAttr = el.getAttribute("style");
      if (
        styleAttr &&
        (styleAttr.includes("oklch") || styleAttr.includes("color-mix"))
      ) {
        el.removeAttribute("style");
      }

      // Hide no-print elements
      if (el.classList && el.classList.contains("no-print")) {
        el.style.display = "none";
      }

      // Recursively process children
      Array.from(el.children).forEach((child) =>
        removeProblematicStyles(child)
      );
    };

    removeProblematicStyles(cleanClone);

    // Temporarily add to DOM for rendering
    cleanClone.style.position = "absolute";
    cleanClone.style.left = "-9999px";
    cleanClone.style.top = "-9999px";
    cleanClone.style.backgroundColor = "#ffffff";
    cleanClone.style.color = "#111827";
    document.body.appendChild(cleanClone);

    // Render to canvas with minimal options
    const canvas = await html2canvas(cleanClone, {
      scale,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: false,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: true,
    });

    // Clean up the temporary element
    document.body.removeChild(cleanClone);

    const imgData = canvas.toDataURL("image/png");

    // A4 portrait dimensions in mm
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Convert px to mm ratio based on 96dpi
    const pxPerMm = 96 / 25.4; // ~3.78
    const contentWidthMm = canvas.width / pxPerMm;
    const contentHeightMm = canvas.height / pxPerMm;

    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;

    // Scale to fit within page bounds
    const scaleFactor = Math.min(maxW / contentWidthMm, maxH / contentHeightMm);
    const renderW = contentWidthMm * scaleFactor;
    const renderH = contentHeightMm * scaleFactor;

    const x = (pageWidth - renderW) / 2;
    const y = margin;

    pdf.addImage(imgData, "PNG", x, y, renderW, renderH, undefined, "FAST");
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF export failed:", error);
    throw error;
  }
}
