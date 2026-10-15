import * as THREE from 'three';

/**
 * Creates a photorealistic pharmaceutical medicine packaging carton box.
 * Features 6 distinct high-resolution textures with clinical branding,
 * metallic holographic tamper-evident seal, Braille dots, barcode/DataMatrix,
 * and a satin-varnished paperboard finish that catches studio softbox reflections.
 */
export const createMedicineBox = (
  GROUND_Y: number,
  posX = -2.45,
  posZ = 0.05,
  rotY = 0.28,
  width = 0.95,
  height = 2.05,
  depth = 0.65
): { boxGroup: THREE.Group; contactShadow: THREE.Mesh } => {
  const boxGroup = new THREE.Group();

  boxGroup.position.set(posX, GROUND_Y + height / 2, posZ);
  boxGroup.rotation.set(0, rotY, 0); // Display angle showing front face and right side face

  // ---------------------------------------------------------------------------
  // 1. Texture Generation for each face of the carton
  // ---------------------------------------------------------------------------

  // A. FRONT FACE (Width x Height)
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 2048;
  const fctx = frontCanvas.getContext('2d');
  if (fctx) {
    // Pure clinical white satin cardstock
    fctx.fillStyle = '#FAFBFD';
    fctx.fillRect(0, 0, 1024, 2048);

    // Deep royal blue & cobalt corporate medicine header block
    const blueGrad = fctx.createLinearGradient(0, 0, 1024, 0);
    blueGrad.addColorStop(0, '#1E3A8A');
    blueGrad.addColorStop(1, '#1D4ED8');
    fctx.fillStyle = blueGrad;
    fctx.fillRect(40, 60, 944, 280);

    // Silver metallic accent pin-stripe
    fctx.fillStyle = '#38BDF8';
    fctx.fillRect(40, 340, 944, 18);

    // Laboratory Title & Shield
    fctx.fillStyle = '#FFFFFF';
    fctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    fctx.fillText('NOVACURE PHARMACEUTICALS', 80, 140);

    fctx.fillStyle = '#93C5FD';
    fctx.font = '600 24px monospace';
    fctx.fillText('CLINICAL FORMULATION LABS • NDC 68462-104-30', 80, 185);

    // Red Rx symbol
    fctx.fillStyle = '#EF4444';
    fctx.font = '900 80px serif';
    fctx.fillText('℞', 80, 300);

    fctx.fillStyle = '#FFFFFF';
    fctx.font = 'bold 32px sans-serif';
    fctx.fillText('PRESCRIPTION ONLY', 170, 275);
    fctx.font = '22px sans-serif';
    fctx.fillText('SCHEDULE H DRUG', 170, 305);

    // Primary Medication Title
    fctx.fillStyle = '#0F172A';
    fctx.font = '900 72px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    fctx.fillText('AMOXICILLIN', 80, 520);
    fctx.fillText('& CLAVULANATE', 80, 600);

    fctx.font = 'bold 44px sans-serif';
    fctx.fillStyle = '#2563EB';
    fctx.fillText('POTASSIUM TABLETS USP', 80, 670);

    // Strength Highlight Banner
    fctx.fillStyle = '#EFF6FF';
    fctx.strokeStyle = '#2563EB';
    fctx.lineWidth = 4;
    fctx.beginPath();
    fctx.roundRect(80, 720, 864, 150, 16);
    fctx.fill();
    fctx.stroke();

    fctx.fillStyle = '#1E3A8A';
    fctx.font = '900 74px monospace';
    fctx.fillText('500 mg / 125 mg', 120, 825);

    // Quantity & Route
    fctx.fillStyle = '#0F172A';
    fctx.font = 'bold 40px sans-serif';
    fctx.fillText('30 Film-Coated Tablets', 80, 950);

    fctx.fillStyle = '#475569';
    fctx.font = '600 30px sans-serif';
    fctx.fillText('For Oral Administration • Sealed in Moisture-Proof Foil', 80, 1000);

    // Subtle Braille Dots Pattern (Raised tactile dots for pharmaceutical packaging ISO standard)
    fctx.fillStyle = '#CBD5E1';
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 18; col++) {
        fctx.beginPath();
        fctx.arc(120 + col * 46, 1100 + row * 40, 6, 0, Math.PI * 2);
        fctx.fill();
      }
    }

    // Holographic Authenticity Seal (Simulated silver reflective shield)
    fctx.fillStyle = '#E2E8F0';
    fctx.strokeStyle = '#94A3B8';
    fctx.lineWidth = 4;
    fctx.beginPath();
    fctx.roundRect(80, 1260, 400, 160, 14);
    fctx.fill();
    fctx.stroke();

    const holoGrad = fctx.createLinearGradient(80, 1260, 480, 1420);
    holoGrad.addColorStop(0, '#BAE6FD');
    holoGrad.addColorStop(0.3, '#E0E7FF');
    holoGrad.addColorStop(0.6, '#DDD6FE');
    holoGrad.addColorStop(1, '#BAE6FD');
    fctx.fillStyle = holoGrad;
    fctx.beginPath();
    fctx.roundRect(90, 1270, 380, 140, 10);
    fctx.fill();

    fctx.fillStyle = '#1E293B';
    fctx.font = '900 28px sans-serif';
    fctx.fillText('★ AUTHENTIC PRODUCT ★', 115, 1330);
    fctx.font = 'bold 22px monospace';
    fctx.fillText('CLINICAL SECURITY VERIFIED', 115, 1370);

    // Warning Badge
    fctx.fillStyle = '#FEF2F2';
    fctx.strokeStyle = '#EF4444';
    fctx.lineWidth = 3;
    fctx.beginPath();
    fctx.roundRect(520, 1260, 424, 160, 14);
    fctx.fill();
    fctx.stroke();

    fctx.fillStyle = '#991B1B';
    fctx.font = '900 24px sans-serif';
    fctx.fillText('SCHEDULE H PRESCRIPTION', 545, 1320);
    fctx.font = 'bold 20px sans-serif';
    fctx.fillText('To be sold by retail on the', 545, 1355);
    fctx.fillText('prescription of an R.M.P. only.', 545, 1385);

    // Linear Barcode on front footer
    fctx.fillStyle = '#0F172A';
    for (let bx = 0; bx < 860; bx += 8) {
      const w = (bx % 24 === 0) ? 6 : (bx % 8 === 0 ? 3 : 2);
      fctx.fillRect(80 + bx, 1580, w, 160);
    }
    fctx.font = 'bold 32px monospace';
    fctx.fillText('(01) 08904018294109 (17) 290731 (10) AMX26', 80, 1790);

    // Footer Clinical Details
    fctx.fillStyle = '#64748B';
    fctx.font = '24px sans-serif';
    fctx.fillText('Manufactured under WHO-GMP Certified Standards', 80, 1900);
    fctx.fillText('NovaCure Biotech Park, Sector 4, Bio-Corridor', 80, 1940);
  }

  // B. RIGHT SIDE FACE (Depth x Height) - Traceability, Barcodes, Batch
  const rightCanvas = document.createElement('canvas');
  rightCanvas.width = 1024;
  rightCanvas.height = 2048;
  const rctx = rightCanvas.getContext('2d');
  if (rctx) {
    rctx.fillStyle = '#FAFBFD';
    rctx.fillRect(0, 0, 1024, 2048);

    rctx.fillStyle = '#1E3A8A';
    rctx.fillRect(40, 60, 944, 90);
    rctx.fillStyle = '#FFFFFF';
    rctx.font = 'bold 36px sans-serif';
    rctx.fillText('BATCH VERIFICATION & MRP', 80, 120);

    // Batch Information Panel
    rctx.fillStyle = '#F1F5F9';
    rctx.strokeStyle = '#CBD5E1';
    rctx.lineWidth = 2;
    rctx.beginPath();
    rctx.roundRect(60, 200, 904, 380, 14);
    rctx.fill();
    rctx.stroke();

    rctx.fillStyle = '#0F172A';
    rctx.font = 'bold 36px monospace';
    rctx.fillText('B. No. (Batch)  : AMX-26804', 100, 270);
    rctx.fillText('MFD. (Mfg Date) : AUG 2026', 100, 335);
    rctx.fillText('EXP. (Exp Date) : JUL 2029', 100, 400);
    rctx.fillText('M.R.P. $        : $ 24.50', 100, 465);
    rctx.font = '22px sans-serif';
    rctx.fillStyle = '#64748B';
    rctx.fillText('(Inclusive of all federal, state & dispensing taxes)', 100, 525);

    // High-Resolution 2D GS1 DataMatrix QR Square
    rctx.fillStyle = '#0F172A';
    rctx.fillRect(100, 660, 300, 300);
    rctx.fillStyle = '#FFFFFF';
    rctx.fillRect(120, 680, 260, 260);

    // Matrix Pixels
    rctx.fillStyle = '#0F172A';
    const matrixGrid = [
      [1,1,1,1,1,0,1,0,1,1,1,1],
      [1,0,0,0,1,1,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,1],
      [1,0,1,0,1,1,0,0,1,0,1,1],
      [1,0,0,0,1,0,1,1,0,0,0,1],
      [1,1,1,1,1,0,1,0,1,1,1,1],
      [0,1,0,1,0,1,1,0,1,0,1,0],
      [1,0,1,0,1,0,0,1,0,1,0,1],
      [1,1,0,0,1,1,1,0,1,1,0,1],
      [1,0,1,1,0,0,1,0,0,1,1,1],
      [1,0,0,1,1,0,1,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ];
    for (let r = 0; r < matrixGrid.length; r++) {
      for (let c = 0; c < matrixGrid[r].length; c++) {
        if (matrixGrid[r][c] === 1) {
          rctx.fillRect(130 + c * 20, 690 + r * 20, 18, 18);
        }
      }
    }

    rctx.fillStyle = '#0F172A';
    rctx.font = 'bold 32px sans-serif';
    rctx.fillText('GS1 DIGITAL TRACK & TRACE', 440, 740);
    rctx.font = '24px sans-serif';
    rctx.fillStyle = '#475569';
    rctx.fillText('Scan with camera or mobile app', 440, 785);
    rctx.fillText('to verify serial number integrity', 440, 825);
    rctx.fillText('& temperature chain stability.', 440, 865);

    // Storage guidelines
    rctx.strokeStyle = '#CBD5E1';
    rctx.lineWidth = 3;
    rctx.beginPath();
    rctx.moveTo(60, 1060);
    rctx.lineTo(964, 1060);
    rctx.stroke();

    rctx.fillStyle = '#0F172A';
    rctx.font = 'bold 36px sans-serif';
    rctx.fillText('STORAGE CONDITIONS:', 60, 1140);
    rctx.font = '28px sans-serif';
    rctx.fillStyle = '#334155';
    rctx.fillText('• Store below 25°C (77°F) in a dry place.', 60, 1200);
    rctx.fillText('• Protect from direct heat, sunlight & moisture.', 60, 1250);
    rctx.fillText('• Keep medicine out of reach of children.', 60, 1300);
    rctx.fillText('• Do not chew or crush film-coated tablets.', 60, 1350);

    // Certified WHO-GMP Seal Circle
    rctx.strokeStyle = '#0284C7';
    rctx.lineWidth = 6;
    rctx.beginPath();
    rctx.arc(512, 1620, 140, 0, Math.PI * 2);
    rctx.stroke();

    rctx.fillStyle = '#0284C7';
    rctx.font = 'bold 34px sans-serif';
    rctx.textAlign = 'center';
    rctx.fillText('WHO - GMP', 512, 1605);
    rctx.font = 'bold 24px sans-serif';
    rctx.fillText('CERTIFIED FACILITY', 512, 1650);
    rctx.textAlign = 'left';
  }

  // C. LEFT SIDE FACE (Depth x Height) - Composition, Excipients, Schedule H
  const leftCanvas = document.createElement('canvas');
  leftCanvas.width = 1024;
  leftCanvas.height = 2048;
  const lctx = leftCanvas.getContext('2d');
  if (lctx) {
    lctx.fillStyle = '#FAFBFD';
    lctx.fillRect(0, 0, 1024, 2048);

    lctx.fillStyle = '#1E3A8A';
    lctx.fillRect(40, 60, 944, 90);
    lctx.fillStyle = '#FFFFFF';
    lctx.font = 'bold 36px sans-serif';
    lctx.fillText('COMPOSITION & DOSAGE', 80, 120);

    lctx.fillStyle = '#0F172A';
    lctx.font = 'bold 36px sans-serif';
    lctx.fillText('EACH FILM-COATED TABLET CONTAINS:', 60, 240);

    lctx.font = '30px sans-serif';
    lctx.fillStyle = '#334155';
    lctx.fillText('Amoxicillin Trihydrate IP', 60, 310);
    lctx.fillText('eq. to Anhydrous Amoxicillin ................. 500 mg', 60, 355);

    lctx.fillText('Potassium Clavulanate Diluted IP', 60, 430);
    lctx.fillText('eq. to Clavulanic Acid .......................... 125 mg', 60, 475);

    lctx.fillText('Colours: Titanium Dioxide IP & Iron Oxide', 60, 550);
    lctx.fillText('Excipients ........................................................... q.s.', 60, 600);

    // Dosage Instruction
    lctx.fillStyle = '#0F172A';
    lctx.font = 'bold 36px sans-serif';
    lctx.fillText('DOSAGE:', 60, 710);
    lctx.font = '30px sans-serif';
    lctx.fillStyle = '#334155';
    lctx.fillText('As directed by the Physician.', 60, 765);
    lctx.fillText('Refer to enclosed prescribing monograph.', 60, 815);

    // Schedule H Red Statutory Box
    lctx.strokeStyle = '#DC2626';
    lctx.lineWidth = 6;
    lctx.strokeRect(60, 920, 904, 380);

    lctx.fillStyle = '#DC2626';
    lctx.fillRect(60, 920, 904, 70);
    lctx.fillStyle = '#FFFFFF';
    lctx.font = 'bold 32px sans-serif';
    lctx.fillText('SCHEDULE H PRESCRIPTION DRUG - CAUTION', 80, 968);

    lctx.fillStyle = '#7F1D1D';
    lctx.font = 'bold 28px sans-serif';
    lctx.fillText('Not to be sold by retail without the prescription', 90, 1050);
    lctx.fillText('of a Registered Medical Practitioner.', 90, 1100);
    lctx.font = '26px sans-serif';
    lctx.fillText('WARNING: To be sold only in original unbroken package.', 90, 1180);
    lctx.fillText('Misuse of antibiotics promotes bacterial resistance.', 90, 1230);

    // Regulatory approval
    lctx.fillStyle = '#64748B';
    lctx.font = '24px sans-serif';
    lctx.fillText('Mfg. Lic. No.: G/28/1492', 60, 1420);
    lctx.fillText('Manufactured in India by NovaCure Pharma Ltd.', 60, 1460);
  }

  // D. TOP FLAP FACE (Width x Depth)
  const topCanvas = document.createElement('canvas');
  topCanvas.width = 1024;
  topCanvas.height = 1024;
  const tctx = topCanvas.getContext('2d');
  if (tctx) {
    tctx.fillStyle = '#FAFBFD';
    tctx.fillRect(0, 0, 1024, 1024);

    // Paperboard flap tuck fold crease line
    tctx.strokeStyle = '#CBD5E1';
    tctx.lineWidth = 4;
    tctx.setLineDash([14, 10]);
    tctx.beginPath();
    tctx.moveTo(100, 180);
    tctx.lineTo(924, 180);
    tctx.stroke();
    tctx.setLineDash([]);

    // Brand on top
    tctx.fillStyle = '#1E3A8A';
    tctx.font = '900 64px sans-serif';
    tctx.textAlign = 'center';
    tctx.fillText('AMOXICILLIN 500mg', 512, 360);
    tctx.font = 'bold 44px sans-serif';
    tctx.fillStyle = '#2563EB';
    tctx.fillText('+ CLAVULANATE 125mg', 512, 430);

    // Silver Holographic Tamper-Evident Seal Label overlapping the flap opening
    const sealGrad = tctx.createLinearGradient(200, 600, 824, 880);
    sealGrad.addColorStop(0, '#E0E7FF');
    sealGrad.addColorStop(0.25, '#BAE6FD');
    sealGrad.addColorStop(0.5, '#FBCFE8');
    sealGrad.addColorStop(0.75, '#DDD6FE');
    sealGrad.addColorStop(1, '#E0E7FF');
    tctx.fillStyle = sealGrad;
    tctx.strokeStyle = '#94A3B8';
    tctx.lineWidth = 3;
    tctx.beginPath();
    tctx.roundRect(240, 620, 544, 240, 20);
    tctx.fill();
    tctx.stroke();

    tctx.fillStyle = '#1E293B';
    tctx.font = '900 36px sans-serif';
    tctx.fillText('SECURITY SEALED', 512, 710);
    tctx.font = 'bold 24px monospace';
    tctx.fillText('★ DO NOT ACCEPT IF BROKEN ★', 512, 765);
    tctx.font = 'bold 20px monospace';
    tctx.fillText('TAMPER RESISTANT PACKAGING', 512, 805);
    tctx.textAlign = 'left';
  }

  // E. BACK FACE (Width x Height)
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 1024;
  backCanvas.height = 2048;
  const bctx = backCanvas.getContext('2d');
  if (bctx) {
    bctx.fillStyle = '#FAFBFD';
    bctx.fillRect(0, 0, 1024, 2048);

    bctx.fillStyle = '#1E3A8A';
    bctx.fillRect(40, 60, 944, 110);
    bctx.fillStyle = '#FFFFFF';
    bctx.font = 'bold 42px sans-serif';
    bctx.fillText('PRESCRIBING SUMMARY & INDICATIONS', 80, 130);

    bctx.fillStyle = '#0F172A';
    bctx.font = 'bold 36px sans-serif';
    bctx.fillText('THERAPEUTIC CLASSIFICATION:', 80, 240);
    bctx.font = '30px sans-serif';
    bctx.fillStyle = '#334155';
    bctx.fillText('Broad spectrum beta-lactam antibacterial agent', 80, 290);
    bctx.fillText('with beta-lactamase inhibitor.', 80, 335);

    bctx.fillStyle = '#0F172A';
    bctx.font = 'bold 36px sans-serif';
    bctx.fillText('PRIMARY CLINICAL INDICATIONS:', 80, 420);
    bctx.font = '28px sans-serif';
    bctx.fillStyle = '#334155';
    bctx.fillText('• Acute bacterial sinusitis & otitis media', 80, 475);
    bctx.fillText('• Community-acquired respiratory tract infections', 80, 520);
    bctx.fillText('• Skin, soft tissue & periodontal infections', 80, 565);
    bctx.fillText('• Uncomplicated urinary tract infections', 80, 610);

    // Recycle & Eco symbols
    bctx.strokeStyle = '#94A3B8';
    bctx.lineWidth = 3;
    bctx.beginPath();
    bctx.roundRect(80, 1600, 864, 280, 16);
    bctx.stroke();

    bctx.fillStyle = '#0F172A';
    bctx.font = 'bold 32px sans-serif';
    bctx.fillText('♻️ 100% RECYCLABLE PAPERBOARD (PAP 21)', 120, 1680);
    bctx.font = '24px sans-serif';
    bctx.fillStyle = '#64748B';
    bctx.fillText('FSC Certified Mixed Sources Packaging. Please dispose safely.', 120, 1730);
    bctx.fillText('Keep unused medicine return programs active.', 120, 1770);
  }

  // F. BOTTOM FACE (Width x Depth)
  const btmCanvas = document.createElement('canvas');
  btmCanvas.width = 1024;
  btmCanvas.height = 1024;
  const bmctx = btmCanvas.getContext('2d');
  if (bmctx) {
    bmctx.fillStyle = '#FAFBFD';
    bmctx.fillRect(0, 0, 1024, 1024);
    bmctx.fillStyle = '#94A3B8';
    bmctx.font = 'bold 36px monospace';
    bmctx.textAlign = 'center';
    bmctx.fillText('NOVACURE PHARMA • CARTON CODE #94821', 512, 512);
  }

  // Textures
  const frontTex = new THREE.CanvasTexture(frontCanvas);
  frontTex.anisotropy = 8;
  const rightTex = new THREE.CanvasTexture(rightCanvas);
  rightTex.anisotropy = 8;
  const leftTex = new THREE.CanvasTexture(leftCanvas);
  leftTex.anisotropy = 8;
  const topTex = new THREE.CanvasTexture(topCanvas);
  topTex.anisotropy = 8;
  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.anisotropy = 8;
  const btmTex = new THREE.CanvasTexture(btmCanvas);

  // High-Grade Solid Bleached Sulfate (SBS) Paperboard Material with Satin Finish
  const createCartonFaceMaterial = (map: THREE.CanvasTexture) => {
    return new THREE.MeshPhysicalMaterial({
      map,
      roughness: 0.26,       // Smooth satin coated cardstock
      metalness: 0.03,
      clearcoat: 0.42,       // Protective aqueous lacquer sheen
      clearcoatRoughness: 0.12,
      specularColor: new THREE.Color(0xffffff),
      specularIntensity: 1.0,
    });
  };

  // Box materials order in Three.js: [+X (right), -X (left), +Y (top), -Y (bottom), +Z (front), -Z (back)]
  const boxMaterials = [
    createCartonFaceMaterial(rightTex),
    createCartonFaceMaterial(leftTex),
    createCartonFaceMaterial(topTex),
    createCartonFaceMaterial(btmTex),
    createCartonFaceMaterial(frontTex),
    createCartonFaceMaterial(backTex),
  ];

  // ---------------------------------------------------------------------------
  // 2. Geometry: Clean Beveled Paperboard Box
  // ---------------------------------------------------------------------------
  const boxGeo = new THREE.BoxGeometry(width, height, depth, 4, 8, 4);
  const boxMesh = new THREE.Mesh(boxGeo, boxMaterials);
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  boxGroup.add(boxMesh);

  // Subtle physical corner fold crease highlight edges for authentic paperboard depth
  const foldLineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  });
  const foldW = 0.008;
  // Top front edge crease
  const topEdge = new THREE.Mesh(new THREE.BoxGeometry(width * 1.002, foldW, foldW), foldLineMat);
  topEdge.position.set(0, height / 2, depth / 2);
  boxGroup.add(topEdge);

  // Side front edges crease
  const leftEdge = new THREE.Mesh(new THREE.BoxGeometry(foldW, height * 1.002, foldW), foldLineMat);
  leftEdge.position.set(-width / 2, 0, depth / 2);
  boxGroup.add(leftEdge);

  const rightEdge = new THREE.Mesh(new THREE.BoxGeometry(foldW, height * 1.002, foldW), foldLineMat);
  rightEdge.position.set(width / 2, 0, depth / 2);
  boxGroup.add(rightEdge);

  // ---------------------------------------------------------------------------
  // 3. Ground Ambient Occlusion Contact Shadow under the carton box
  // ---------------------------------------------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sctx = shadowCanvas.getContext('2d');
  if (sctx) {
    const grad = sctx.createRadialGradient(128, 128, 20, 128, 128, 110);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
  });
  const shadowGeo = new THREE.PlaneGeometry(width * 1.55, depth * 1.65);
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.rotation.z = -rotY; // Match box rotation angle
  contactShadow.position.set(posX, GROUND_Y + 0.003, posZ);

  return { boxGroup, contactShadow };
};
