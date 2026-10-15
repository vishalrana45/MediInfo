import * as THREE from 'three';

/**
 * Creates high-resolution, photorealistic canvas textures for pharmaceutical containers.
 * Eliminates flat "sticker-like" appearance with realistic paperboard/satin substrates,
 * fine vector typography, foil accents, and official regulatory markings.
 */

// 1. Amber Pharmacy Prescription Bottle Full-Wrap Label
export const createAmberBottleLabelTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Ultra-clean satin coated pharmaceutical label paper
    ctx.fillStyle = '#FAFBFD';
    ctx.fillRect(0, 0, 2048, 1024);

    // Subtle edge cut border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 2024, 1000);

    // === FRONT FACE (X: 0 to 1220) ===
    // Deep clinical navy header banner
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(16, 16, 1210, 140);

    // Gold foil metallic ℞ symbol & dispensary title
    ctx.fillStyle = '#F59E0B';
    ctx.font = '900 52px serif';
    ctx.fillText('℞', 50, 95);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('METRO CLINICAL PHARMACY', 120, 80);

    ctx.fillStyle = '#93C5FD';
    ctx.font = '600 22px monospace';
    ctx.fillText('STORE #4892  •  DISPENSARY DIVISION  •  100 MEDICAL PLAZA', 120, 125);

    // Prescription ID & Prescriber Strip
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(16, 156, 1210, 12);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 30px monospace';
    ctx.fillText('Rx # 7492041-09', 50, 225);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('DATE: 19-SEP-2026', 420, 225);
    ctx.fillText('DR. EMILY VANCE, M.D.', 800, 225);

    // Divider
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(1180, 250);
    ctx.stroke();

    // Prominent Medication Name
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('AMOXICILLIN 500mg', 50, 345);

    ctx.font = 'bold 34px sans-serif';
    ctx.fillStyle = '#2563EB';
    ctx.fillText('TABLETS USP • CLAVULANATE POTASSIUM', 50, 398);

    // Clear Patient Instructions
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('TAKE 1 TABLET BY MOUTH TWICE DAILY', 50, 470);
    ctx.fillText('WITH MEALS OR WATER UNTIL ALL FINISHED.', 50, 515);

    // Quantity Badge
    ctx.fillStyle = '#EFF6FF';
    ctx.strokeStyle = '#BFDBFE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(50, 555, 480, 68, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('QTY: 30 TABLETS  •  REFILLS: 2', 75, 598);

    // Warning Sticker 1 (Caution)
    ctx.fillStyle = '#FEF08A';
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(50, 650, 540, 95, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#854D0E';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('⚠️ CAUTION: FINISH ALL MEDICATION', 70, 692);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('UNLESS OTHERWISE DIRECTED BY PHYSICIAN.', 70, 724);

    // Warning Sticker 2 (With Food)
    ctx.fillStyle = '#FEE2E2';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(620, 650, 540, 95, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#991B1B';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('⚠️ TAKE WITH FOOD OR WATER', 640, 692);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('MAY CAUSE MILD GASTROINTESTINAL UPSET.', 640, 724);

    // Crisp Linear GS1-128 Barcode
    ctx.fillStyle = '#0F172A';
    const barStartX = 50;
    const barY = 770;
    const barH = 135;
    for (let bx = 0; bx < 680; bx += 8) {
      const w = (bx % 24 === 0 || bx % 16 === 0) ? 6 : (bx % 8 === 0 ? 3 : 2);
      ctx.fillRect(barStartX + bx, barY, w, barH);
    }
    ctx.font = 'bold 25px monospace';
    ctx.fillText('(01) 00368462 10460 7', 50, 945);

    // 2D Matrix Code
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(800, 770, 140, 140);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(815, 785, 36, 36);
    ctx.fillRect(885, 785, 36, 36);
    ctx.fillRect(815, 855, 36, 36);
    ctx.fillRect(860, 830, 22, 22);

    ctx.font = 'bold 22px monospace';
    ctx.fillText('LOT #B4092-X', 960, 820);
    ctx.fillText('EXP: 11/2028', 960, 860);
    ctx.fillText('NDC 0093-2264-34', 960, 900);

    // === REVERSE SIDE (Drug Facts & Security, X: 1250 to 2040) ===
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(1250, 16, 780, 990);

    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(1250, 16, 780, 75);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('DRUG FACTS & VERIFICATION', 1280, 68);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ACTIVE INGREDIENT (IN EACH TABLET):', 1280, 140);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Amoxicillin USP 500mg, Clavulanate 125mg ........... Antibacterial', 1280, 180);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('INDICATIONS & PHARMACOKINETICS:', 1280, 240);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('For treatment of confirmed bacterial infections.', 1280, 280);
    ctx.fillText('Peak plasma concentration achieved in 1.5 - 2.0 hrs.', 1280, 315);
    ctx.fillText('Renal elimination: approx 60% unchanged.', 1280, 350);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('STORAGE & DISPENSING:', 1280, 415);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Store at 20° to 25°C (68° to 77°F). Excursions permitted.', 1280, 455);
    ctx.fillText('Dispense in light-resistant container with child-safety cap.', 1280, 490);

    // Holographic Foil Line
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(1280, 540);
    ctx.lineTo(1980, 540);
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('TAMPER RESISTANT: DO NOT USE IF SAFETY SEAL IS TORN', 1280, 590);

    ctx.fillStyle = '#64748B';
    ctx.font = '20px sans-serif';
    ctx.fillText('KEEP THIS AND ALL DRUGS OUT OF REACH OF CHILDREN.', 1280, 630);
    ctx.fillText('IN CASE OF ACCIDENTAL OVERDOSE, GET EMERGENCY MEDICAL HELP.', 1280, 665);

    // Verification Seal Emblem
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(1640, 800, 85, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLINICALLY', 1640, 790);
    ctx.fillText('VERIFIED', 1640, 825);
    ctx.textAlign = 'left';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

// 2. White HDPE Bottle Clinical Supplement / Prescription Label
export const createHdpeBottleLabelTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Pure clinical white satin base
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1536, 768);

    // Subtle brushed satin sheen background
    const grad = ctx.createLinearGradient(0, 0, 1536, 0);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#F8FAFC');
    grad.addColorStop(0.7, '#F1F5F9');
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1536, 768);

    // === FRONT PANEL (X: 200 to 950) ===
    // Deep royal blue & cyan medical color block
    ctx.fillStyle = '#1E40AF';
    ctx.fillRect(200, 30, 750, 110);

    ctx.fillStyle = '#06B6D4';
    ctx.fillRect(200, 140, 750, 14);

    // Brand Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NEURO-CALM® CLINICAL RX', 240, 95);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('MAGNESIUM GLYCINATE', 240, 220);
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#2563EB';
    ctx.fillText('+ L-THEANINE 600mg COMPLEX', 240, 270);

    ctx.fillStyle = '#475569';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('Formulated with High-Absorption TRAACS® Minerals', 240, 320);
    ctx.fillText('Supports Healthy Cognitive Function & Neurological Balance*', 240, 355);

    // USP Verified & Quality Badges
    const badges = [
      { text: '✓ USP VERIFIED', bg: '#EFF6FF', border: '#3B82F6', color: '#1D4ED8', x: 240 },
      { text: '✓ GMP CERTIFIED', bg: '#F0FDF4', border: '#22C55E', color: '#15803D', x: 480 },
      { text: '✓ VEGETARIAN', bg: '#FAF5FF', border: '#A855F7', color: '#7E22CE', x: 710 },
    ];

    badges.forEach(b => {
      ctx.fillStyle = b.bg;
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(b.x, 395, 205, 52, 26);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = b.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(b.text, b.x + 18, 428);
    });

    // Quantity Statement
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('60 DELAYED-RELEASE VEGETARIAN CAPSULES', 240, 500);

    ctx.fillStyle = '#64748B';
    ctx.font = '22px sans-serif';
    ctx.fillText('DIETARY SUPPLEMENT  •  PHYSICIAN STRENGTH FORMULA', 240, 535);

    // Micro barcode
    ctx.fillStyle = '#0F172A';
    for (let bx = 0; bx < 420; bx += 6) {
      const w = (bx % 18 === 0) ? 4.5 : (bx % 6 === 0 ? 2.5 : 1.5);
      ctx.fillRect(240 + bx, 580, w, 80);
    }
    ctx.font = 'bold 20px monospace';
    ctx.fillText('NDC 71842-089-60', 240, 690);

    // QR DataMatrix
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(720, 580, 80, 80);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(730, 590, 20, 20);
    ctx.fillRect(770, 590, 20, 20);
    ctx.fillRect(730, 630, 20, 20);
    ctx.fillRect(755, 615, 14, 14);

    // === RIGHT PANEL: SUPPLEMENT FACTS (X: 1000 to 1480) ===
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(1000, 30, 480, 42);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SUPPLEMENT FACTS', 1015, 62);

    ctx.fillStyle = '#0F172A';
    ctx.font = '20px sans-serif';
    ctx.fillText('Serving Size: 2 Capsules  •  Servings: 30', 1015, 100);

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(1000, 115);
    ctx.lineTo(1480, 115);
    ctx.stroke();

    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Amount Per Serving', 1015, 145);
    ctx.fillText('% Daily Value', 1350, 145);

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(1000, 160);
    ctx.lineTo(1480, 160);
    ctx.stroke();

    ctx.font = '20px sans-serif';
    ctx.fillText('Magnesium (as bisglycinate chelate) 400 mg', 1015, 195);
    ctx.fillText('95%', 1420, 195);

    ctx.beginPath();
    ctx.moveTo(1000, 215);
    ctx.lineTo(1480, 215);
    ctx.stroke();

    ctx.fillText('L-Theanine (pure pharmaceutical grade) 200 mg', 1015, 250);
    ctx.fillText('†', 1420, 250);

    ctx.beginPath();
    ctx.moveTo(1000, 270);
    ctx.lineTo(1480, 270);
    ctx.stroke();

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('† Daily Value not established.', 1015, 300);
    ctx.fillText('Other Ingredients: Hypromellose (capsule), Organic Rice Flour.', 1015, 330);
    ctx.fillText('Suggested Use: Take 2 capsules before sleep or with meal.', 1015, 360);

    // Bottom seal
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(1000, 420, 480, 250);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('SAFETY SEALED FOR YOUR PROTECTION', 1020, 460);
    ctx.fillStyle = '#475569';
    ctx.font = '16px sans-serif';
    ctx.fillText('Do not use if safety seal around neck is broken or missing.', 1020, 490);
    ctx.fillText('Store at room temperature 15°-30°C (59°-86°F).', 1020, 520);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

// 3. Amber Glass Dropper Vial Minimalist Apothecary Label
export const createDropperVialLabelTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Pure matte off-white apothecary paper
    ctx.fillStyle = '#FDFDFE';
    ctx.fillRect(0, 0, 1024, 512);

    // Fine framing line
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 992, 480);

    // Minimalist clinical apothecary branding
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('CLINICAL LABORATORIES • 30 ML (1 FL OZ)', 60, 65);

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 85);
    ctx.lineTo(964, 85);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('VITAMIN D3 + K2', 60, 160);

    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('HIGH POTENCY LIQUID DROPS • 5,000 IU / 100 MCG', 60, 205);

    ctx.fillStyle = '#475569';
    ctx.font = '22px sans-serif';
    ctx.fillText('In Pure Organic Extra Virgin Olive Oil Carrier Base', 60, 255);
    ctx.fillText('Supports Bone Density, Immune Health & Cardiovascular Flow*', 60, 290);

    // Graduated dropper indicator icon
    ctx.fillStyle = '#EFF6FF';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 335, 420, 56, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('CALIBRATED 1.0 ML PIPETTE INCLUDED', 78, 370);

    // Barcode & Batch
    ctx.fillStyle = '#0F172A';
    for (let bx = 0; bx < 360; bx += 6) {
      const w = (bx % 18 === 0) ? 4 : (bx % 6 === 0 ? 2 : 1.5);
      ctx.fillRect(540 + bx, 335, w, 60);
    }
    ctx.font = 'bold 18px monospace';
    ctx.fillText('LOT #L7492  •  EXP 09/2028', 540, 425);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};
