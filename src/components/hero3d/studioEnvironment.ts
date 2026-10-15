import * as THREE from 'three';

/**
 * Creates a procedural high-dynamic-range studio photography environment map.
 * This simulates a professional commercial studio with large overhead and side softboxes,
 * providing realistic specular reflections on glass, plastic bottles, blister foils, and paper carton surfaces.
 */
export const createStudioEnvironment = (renderer: THREE.WebGLRenderer): THREE.Texture | null => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Studio cyclorama neutral gradient background - soft photographic grey tones
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#cbd5e1');
  bgGrad.addColorStop(0.4, '#94a3b8');
  bgGrad.addColorStop(0.7, '#64748b');
  bgGrad.addColorStop(1, '#475569');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Main Studio Softbox - softly diffused, gentle fill, not harsh white
  const mainSoftbox = ctx.createRadialGradient(280, 160, 20, 280, 160, 180);
  mainSoftbox.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  mainSoftbox.addColorStop(0.4, 'rgba(241, 245, 249, 0.3)');
  mainSoftbox.addColorStop(0.8, 'rgba(226, 232, 240, 0.1)');
  mainSoftbox.addColorStop(1, 'rgba(226, 232, 240, 0)');
  ctx.fillStyle = mainSoftbox;
  ctx.fillRect(100, 20, 360, 280);

  // 3. Tall Vertical Strip Softbox - gentle edge glint
  const stripGrad = ctx.createLinearGradient(740, 0, 860, 0);
  stripGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  stripGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
  stripGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
  stripGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(740, 60, 120, 340);

  // 4. Overhead Ceiling Softbox - subtle cap highlight
  const overheadGrad = ctx.createRadialGradient(512, 50, 10, 512, 50, 130);
  overheadGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  overheadGrad.addColorStop(0.5, 'rgba(248, 250, 252, 0.2)');
  overheadGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
  ctx.fillStyle = overheadGrad;
  ctx.fillRect(360, 0, 304, 150);

  // 5. Subtle Warm Amber/Golden Kicker for rich glass refraction
  const warmKicker = ctx.createRadialGradient(930, 210, 10, 930, 210, 100);
  warmKicker.addColorStop(0, 'rgba(254, 215, 170, 0.35)');
  warmKicker.addColorStop(0.6, 'rgba(251, 191, 36, 0.15)');
  warmKicker.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = warmKicker;
  ctx.fillRect(830, 110, 194, 200);

  // 6. Balanced Studio Floor Horizon - softly grounded
  const floorGrad = ctx.createLinearGradient(0, 340, 0, 512);
  floorGrad.addColorStop(0, 'rgba(148, 163, 184, 0.2)');
  floorGrad.addColorStop(0.5, 'rgba(100, 116, 139, 0.3)');
  floorGrad.addColorStop(1, 'rgba(71, 85, 105, 0.4)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 340, 1024, 172);

  const envTexture = new THREE.CanvasTexture(canvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envRenderTarget = pmremGenerator.fromEquirectangular(envTexture);

  pmremGenerator.dispose();
  envTexture.dispose();

  return envRenderTarget.texture;
};
