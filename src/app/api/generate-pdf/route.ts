import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

class NeatPdfDoc {
  private pages: string[] = [];
  private currentPageStream: string[] = [];

  constructor() {}

  addPage() {
    if (this.currentPageStream.length > 0 || this.pages.length > 0) {
      this.pages.push(this.currentPageStream.join('\n'));
      this.currentPageStream = [];
    }
  }

  // Pure ASCII sanitizer: completely eliminates all broken symbols, Greek letters, and non-ASCII chars
  private cleanText(text: string): string {
    return text
      .replace(/[•●▪]/g, '-')
      .replace(/[°]/g, ' deg')
      .replace(/[×]/g, ' x ')
      .replace(/[Σ]/g, 'Sum')
      .replace(/[πΠ]/g, 'pi')
      .replace(/[≤]/g, '<=')
      .replace(/[≥]/g, '>=')
      .replace(/[θ]/g, 'angle')
      .replace(/[±]/g, '+/-')
      .replace(/[–—]/g, '-')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/[^\x20-\x7E]/g, ' ') // Only standard printable ASCII characters
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  // Draw rectangle
  rect(x: number, y: number, w: number, h: number, fillColor?: [number, number, number], strokeColor?: [number, number, number], lineWidth: number = 1) {
    let s = 'q\n';
    if (fillColor) {
      s += `${fillColor[0].toFixed(3)} ${fillColor[1].toFixed(3)} ${fillColor[2].toFixed(3)} rg\n`;
    }
    if (strokeColor) {
      s += `${strokeColor[0].toFixed(3)} ${strokeColor[1].toFixed(3)} ${strokeColor[2].toFixed(3)} RG\n`;
      s += `${lineWidth.toFixed(2)} w\n`;
    }
    s += `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re\n`;
    if (fillColor && strokeColor) {
      s += 'B\n';
    } else if (fillColor) {
      s += 'f\n';
    } else if (strokeColor) {
      s += 'S\n';
    }
    s += 'Q';
    this.currentPageStream.push(s);
  }

  // Draw line
  line(x1: number, y1: number, x2: number, y2: number, strokeColor: [number, number, number] = [0.5, 0.5, 0.5], lineWidth: number = 1) {
    const s = `q\n${strokeColor[0].toFixed(3)} ${strokeColor[1].toFixed(3)} ${strokeColor[2].toFixed(3)} RG\n${lineWidth.toFixed(2)} w\n${x1.toFixed(2)} ${y1.toFixed(2)} m\n${x2.toFixed(2)} ${y2.toFixed(2)} l\nS\nQ`;
    this.currentPageStream.push(s);
  }

  // Draw single line text with exact coordinate placement
  text(str: string, x: number, y: number, font: 'F1' | 'F2' | 'F3' | 'F4' = 'F2', size: number = 9, color: [number, number, number] = [0, 0, 0]) {
    const safeStr = this.cleanText(str);
    const s = `BT\n/${font} ${size.toFixed(1)} Tf\n${color[0].toFixed(3)} ${color[1].toFixed(3)} ${color[2].toFixed(3)} rg\n1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm\n(${safeStr}) Tj\nET`;
    this.currentPageStream.push(s);
  }

  // Draw top header banner
  drawHeader(sheetTitle: string, pageNum: number, totalPages: number) {
    // Top banner background
    this.rect(36, 792, 523, 26, [0.08, 0.18, 0.36], undefined);
    this.text('A V M BRICKS | BUILDING ESTIMATOR FORMULA MANUAL', 46, 802, 'F1', 9, [1, 1, 1]);
    this.text(`SHEET ${pageNum} OF ${totalPages}`, 485, 802, 'F1', 8.5, [0.85, 0.92, 1]);

    // Page title
    this.text(sheetTitle, 36, 768, 'F1', 13.5, [0.08, 0.18, 0.36]);
    this.line(36, 760, 559, 760, [0.80, 0.85, 0.90], 1.2);
  }

  // Draw bottom footer
  drawFooter(pageNum: number, totalPages: number) {
    this.line(36, 48, 559, 48, [0.85, 0.88, 0.92], 0.8);
    this.text('Civil Standards: IS 1077 (Bricks) | IS 1200 (Measurements) | IS 456:2000 (Concrete) | SP 34 (Detailing)', 36, 36, 'F2', 7.5, [0.45, 0.50, 0.55]);
    this.text(`Page ${pageNum} of ${totalPages}`, 505, 36, 'F1', 8, [0.20, 0.30, 0.40]);
  }

  // Draw Section Header box
  drawSectionHeader(title: string, y: number): number {
    this.rect(36, y - 4, 523, 18, [0.92, 0.95, 0.98], [0.75, 0.83, 0.92], 0.8);
    this.rect(36, y - 4, 4, 18, [0.08, 0.35, 0.65], undefined);
    this.text(title.toUpperCase(), 46, y + 1, 'F1', 8.5, [0.08, 0.25, 0.50]);
    return y - 18;
  }

  // Perfectly aligned two-column tabular list
  drawAlignedList(
    items: Array<{ label: string; value: string; note?: string }>,
    startY: number,
    labelWidth: number = 220,
    lineSpacing: number = 13
  ): number {
    let cy = startY;
    const valueX = 46 + labelWidth;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      // Subtle alternate zebra row background
      if (i % 2 === 1) {
        this.rect(40, cy - 3, 515, lineSpacing, [0.97, 0.98, 0.99], undefined);
      }

      // Column 1: Label
      this.text(it.label, 46, cy, 'F1', 8, [0.15, 0.20, 0.30]);
      this.text(':', valueX - 8, cy, 'F1', 8, [0.4, 0.4, 0.5]);

      // Column 2: Value
      this.text(it.value, valueX, cy, 'F3', 8, [0.05, 0.15, 0.45]);

      // Column 3: Optional Note
      if (it.note) {
        this.text(`(${it.note})`, valueX + 160, cy, 'F2', 7.5, [0.45, 0.50, 0.55]);
      }

      cy -= lineSpacing;
    }
    return cy;
  }

  // Draw clean aligned formula block with title bar and neat equations
  drawFormulaCard(
    title: string,
    equations: Array<{ left: string; right: string; unit?: string } | string>,
    notes: string[],
    y: number,
    cardHeight: number
  ): number {
    const cardTop = y + 8;
    const cardBottom = cardTop - cardHeight;

    // Card background & border
    this.rect(36, cardBottom, 523, cardHeight, [0.98, 0.99, 1.00], [0.75, 0.82, 0.92], 0.8);

    // Title bar
    this.rect(36, cardTop - 16, 523, 16, [0.88, 0.92, 0.98], undefined);
    this.text(`FORMULA: ${title.toUpperCase()}`, 44, cardTop - 12, 'F1', 8.5, [0.06, 0.20, 0.45]);

    // Equations
    let cy = cardTop - 28;
    for (const eq of equations) {
      if (typeof eq === 'string') {
        this.text(eq, 46, cy, 'F3', 8, [0.05, 0.15, 0.45]);
      } else {
        // Aligned Left Variable
        this.text(eq.left, 46, cy, 'F4', 8, [0.10, 0.20, 0.40]);
        // Aligned Equals sign
        this.text('=', 180, cy, 'F1', 8.5, [0.08, 0.35, 0.65]);
        // Aligned Right Expression
        this.text(eq.right, 192, cy, 'F3', 8, [0.05, 0.15, 0.45]);
        // Aligned Unit/Remarks
        if (eq.unit) {
          this.text(eq.unit, 460, cy, 'F2', 7.5, [0.40, 0.45, 0.50]);
        }
      }
      cy -= 12;
    }

    // Notes divider
    if (notes.length > 0) {
      this.line(44, cy + 4, 550, cy + 4, [0.85, 0.88, 0.93], 0.5);
      cy -= 6;
      for (const n of notes) {
        this.text(`-  ${n}`, 46, cy, 'F2', 7.5, [0.30, 0.35, 0.42]);
        cy -= 10;
      }
    }

    return cardBottom - 8;
  }

  // Draw clean aligned tabular grid
  drawTable(
    headers: string[],
    rows: string[][],
    colX: number[],
    startY: number,
    rowHeight: number = 14
  ): number {
    let cy = startY;

    // Header background
    this.rect(36, cy - 3, 523, rowHeight + 2, [0.88, 0.92, 0.98], [0.75, 0.82, 0.92], 0.8);
    for (let c = 0; c < headers.length; c++) {
      this.text(headers[c], colX[c], cy + 2, 'F1', 8, [0.08, 0.20, 0.40]);
    }
    cy -= rowHeight + 2;

    // Table rows
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (r % 2 === 1) {
        this.rect(36, cy - 3, 523, rowHeight, [0.97, 0.98, 0.99], undefined);
      }
      this.line(36, cy - 3, 559, cy - 3, [0.90, 0.92, 0.95], 0.5);

      for (let c = 0; c < row.length; c++) {
        const font = c === 0 ? 'F1' : (c === 1 ? 'F4' : 'F2');
        this.text(row[c], colX[c], cy, font, 7.5, [0.15, 0.20, 0.30]);
      }
      cy -= rowHeight;
    }

    return cy - 6;
  }

  compilePdf(): Buffer {
    if (this.currentPageStream.length > 0) {
      this.pages.push(this.currentPageStream.join('\n'));
      this.currentPageStream = [];
    }

    const totalPages = this.pages.length;
    const bodyObjects: string[] = [];
    let objCount = 0;

    const addObject = (content: string): number => {
      objCount++;
      bodyObjects.push(`${objCount} 0 obj\n${content}\nendobj\n`);
      return objCount;
    };

    const catalogObjId = addObject('<< /Type /Catalog /Pages 2 0 R >>');
    objCount++;
    const pagesObjId = objCount;
    bodyObjects.push(''); // placeholder at index 1

    const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const fontCourierId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');
    const fontCourierBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>');

    const pageObjIds: number[] = [];

    for (let i = 0; i < totalPages; i++) {
      const streamContent = this.pages[i];
      const streamLen = Buffer.byteLength(streamContent, 'utf8');

      const contentObjId = addObject(`<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`);

      const pageObjId = addObject(`<<\n  /Type /Page\n  /Parent ${pagesObjId} 0 R\n  /MediaBox [0 0 595.28 841.89]\n  /Resources <<\n    /Font <<\n      /F1 ${fontBoldId} 0 R\n      /F2 ${fontRegularId} 0 R\n      /F3 ${fontCourierId} 0 R\n      /F4 ${fontCourierBoldId} 0 R\n    >>\n  >>\n  /Contents ${contentObjId} 0 R\n>>`);
      pageObjIds.push(pageObjId);
    }

    const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(' ');
    bodyObjects[pagesObjId - 1] = `${pagesObjId} 0 obj\n<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${totalPages} >>\nendobj\n`;

    const header = '%PDF-1.4\n';
    let currentOffset = Buffer.byteLength(header, 'utf8');
    const xrefEntries: string[] = ['0000000000 65535 f \r\n'];

    for (let i = 0; i < bodyObjects.length; i++) {
      const offsetStr = String(currentOffset).padStart(10, '0') + ' 00000 n \r\n';
      xrefEntries.push(offsetStr);
      currentOffset += Buffer.byteLength(bodyObjects[i], 'utf8');
    }

    const startXrefOffset = currentOffset;
    const xrefTable = `xref\n0 ${objCount + 1}\n` + xrefEntries.join('') +
      `trailer\n<<\n  /Size ${objCount + 1}\n  /Root ${catalogObjId} 0 R\n>>\nstartxref\n${startXrefOffset}\n%%EOF\n`;

    const fullPdf = header + bodyObjects.join('') + xrefTable;
    return Buffer.from(fullPdf, 'utf8');
  }
}

export async function GET() {
  const pdf = new NeatPdfDoc();
  const TOTAL_PAGES = 12;

  // ==========================================
  // PAGE 1: PHYSICAL CONSTANTS & BRICK SIZING
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('1. PHYSICAL CONSTANTS & BRICK SPECIFICATIONS', 1, TOTAL_PAGES);

  let y = 735;
  y = pdf.drawSectionHeader('1.1 Standard Modular Red Clay Brick (IS 1077)', y);
  y = pdf.drawAlignedList([
    { label: 'Standard Actual Brick Dimensions (L x W x H)', value: '230 x 115 x 75 mm', note: '0.230 x 0.115 x 0.075 m' },
    { label: 'Actual Solid Brick Volume (V_actual)', value: '0.00198375 cu.m', note: 'Pure solid clay volume' },
    { label: 'Mortar Horizontal Bed Joint (m_H)', value: '10 mm (0.010 m)', note: 'Bed joint under brick' },
    { label: 'Mortar Vertical Cross Joint (m_V)', value: '10 mm (0.010 m)', note: 'Head joint between bricks' },
    { label: 'Nominal Length with Mortar (L_nom)', value: '240 mm (0.240 m)', note: '230 mm + 10 mm' },
    { label: 'Nominal Width with Mortar (W_nom)', value: '125 mm (0.125 m)', note: '115 mm + 10 mm' },
    { label: 'Nominal Height with Mortar (H_nom)', value: '85 mm (0.085 m)', note: '75 mm + 10 mm' },
    { label: 'Nominal Modular Volume (V_nominal)', value: '0.00255000 cu.m', note: '0.240 x 0.125 x 0.085 m' }
  ], y, 220, 13);

  y -= 8;
  y = pdf.drawSectionHeader('1.2 Civil Engineering Conversion Factors', y);
  y = pdf.drawAlignedList([
    { label: 'Length Conversion', value: '1 meter = 1000 mm = 3.28084 feet = 39.3701 inches' },
    { label: 'Area Conversion', value: '1 sq.meter = 10.7639 sq.feet (1 sq.ft = 0.0929 sq.m)' },
    { label: 'Volume Conversion', value: '1 cu.meter = 35.3147 CFT (1 CFT = 0.02832 cu.m)' },
    { label: 'Standard Cement Bag Mass', value: '50 kg per bag (Density = 1440 kg/cu.m)' },
    { label: 'Standard Cement Bag Volume', value: '0.03472 cu.meter (1.226 CFT per bag)' },
    { label: 'Dry Bulking Factor for Mortar', value: '1.33 (+33 percent dry volume for shrinkage and voids)' },
    { label: 'Dry Conversion Factor for Concrete', value: '1.54 (+54 percent dry volume for shrinkage and voids)' }
  ], y, 220, 13);

  y -= 8;
  y = pdf.drawSectionHeader('1.3 Nominal vs Actual Brick Volumetric Equations', y);
  y = pdf.drawFormulaCard(
    'Brick Volume and Modular Unit Density',
    [
      { left: 'V_actual', right: '0.230 x 0.115 x 0.075', unit: '= 0.00198375 cu.m' },
      { left: 'V_nominal', right: '0.240 x 0.125 x 0.085', unit: '= 0.00255000 cu.m' },
      { left: 'Bricks per cu.m', right: '1.0 / V_nominal = 1.0 / 0.00255', unit: '= 392.15 bricks/cu.m' }
    ],
    [
      'Pure brick density without mortar displacement is 1 / 0.001984 = 504 bricks per cu.m.',
      'Nominal volume correctly accounts for 10 mm mortar joints surrounding each brick unit.'
    ],
    y, 82
  );

  pdf.drawFooter(1, TOTAL_PAGES);

  // ==========================================
  // PAGE 2: BRICK MASONRY & OPENINGS
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('2. BRICK MASONRY & OPENING DEDUCTIONS', 2, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('2.1 Gross Wall Geometry and Volume', y);
  y = pdf.drawFormulaCard(
    'Wall Gross Area and Volume',
    [
      { left: 'A_gross', right: 'Length_wall x Height_wall', unit: 'sq.meters' },
      { left: 'V_gross', right: 'A_gross x Thickness_wall', unit: 'cu.meters' }
    ],
    [
      'Standard Wall Thickness: 4.5 inch (0.1143 m) partition wall | 9.0 inch (0.2286 m) load wall.',
      'Wall height represents clear floor-to-beam height.'
    ],
    y, 65
  );

  y = pdf.drawSectionHeader('2.2 Door, Window and Ventilator Opening Deductions', y);
  y = pdf.drawFormulaCard(
    'Opening Area Deduction and Net Wall Area',
    [
      { left: 'A_openings', right: 'Sum of ( Width x Height x Count ) for all openings', unit: 'sq.meters' },
      { left: 'A_net', right: 'Max( 0, A_gross - A_openings )', unit: 'sq.meters' },
      { left: 'V_net', right: 'A_net x Thickness_wall', unit: 'cu.meters' }
    ],
    [
      'Standard Main Door: 3.5 ft x 7.0 ft = 2.277 sq.m | Room Door: 3.0 ft x 7.0 ft = 1.951 sq.m',
      'Standard Window: 4.0 ft x 4.0 ft = 1.486 sq.m | Large Window: 5.0 ft x 4.0 ft = 1.858 sq.m',
      'Standard Ventilator: 2.0 ft x 1.5 ft = 0.279 sq.m'
    ],
    y, 85
  );

  y = pdf.drawSectionHeader('2.3 Exact Brick Count and Purchase Order', y);
  y = pdf.drawFormulaCard(
    'Exact Brick Quantity with Site Wastage Allowance',
    [
      { left: 'Q_exact', right: 'V_net / V_nominal = V_net / 0.00255', unit: 'exact bricks' },
      { left: 'Q_base', right: 'RoundUp( Q_exact )', unit: 'base brick units' },
      { left: 'Q_purchase', right: 'RoundUp( Q_base x ( 1 + WastagePercent / 100 ) )', unit: 'recommended order' },
      { left: 'Q_wastage', right: 'Q_purchase - Q_base', unit: 'site buffer units' }
    ],
    [
      'Recommended Wastage Allowance: 5 percent for regular walls, 8 to 10 percent for complex walls.',
      'Site buffer covers transit breakages, corner cutting, and header-stretcher bond adjustments.'
    ],
    y, 90
  );

  y = pdf.drawAlignedList([
    { label: 'Tamil Nadu Field Rule of Thumb (sq.ft)', value: '4.5 inch wall: 4.5 bricks/sq.ft | 9.0 inch wall: 9.0 bricks/sq.ft' },
    { label: 'Metric Field Rule of Thumb (sq.m)', value: '4.5 inch wall: 48 bricks/sq.m | 9.0 inch wall: 96 bricks/sq.m' }
  ], y, 220, 13);

  pdf.drawFooter(2, TOTAL_PAGES);

  // ==========================================
  // PAGE 3: PILLAR COLLISION & RECALCULATION
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('3. PILLAR COLLISION & MASONRY RECALCULATION', 3, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('3.1 The Physical Problem: Column Footprint Intersection', y);
  y = pdf.drawAlignedList([
    { label: 'Physical Principle', value: 'Brick infill walls stop flush at concrete column faces' },
    { label: 'Error Without Deduction', value: '8 to 15 percent excess bricks ordered if columns are ignored' },
    { label: '3D Visual Splitting', value: 'Bricks must terminate at column faces with 0.00 percent overlap' }
  ], y, 180, 13);

  y -= 8;
  y = pdf.drawSectionHeader('3.2 Linear Span Column Width Deduction Method', y);
  y = pdf.drawFormulaCard(
    'Clear Wall Span and Recalculated Net Volume',
    [
      { left: 'L_col_overlap', right: 'Sum of ( Pillar_Width_in_wall_line ) for all pillars', unit: 'meters' },
      { left: 'L_clear_wall', right: 'L_gross_wall - L_col_overlap', unit: 'meters' },
      { left: 'A_clear_wall', right: 'L_clear_wall x Height_wall', unit: 'sq.meters' },
      { left: 'V_net_recalc', right: 'Max( 0, ( A_clear_wall - A_openings ) x Thickness_wall )', unit: 'cu.meters' },
      { left: 'Q_recalculated', right: 'RoundUp( V_net_recalc / 0.00255 )', unit: 'exact bricks' }
    ],
    [
      'Deducts full pillar footprint for interior columns and half-width for corner junctions.',
      'Prevents double-counting between masonry estimator and concrete frame estimator.'
    ],
    y, 98
  );

  y = pdf.drawSectionHeader('3.3 3D Geometric Wall Splitting (splitWallByPillars)', y);
  y = pdf.drawFormulaCard(
    'Wall Partitioning at Column Boundaries',
    [
      { left: 'Input Wall', right: 'Segment W from Start(x, y) to End(x, y)', unit: 'full line' },
      { left: 'Sort Columns', right: 'Order intersecting pillars by distance from Start point', unit: 'ordered list' },
      { left: 'Sub-Span 1', right: 'From Start point to near face of Pillar 1', unit: 'mesh 1' },
      { left: 'Sub-Span k', right: 'From far face of Pillar (k-1) to near face of Pillar k', unit: 'mesh k' },
      { left: 'Collision Overlap', right: 'Exactly 0.00 percent (zero visual clipping)', unit: 'verified' }
    ],
    [
      'Openings located on split walls are dynamically transferred to their respective sub-span.',
      'Ensures 100 percent geometric consistency between 2D canvas plans and 3D WebGL models.'
    ],
    y, 95
  );

  pdf.drawFooter(3, TOTAL_PAGES);

  // ==========================================
  // PAGE 4: MORTAR BETWEEN BRICKS
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('4. CONCRETE & MORTAR BETWEEN BRICKS', 4, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('4.1 Inter-Brick Joint Mortar Volume Extraction', y);
  y = pdf.drawFormulaCard(
    'Wet Mortar Volumetric Derivation',
    [
      { left: 'V_solid_clay', right: 'Q_base x V_actual = Q_base x 0.00198375', unit: 'cu.meters' },
      { left: 'V_wet_mortar', right: 'Max( 0, V_net_recalc - V_solid_clay )', unit: 'cu.meters' },
      { left: 'Mortar Proportion', right: 'V_wet_mortar / V_net_recalc', unit: 'typically 22 to 24 %' }
    ],
    [
      'Subtracts the pure solid clay volume from the net wall volume.',
      'The difference represents the exact volume of 10 mm bed and head joints.'
    ],
    y, 75
  );

  y = pdf.drawSectionHeader('4.2 Dry Mortar Volume Conversion', y);
  y = pdf.drawFormulaCard(
    'Dry Volume Bulking and Voids Allowance',
    [
      { left: 'Dry Volume Factor', right: '1.33 (Civil standard: 33 percent extra for voids and shrinkage)', unit: 'factor' },
      { left: 'V_dry_mortar', right: 'V_wet_mortar x 1.33', unit: 'cu.meters' }
    ],
    [
      'Dry cement and sand reduce in volume when mixed with water.',
      'A factor of 1.33 guarantees sufficient raw dry material on site.'
    ],
    y, 65
  );

  y = pdf.drawSectionHeader('4.3 Material Proportions: Cement Bags and Sand CFT', y);
  y = pdf.drawFormulaCard(
    'Cement and Sand Proportions for Mortar Mix (1 : N)',
    [
      { left: 'Mix Ratio', right: '1 part Cement : N parts Sand (Total Parts = 1 + N)', unit: 'ratio' },
      { left: 'V_cement', right: 'V_dry_mortar x ( 1.0 / ( 1 + N ) )', unit: 'cu.meters' },
      { left: 'V_sand', right: 'V_dry_mortar x ( N / ( 1 + N ) )', unit: 'cu.meters' },
      { left: 'Cement Bags (50kg)', right: 'RoundUp( V_cement / 0.03472 )', unit: 'bags' },
      { left: 'Sand Volume (CFT)', right: 'V_sand x 35.3147', unit: 'cubic feet' }
    ],
    [
      'Standard Mix Ratios: 1:3 (Parapets) | 1:4 (4.5 inch walls) | 1:5 (9 inch walls) | 1:6 (Internal)',
      '1 Standard Cement Bag = 50 kg = 0.03472 cu.m (1440 kg/cu.m density).'
    ],
    y, 90
  );

  y = pdf.drawAlignedList([
    { label: 'Mortar Yield per 50kg Bag', value: '1:5 Mix yields ~0.208 cu.m wet mortar (~850 bricks laid)' },
    { label: 'Water Requirement', value: '~28 Liters per 50kg cement bag (Water-cement ratio ~0.55)' }
  ], y, 200, 13);

  pdf.drawFooter(4, TOTAL_PAGES);

  // ==========================================
  // PAGE 5: PLASTERING ESTIMATION
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('5. PLASTERING ESTIMATION & IS 1200 DEDUCTIONS', 5, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('5.1 Indian Standard (IS 1200 Part XII) Opening Deductions', y);
  y = pdf.drawFormulaCard(
    'Opening Deduction Rules for Plastering',
    [
      { left: 'Rule 1 (Area < 0.50 sq.m)', right: 'Deduction = 0.00 sq.m (No deduction, no jamb addition)', unit: '0 %' },
      { left: 'Rule 2 (0.50 to 3.00 sq.m)', right: 'Deduct 50 percent of opening on ONE face only', unit: '50 % 1 face' },
      { left: 'Rule 2 (Opposite Face)', right: '0 percent deduction (retained area covers jambs/reveals)', unit: '0 % other' },
      { left: 'Rule 3 (Area > 3.00 sq.m)', right: 'Deduct 100 percent on BOTH faces. Jambs added separately', unit: '100 % both' }
    ],
    [
      'Conforms to IS 1200 Part XII Method of Measurement for Plastering.',
      'Eliminates laborious measurement of jambs and reveals on standard residential doors/windows.'
    ],
    y, 90
  );

  y = pdf.drawSectionHeader('5.2 Surface Specifications and Net Area Equations', y);
  y = pdf.drawAlignedList([
    { label: 'Inner Masonry Plaster', value: '12 mm thickness, 1:6 cement-sand mortar', note: 'Single interior face per wall' },
    { label: 'Outer Masonry Plaster', value: '15 to 20 mm thickness, 1:4 waterproof mortar', note: 'Exterior face of external walls' },
    { label: 'RCC Column Plaster', value: '6 to 10 mm thickness, 1:4 mortar', note: 'Exposed column faces only' },
    { label: 'RCC Beam Side Plaster', value: '6 mm thickness, 1:4 mortar', note: 'Side Face A + Side Face B' },
    { label: 'Ceiling / Soffit Plaster', value: '6 mm thickness, 1:3 mortar', note: 'Bottom face of RCC slab' }
  ], y, 180, 13);

  y -= 8;
  y = pdf.drawSectionHeader('5.3 Plaster Material and Labor Requirements', y);
  y = pdf.drawFormulaCard(
    'Plaster Mortar and Raw Material Requirements',
    [
      { left: 'V_wet_plaster', right: 'A_net_plaster x Thickness_plaster', unit: 'cu.meters' },
      { left: 'V_dry_plaster', right: 'V_wet_plaster x 1.30 (30 percent extra for joints and shrinkage)', unit: 'cu.meters' },
      { left: 'Cement Bags', right: 'RoundUp( ( V_dry_plaster x ( 1 / ( 1 + N ) ) / 0.03472 ) x 1.05 )', unit: 'bags (5% waste)' },
      { left: 'Sand (CFT)', right: 'RoundUp( ( V_dry_plaster x ( N / ( 1 + N ) ) x 35.3147 ) x 1.05 )', unit: 'CFT (5% waste)' },
      { left: 'Mason Days', right: 'RoundUp( A_net_plaster / 10.0 sq.m per day )', unit: 'skilled labor' },
      { left: 'Helper Days', right: 'RoundUp( A_net_plaster / 10.0 sq.m per day )', unit: 'unskilled labor' }
    ],
    [
      'Dry factor 1.30 covers uneven brick joint filling and shrinkage.',
      'Productivity: 1 Mason + 1 Helper covers approximately 10 sq.meters (108 sq.ft) per day.'
    ],
    y, 100
  );

  pdf.drawFooter(5, TOTAL_PAGES);

  // ==========================================
  // PAGE 6: RCC COLUMNS & STEEL
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('6. RCC COLUMN / PILLAR CONCRETE & STEEL', 6, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('6.1 Concrete Volume and Grade Mix Ratios', y);
  y = pdf.drawFormulaCard(
    'Pillar Concrete Volume and Mix Breakdown',
    [
      { left: 'Rectangular Volume', right: 'Width x Depth x Height x Pillar_Count', unit: 'cu.meters' },
      { left: 'Circular Volume', right: '3.1416 x ( Diameter / 2 )^2 x Height x Pillar_Count', unit: 'cu.meters' },
      { left: 'V_dry_concrete', right: 'V_wet_concrete x 1.54 (54 percent extra for shrinkage/voids)', unit: 'cu.meters' },
      { left: 'Mix Ratios', right: 'M20 = 1:1.5:3 (Sum = 5.5) | M15 = 1:2:4 (Sum = 7.0)', unit: 'standard mixes' },
      { left: 'Cement Bags (M20)', right: '( V_dry x ( 1.0 / 5.5 ) ) / 0.03472', unit: 'bags' },
      { left: 'Sand CFT (M20)', right: '( V_dry x ( 1.5 / 5.5 ) ) x 35.3147', unit: 'CFT' },
      { left: 'Aggregate 20mm CFT', right: '( V_dry x ( 3.0 / 5.5 ) ) x 35.3147', unit: 'CFT' }
    ],
    [
      'M20 Grade (1:1.5:3) is the minimum prescribed concrete grade for RCC columns (IS 456).',
      'Coarse aggregate: 20 mm graded blue metal granite.'
    ],
    y, 102
  );

  y = pdf.drawSectionHeader('6.2 Steel Unit Weight Derivation (D squared / 162)', y);
  y = pdf.drawFormulaCard(
    'Metric Rebar Unit Weight Formula',
    [
      { left: 'Weight (kg/m)', right: '( Diameter_mm x Diameter_mm ) / 162', unit: 'kg per meter' },
      { left: 'Exact Derivation', right: '( 3.1416 x (D/1000)^2 / 4 ) x 7850 = D^2 / 162.28', unit: 'exact density' }
    ],
    [
      '162 is the standard civil denominator for round steel rebar in metric units.',
      'Standard commercial rebar length: 12 meters (40 feet).'
    ],
    y, 60
  );

  y = pdf.drawTable(
    ['Bar Diameter', 'Unit Weight (kg/m)', 'Weight per 12m Rod', 'Primary Application'],
    [
      ['8 mm', '0.395 kg/m', '4.74 kg', 'Stirrup ties, slab distribution rebar'],
      ['10 mm', '0.617 kg/m', '7.40 kg', 'Slab main rebar, beam hanger bars'],
      ['12 mm', '0.888 kg/m', '10.66 kg', 'Column main bars, beam top/bottom bars, footing mat'],
      ['16 mm', '1.580 kg/m', '18.96 kg', 'Column vertical bars, beam tension steel, starter dowels'],
      ['20 mm', '2.469 kg/m', '29.63 kg', 'Heavy columns, long span transfer beams']
    ],
    [46, 120, 220, 320],
    y,
    13
  );

  y -= 8;
  y = pdf.drawSectionHeader('6.3 Pillar Reinforcement: Main Vertical Bars and Stirrup Ties', y);
  y = pdf.drawFormulaCard(
    'Column Steel Cutting Lengths and Bar Counts',
    [
      { left: 'Main Bar Length', right: 'Height_pillar x 1.10 (10 percent lap splice allowance)', unit: 'meters' },
      { left: 'Main Steel Weight', right: 'Count_bars x L_main x ( D_main^2 / 162 ) x Pillar_Count', unit: 'kg' },
      { left: 'Clear Cover', right: '40 mm (0.040 m) on all 4 faces (IS 456)', unit: 'cover' },
      { left: 'Core Dimensions', right: 'Width_core = Width - 2*cover | Depth_core = Depth - 2*cover', unit: 'meters' },
      { left: 'Tie Cutting Length', right: '2 x ( Width_core + Depth_core ) + 0.15 m (135 deg hook pair)', unit: 'meters' },
      { left: 'Tie Count per Pillar', right: 'RoundUp( Height_pillar / Spacing ) + 1  (Spacing = 150 mm)', unit: 'ties' },
      { left: 'Tie Steel Weight', right: 'N_ties x L_tie x ( D_tie^2 / 162 ) x Pillar_Count', unit: 'kg' }
    ],
    [
      'Joint Confinement: Add 3 extra closely spaced stirrups inside beam-column joint.',
      'Cover blocks: 4 concrete cover blocks (40 mm) per pillar at 1.0 m vertical intervals.'
    ],
    y, 102
  );

  pdf.drawFooter(6, TOTAL_PAGES);

  // ==========================================
  // PAGE 7: RCC RING BEAM & FRAME BEAMS
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('7. RCC RING BEAM & FRAME BEAMS', 7, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('7.1 Beam Span Detection and Extended Length', y);
  y = pdf.drawFormulaCard(
    'Pillar-to-Pillar Beam Span Geometry',
    [
      { left: 'Center Span (L_span)', right: 'Sqrt( ( EndX - StartX )^2 + ( EndY - StartY )^2 )', unit: 'meters' },
      { left: 'Extended Length (L_ext)', right: 'L_span + ( Start_Col_Width / 2 ) + ( End_Col_Width / 2 )', unit: 'meters' },
      { left: 'Clear Span (L_clear)', right: 'L_span - ( Start_Col_Width / 2 ) - ( End_Col_Width / 2 )', unit: 'meters' },
      { left: 'V_beam_concrete', right: 'Total_Extended_Length x Width_beam x Height_beam', unit: 'cu.meters' }
    ],
    [
      'Extended length ensures beams frame completely through column heads with zero gap.',
      'Standard beam dimensions: 9 inch width (0.2286 m) x 12 inch height (0.3048 m).'
    ],
    y, 75
  );

  y = pdf.drawSectionHeader('7.2 Longitudinal Rebar (Top and Bottom Steel)', y);
  y = pdf.drawFormulaCard(
    'Top (Compression) and Bottom (Tension) Steel',
    [
      { left: 'Top Bars (Hangers)', right: 'N_top x L_total x 1.10 x ( D_top^2 / 162 )  (Standard: 2 x 12mm)', unit: 'kg' },
      { left: 'Bottom Bars (Main)', right: 'N_bottom x L_total x 1.10 x ( D_bottom^2 / 162 ) (Standard: 2 x 12mm)', unit: 'kg' },
      { left: 'Total Main Steel', right: 'Top_Bars_Weight + Bottom_Bars_Weight', unit: 'kg' }
    ],
    [
      '1.10 multiplier accounts for 10 percent lap splices and 90-degree end development anchorage.',
      'For heavier spans, bottom bars increase to 3 x 16mm or 4 x 16mm.'
    ],
    y, 75
  );

  y = pdf.drawSectionHeader('7.3 Transverse Closed Stirrup Ties (Shear Links)', y);
  y = pdf.drawFormulaCard(
    'Stirrup Tie Cutting Length and Total Weight',
    [
      { left: 'Clear Cover', right: '25 mm (0.025 m)', unit: 'cover' },
      { left: 'Core Width', right: 'Width_beam - 2 x 0.025 = 0.2286 - 0.050', unit: '= 0.1786 m' },
      { left: 'Core Height', right: 'Height_beam - 2 x 0.025 = 0.3048 - 0.050', unit: '= 0.2548 m' },
      { left: 'Stirrup Cut Length', right: '2 x ( Core_Width + Core_Height ) + 0.15 m', unit: '= 1.017 m' },
      { left: 'Stirrup Count', right: 'RoundUp( Total_Beam_Length / Spacing ) + 1  (Spacing = 150 mm)', unit: 'ties' },
      { left: 'Stirrups Weight', right: 'N_stirrups x L_cut x ( D_stirrup^2 / 162 )  (Standard: 8mm)', unit: 'kg' }
    ],
    [
      '0.15 m hook addition provides two standard 135-degree seismic hooks (75 mm each).',
      'Binding wire requirement: approximately 10 kg per metric tonne of steel.'
    ],
    y, 95
  );

  y = pdf.drawAlignedList([
    { label: 'Total Beam Steel', value: 'W_beam = Top_Steel + Bottom_Steel + Stirrups_Steel' },
    { label: 'Beam Cover Blocks', value: '2 concrete cover blocks (25 mm) per meter of beam length' }
  ], y, 180, 13);

  pdf.drawFooter(7, TOTAL_PAGES);

  // ==========================================
  // PAGE 8: FULL SLAB / RCC FULL RING BEAM
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('8. FULL SLAB / RCC FULL RING BEAM', 8, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('8.1 Structural Bay Detection and Slab Concrete', y);
  y = pdf.drawFormulaCard(
    'Enclosed Bay Geometry and Concrete Volume',
    [
      { left: 'Bay Detection', right: 'Identifies closed rectangular cells bounded by 4 pillars', unit: 'geometry' },
      { left: 'Effective Bay Width', right: 'Inner_Bay_Width + Pillar_Width', unit: 'meters' },
      { left: 'Effective Bay Depth', right: 'Inner_Bay_Depth + Pillar_Depth', unit: 'meters' },
      { left: 'Bay Area (A_bay)', right: 'Effective_Bay_Width x Effective_Bay_Depth', unit: 'sq.meters' },
      { left: 'Total Slab Area', right: 'Sum of all Bay Areas', unit: 'sq.meters' },
      { left: 'V_slab_concrete', right: 'Total_Slab_Area x Thickness_slab  (Thickness = 5 inches = 0.127 m)', unit: 'cu.meters' }
    ],
    [
      'Effective bay dimensions extend to outer pillar edges to cover the entire beam-slab frame.',
      'Standard residential roof slab thickness: 5 inches (0.127 m) or 6 inches (0.152 m).'
    ],
    y, 90
  );

  y = pdf.drawSectionHeader('8.2 Two-Way Orthogonal Steel Reinforcement (IS 456)', y);
  y = pdf.drawFormulaCard(
    'Main and Distribution Slab Steel Mesh',
    [
      { left: 'Main Steel (Short Span)', right: 'Diameter = 10 mm | Spacing = 150 mm (0.15 m)', unit: 'direction 1' },
      { left: 'Main Bar Count', right: 'RoundUp( Effective_Bay_Depth / 0.15 ) + 1', unit: 'bars' },
      { left: 'Main Bar Length', right: 'Effective_Bay_Width + 0.20 m (end development hooks)', unit: 'meters' },
      { left: 'Main Steel Weight', right: 'Count x Length x ( 10^2 / 162 ) = Count x Length x 0.617', unit: 'kg' },
      { left: 'Dist Steel (Long Span)', right: 'Diameter = 8 mm | Spacing = 150 mm (0.15 m)', unit: 'direction 2' },
      { left: 'Dist Bar Count', right: 'RoundUp( Effective_Bay_Width / 0.15 ) + 1', unit: 'bars' },
      { left: 'Dist Bar Length', right: 'Effective_Bay_Depth + 0.20 m (end development hooks)', unit: 'meters' },
      { left: 'Dist Steel Weight', right: 'Count x Length x ( 8^2 / 162 ) = Count x Length x 0.395', unit: 'kg' },
      { left: 'Total Slab Steel', right: 'Main_Steel_Weight + Distribution_Steel_Weight', unit: 'kg' }
    ],
    [
      'Main bars span the shorter distance to resist maximum sagging bending moment.',
      'Distribution bars control shrinkage and temperature cracks along the longer span.'
    ],
    y, 115
  );

  y = pdf.drawAlignedList([
    { label: 'Slab Concrete Cover', value: '20 mm clear cover (top and bottom)' },
    { label: 'Slab Cover Blocks', value: '4 cover blocks (20 mm) per sq.meter of slab area' },
    { label: 'Waterproofing Compound', value: '200 ml liquid integral waterproofing per 50kg cement bag' }
  ], y, 180, 13);

  pdf.drawFooter(8, TOTAL_PAGES);

  // ==========================================
  // PAGE 9: UNDERGROUND BASEMENT & FOUNDATION
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('9. UNDERGROUND BASEMENT & FOUNDATION SUBSTRUCTURE', 9, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('9.1 Earthwork Excavation Pit', y);
  y = pdf.drawFormulaCard(
    'Excavation Volume per Footing Pit',
    [
      { left: 'Pit Dimensions', right: 'Length_pit x Width_pit x Depth_pit', unit: 'meters' },
      { left: 'V_excavation', right: 'Length x Width x Depth x Pit_Count', unit: 'cu.meters' }
    ],
    [
      'Standard isolated footing pit: 5.0 ft x 5.0 ft x 5.0 ft (1.524 m x 1.524 m x 1.524 m).',
      'Pit dimensions extend 150 mm beyond PCC mud mat on all sides for working space.'
    ],
    y, 60
  );

  y = pdf.drawSectionHeader('9.2 Foundation Bed Sand Filling', y);
  y = pdf.drawFormulaCard(
    'Sand Bed Level Volume with Compaction',
    [
      { left: 'V_sand_net', right: 'Length_pit x Width_pit x Depth_sand  (Depth = 150 mm = 0.15 m)', unit: 'cu.meters' },
      { left: 'V_sand_compacted', right: 'V_sand_net x 1.15 (15 percent loose bulking compaction)', unit: 'cu.meters' },
      { left: 'Sand Volume (CFT)', right: 'V_sand_compacted x 35.3147', unit: 'cubic feet' }
    ],
    [
      'Sand bed levels the irregular excavation subsoil and absorbs foundation settlement stresses.',
      'Compacted with water tamping prior to PCC mud mat pouring.'
    ],
    y, 70
  );

  y = pdf.drawSectionHeader('9.3 Plain Cement Concrete (PCC 1:4:8 Mud Mat)', y);
  y = pdf.drawFormulaCard(
    'PCC Base Concrete Materials (1:4:8 Lean Mix)',
    [
      { left: 'V_pcc_wet', right: 'Length_pcc x Width_pcc x Depth_pcc  (Depth = 100 mm = 0.10 m)', unit: 'cu.meters' },
      { left: 'V_pcc_dry', right: 'V_pcc_wet x 1.54 (54 percent dry factor)', unit: 'cu.meters' },
      { left: 'Mix 1:4:8 (Sum = 13)', right: 'Cement = 1 part, Sand = 4 parts, Aggregate 40mm = 8 parts', unit: 'parts' },
      { left: 'Cement Bags', right: '( V_pcc_dry x ( 1.0 / 13 ) ) / 0.03472', unit: 'bags' },
      { left: 'Sand CFT', right: '( V_pcc_dry x ( 4.0 / 13 ) ) x 35.3147', unit: 'CFT' },
      { left: 'Aggregate 40mm CFT', right: '( V_dry x ( 8.0 / 13 ) ) x 35.3147', unit: 'CFT' }
    ],
    [
      'Provides a clean, solid, non-porous working bed for steel rebar positioning.',
      'Zero steel reinforcement is used in the PCC mud mat.'
    ],
    y, 85
  );

  y = pdf.drawSectionHeader('9.4 RCC Footing Pad and Earth Backfilling', y);
  y = pdf.drawFormulaCard(
    'Footing Concrete Volume and Earth Backfill',
    [
      { left: 'Flat Footing Pad', right: 'Length_pad x Width_pad x Depth_pad', unit: 'cu.meters' },
      { left: 'Trapezoidal Footing', right: '( A1 x D1 ) + ( D2 / 3 ) x ( A1 + A2 + Sqrt( A1 x A2 ) )', unit: 'cu.meters' },
      { left: 'Displaced Volume', right: 'V_sand + V_pcc + V_footing + V_column_stub', unit: 'cu.meters' },
      { left: 'V_backfill_earth', right: 'Max( 0, V_excavation - Displaced_Volume )', unit: 'cu.meters' }
    ],
    [
      'A1 = Bottom pad area (L x W) | A2 = Top column pedestal area (w x d).',
      'Backfilling volume determines surplus earth removal or borrowing needs.'
    ],
    y, 80
  );

  pdf.drawFooter(9, TOTAL_PAGES);

  // ==========================================
  // PAGE 10: STARTER STUBS & SUBSTRUCTURE STEEL
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('10. COLUMN STARTER STUBS & FOOTING STEEL', 10, TOTAL_PAGES);

  y = 735;
  y = pdf.drawSectionHeader('10.1 Footing Bottom Steel Mesh Mat (2-Way Orthogonal)', y);
  y = pdf.drawFormulaCard(
    'Footing Mesh Mat Cutting Length and Weight',
    [
      { left: 'Clear Soil Cover', right: '50 mm (0.050 m) (IS 456 for earth-contact foundations)', unit: 'cover' },
      { left: 'Upward 90 deg Hook', right: '150 mm (0.150 m) vertical bends on all bar ends', unit: 'hook' },
      { left: 'Bar Cut Length (X)', right: '( Length_footing - 2 x 0.050 ) + 2 x 0.150', unit: 'meters' },
      { left: 'Bar Cut Length (Y)', right: '( Width_footing - 2 x 0.050 ) + 2 x 0.150', unit: 'meters' },
      { left: 'Bar Count in X', right: 'RoundUp( ( Width_footing - 2 x 0.050 ) / 0.150 ) + 1', unit: 'bars' },
      { left: 'Bar Count in Y', right: 'RoundUp( ( Length_footing - 2 x 0.050 ) / 0.150 ) + 1', unit: 'bars' },
      { left: 'Footing Steel Weight', right: '( Count_X x L_cut_X + Count_Y x L_cut_Y ) x ( 12^2 / 162 )', unit: 'kg (12mm rebar)' }
    ],
    [
      'Standard footing mesh: 12 mm TMT bars spaced at 150 mm center-to-center.',
      'Cover blocks: 50 mm heavy-duty concrete cover blocks (4 blocks per footing pad).'
    ],
    y, 98
  );

  y = pdf.drawSectionHeader('10.2 Column Starter Dowel Stubs (Basement to Plinth)', y);
  y = pdf.drawFormulaCard(
    'Vertical Starter Dowel Bars and Lateral Ties',
    [
      { left: 'Stub Dimensions', right: 'Width_col x Depth_col x Height_stub  (Height = 2.0 ft = 0.60 m)', unit: 'meters' },
      { left: 'V_stub_concrete', right: 'Width x Depth x Height x Pillar_Count', unit: 'cu.meters' },
      { left: 'Starter Bar Length', right: 'Depth_footing + Height_stub + 0.30 m (300 mm 90 deg L-bend)', unit: 'meters' },
      { left: 'Starter Steel Weight', right: 'Count_bars x L_starter x ( 16^2 / 162 ) x Pillar_Count', unit: 'kg (16mm rebar)' },
      { left: 'Stub Stirrup Ties', right: '2 x ( Core_Width + Core_Depth ) + 0.15 m', unit: 'meters' },
      { left: 'Ties Count per Stub', right: 'Max( 2, Floor( Height_stub / 0.150 ) )', unit: 'ties' },
      { left: 'Stub Ties Weight', right: 'N_ties x L_tie x ( 8^2 / 162 ) x Pillar_Count', unit: 'kg (8mm rebar)' }
    ],
    [
      'Starter dowels transfer column axial load and moment directly into the footing concrete.',
      '300 mm L-bends rest directly upon the bottom steel mesh mat.'
    ],
    y, 105
  );

  y = pdf.drawAlignedList([
    { label: 'Substructure Total Steel', value: 'W_subgrade = Footing_Mesh + Starter_Dowels + Stub_Ties' },
    { label: 'Binding Wire Requirement', value: '10 to 12 kg per metric tonne of substructure steel' }
  ], y, 180, 13);

  pdf.drawFooter(10, TOTAL_PAGES);

  // ==========================================
  // PAGE 11: ELEVATION STACKING CASCADE
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('11. MASTER ELEVATION STACKING & JUNCTION RULE', 11, TOTAL_PAGES);

  let y11 = 735;
  y11 = pdf.drawSectionHeader('11.1 The Single Source of Truth Elevation Cascade (getRingBeamJunction)', y11);
  y11 = pdf.drawFormulaCard(
    'Vertical Coordinate Progression Equations (Y-Axis)',
    [
      { left: '1. Excavation Base', right: 'minus Height_excavation', unit: 'Y_0' },
      { left: '2. Sand Bed Surface', right: 'Y_0 + Thickness_sand', unit: 'Y_1' },
      { left: '3. PCC Mud Mat Surface', right: 'Y_1 + Thickness_pcc', unit: 'Y_2' },
      { left: '4. Footing Pad Surface', right: 'Y_2 + Depth_footing', unit: 'Y_3' },
      { left: '5. Ground Plinth Base', right: '0.000 meters (Master Zero Datum)', unit: 'Y_base' },
      { left: '6. Brick Wall Top Datum', right: 'Y_base + Height_wall (e.g. 10 ft = 3.048 m)', unit: 'Y_wall_top' },
      { left: '7. RCC Ring Beam Bottom', right: 'Y_wall_top (Zero clearance gap)', unit: 'Y_beam_bottom' },
      { left: '8. Canonical Top Line', right: 'Y_wall_top + Height_beam', unit: 'Y_top_line' },
      { left: '9. RCC Ring Beam Center', right: 'Y_top_line - ( Height_beam / 2 )', unit: 'Y_beam_center' },
      { left: '10. RCC Roof Slab Top', right: 'Y_top_line (Flush with beam top line)', unit: 'Y_slab_top' },
      { left: '11. RCC Roof Slab Bottom', right: 'Y_top_line - Thickness_slab', unit: 'Y_slab_bottom' },
      { left: '12. Next Floor Plinth Base', right: 'Y_top_line (Continuous upward cascade)', unit: 'Y_next_base' }
    ],
    [
      'Every floor level is mathematically verified: Wall-to-Beam Gap = 0.000 mm.',
      'Beam-to-Slab Gap = 0.000 mm. Canonical coplanar alignment eliminates all 3D mesh leaks.'
    ],
    y11, 172
  );

  y11 = pdf.drawSectionHeader('11.2 Column Shaft and Joint Stacking Architecture', y11);
  y11 = pdf.drawAlignedList([
    { label: 'Column Shaft Zone', value: 'Extends from Y_base to Y_wall_top (clear height = Height_wall)' },
    { label: 'Column Joint Zone', value: 'Extends from Y_wall_top to Y_top_line (confined height = Height_beam)' },
    { label: 'Total Column Height', value: 'H_col_total = Height_wall + Height_beam (Monolithic continuous pillar)' },
    { label: 'Vertical Continuity', value: 'Column main bars extend continuously through beam-column junction' }
  ], y11, 180, 13);

  pdf.drawFooter(11, TOTAL_PAGES);

  // ==========================================
  // PAGE 12: 3D STEEL VIEW GENERATION
  // ==========================================
  pdf.addPage();
  pdf.drawHeader('12. 3D STEEL VIEW GENERATION & REBAR SHADERS', 12, TOTAL_PAGES);

  let y12 = 735;
  y12 = pdf.drawSectionHeader('12.1 Three.js Coordinate Space and Visual Scaling Safeguards', y12);
  y12 = pdf.drawFormulaCard(
    'Coordinate Mapping and Pixel-Safe Rebar Scaling',
    [
      { left: '3D Coordinate Space', right: 'X = Horizontal (East) | Y = Height (Up) | Z = Horizontal (South)', unit: 'Three.js' },
      { left: 'Physical Bar Radius', right: '( Bar_Diameter_mm x 0.001 ) / 2', unit: 'meters' },
      { left: 'Visual Radius Safeguard', right: 'Max( 0.006 m, Physical_Bar_Radius )', unit: 'meters' },
      { left: 'Stirrup Visual Radius', right: 'Max( 0.006 m, ( Stirrup_Diameter_mm x 0.001 ) / 2 )', unit: 'meters' }
    ],
    [
      'Actual civil rebar diameters (8 mm to 16 mm) become sub-pixel and flicker on WebGL canvases.',
      'A minimum safeguard radius of 0.006 m (6 mm) ensures crisp anti-aliased visibility at all zoom levels.'
    ],
    y12, 75
  );

  y12 = pdf.drawSectionHeader('12.2 Steel Rebar Materials and Translucent Concrete Shaders', y12);
  y12 = pdf.drawAlignedList([
    { label: 'Main Longitudinal Bars', value: 'Cyan Glow (#00f0ff) | Emissive: #0284c7 | Metalness: 0.90 | Roughness: 0.20' },
    { label: 'Stirrup Ties / Rings', value: 'Amber Gold (#ffb703) | Emissive: #d97706 | Metalness: 0.90 | Roughness: 0.20' },
    { label: 'Translucent Concrete Shell', value: 'Slate (#64748b) | Opacity: 0.20 | Transparent: true | depthWrite: false' },
    { label: 'Rendering Order', value: 'Concrete Shell: renderOrder = 1 | Steel Rebar Cages: renderOrder = 10' }
  ], y12, 180, 13);

  y12 -= 8;
  y12 = pdf.drawSectionHeader('12.3 Ring Beam Rebar Cage Local Positioning Equations', y12);
  y12 = pdf.drawFormulaCard(
    'Local Space Positioning of Ring Beam Rebar Cages',
    [
      { left: 'Beam Local Rotation', right: '[ 0, -angle, 0 ] where angle = Atan2( - (eY - sY), eX - sX )', unit: 'rotation' },
      { left: 'Top Bars Y Position', right: '+ Core_Height / 2 - Stirrup_Radius - Bar_Radius', unit: 'rot: [ 0, 0, pi/2 ]' },
      { left: 'Bottom Bars Y Position', right: '- Core_Height / 2 + Stirrup_Radius + Bar_Radius', unit: 'rot: [ 0, 0, pi/2 ]' },
      { left: 'Top Stirrup Rod', right: 'Pos: [ x_k, + Core_Height / 2, 0 ] | Rot: [ pi/2, 0, 0 ]', unit: 'Length = Core_Width' },
      { left: 'Bottom Stirrup Rod', right: 'Pos: [ x_k, - Core_Height / 2, 0 ] | Rot: [ pi/2, 0, 0 ]', unit: 'Length = Core_Width' },
      { left: 'Left Stirrup Rod', right: 'Pos: [ x_k, 0, - Core_Width / 2 ] | Rot: [ 0, 0, 0 ]', unit: 'Length = Core_Height' },
      { left: 'Right Stirrup Rod', right: 'Pos: [ x_k, 0, + Core_Width / 2 ] | Rot: [ 0, 0, 0 ]', unit: 'Length = Core_Height' }
    ],
    [
      'Horizontal bars rotated by [0, 0, pi/2] along beam local X-axis.',
      'Produces an authentic 3D structural steel cage meeting SP 34 reinforcement detailing standards.'
    ],
    y12, 115
  );

  pdf.drawFooter(12, TOTAL_PAGES);

  // Compile full PDF buffer
  const pdfBuffer = pdf.compilePdf();

  // Save directly to disk at workspace root
  try {
    const savePath = path.join(process.cwd(), 'CIVIL_FORMULAS_MANUAL.pdf');
    fs.writeFileSync(savePath, pdfBuffer);
  } catch (err) {
    console.error('Error saving PDF to root:', err);
  }

  // Return as downloadable stream
  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="CIVIL_FORMULAS_MANUAL.pdf"',
      'Content-Length': String(pdfBuffer.length),
      'Cache-Control': 'no-store'
    }
  });
}
