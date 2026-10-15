import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createStudioEnvironment } from './hero3d/studioEnvironment';
import { createMedicineBox } from './hero3d/boxStructure';
import {
  createAmberBottleLabelTexture,
  createHdpeBottleLabelTexture,
  createDropperVialLabelTexture,
} from './hero3d/bottleLabels';

export const Hero3DMedicineCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup - Studio Product Photography Perspective
    const width = container.clientWidth || 580;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    camera.position.set(0, 0.78, 6.6);

    // 3. Renderer with Alpha for seamless transparent background blending
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95; // Balanced exposure to prevent washed-out white glare
    container.appendChild(renderer.domElement);

    // 4. Subtle Studio Environment Map with Soft Photographic Reflections
    const studioEnv = createStudioEnvironment(renderer);
    if (studioEnv) {
      scene.environment = studioEnv;
      // Soft reflection intensity so materials have delicate specular glints without white blowout
      (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.4;
    }

    // 5. Professional Balanced Studio Lighting (Natural, warm key + soft cool fill, no harsh white wash)
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.45);
    scene.add(ambientLight);

    // Warm-white Key Softbox - soft shadows, authentic color rendition
    const keySoftbox = new THREE.DirectionalLight(0xfffbeb, 1.25);
    keySoftbox.position.set(5.0, 7.5, 5.5);
    keySoftbox.castShadow = true;
    keySoftbox.shadow.mapSize.width = 2048;
    keySoftbox.shadow.mapSize.height = 2048;
    keySoftbox.shadow.camera.near = 1;
    keySoftbox.shadow.camera.far = 25;
    keySoftbox.shadow.camera.left = -7;
    keySoftbox.shadow.camera.right = 7;
    keySoftbox.shadow.camera.top = 7;
    keySoftbox.shadow.camera.bottom = -7;
    keySoftbox.shadow.bias = -0.0006;
    keySoftbox.shadow.radius = 3.5;
    scene.add(keySoftbox);

    // Gentle Cool Fill Light - balances contrast on shadowed sides without glare
    const fillSoftbox = new THREE.DirectionalLight(0xdbeafe, 0.42);
    fillSoftbox.position.set(-5.5, 1.5, 4.0);
    scene.add(fillSoftbox);

    // Delicate Warm Rim / Contour Light - gently reveals amber glass and capsule curves
    const rimKicker = new THREE.DirectionalLight(0xfef3c7, 0.55);
    rimKicker.position.set(0.5, 5.5, -4.5);
    scene.add(rimKicker);

    // =========================================================================
    // OPEN STUDIO TABLETOP PRESENTATION (GROUND_Y = -1.35)
    // All items physically rest naturally and openly without being enclosed in any box
    // =========================================================================
    const GROUND_Y = -1.35;

    // Master Turntable Group holds all elements together
    const masterGroup = new THREE.Group();
    masterGroup.position.set(0, 0, 0);
    scene.add(masterGroup);

    // Ground Shadow Receiver Plane - purely transparent shadow receiver on canvas
    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = GROUND_Y;
    shadowPlane.receiveShadow = true;
    masterGroup.add(shadowPlane);

    // Helper: Contact Occlusion Spot directly under objects for realistic grounding
    const createContactShadow = (x: number, z: number, rx: number, rz: number, opacity = 0.26) => {
      const geo = new THREE.PlaneGeometry(rx * 2, rz * 2);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
        grad.addColorStop(0, `rgba(15, 23, 42, ${opacity})`);
        grad.addColorStop(0.5, `rgba(15, 23, 42, ${opacity * 0.45})`);
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, GROUND_Y + 0.003, z);
      masterGroup.add(mesh);
    };

    // Ambient occlusion contact shadows grounded beneath each medicine asset (clean, well-spaced, non-colliding layout)
    createContactShadow(-1.75, -0.15, 0.70, 0.45, 0.28); // Carton Box
    createContactShadow(-0.80, 0.12, 0.52, 0.52, 0.28);  // White HDPE bottle
    createContactShadow(0.35, 0.12, 0.60, 0.60, 0.32);   // Amber bottle
    createContactShadow(-0.18, -0.72, 0.38, 0.38, 0.26); // Glass dropper vial
    createContactShadow(1.50, 0.12, 0.55, 0.85, 0.28);   // Blister pack base
    createContactShadow(-0.55, 0.88, 0.22, 0.22, 0.18);  // Amber softgel
    createContactShadow(-0.10, 0.92, 0.30, 0.18, 0.18);  // Front capsule
    createContactShadow(0.35, 0.92, 0.22, 0.22, 0.18);   // Front round tablet
    createContactShadow(0.80, 0.88, 0.30, 0.18, 0.18);   // Oblong caplet

    // =========================================================================
    // 0. PHARMACEUTICAL CARTON MEDICINE BOX (Freestanding packaging product)
    // Stands upright on the left with clean air space
    // =========================================================================
    const { boxGroup, contactShadow: boxShadow } = createMedicineBox(
      GROUND_Y,
      -1.75, // posX (spacious positioning with zero collision)
      -0.15, // posZ
      0.25,  // rotY
      0.60,  // width
      1.65,  // height
      0.38   // depth
    );
    masterGroup.add(boxGroup);
    masterGroup.add(boxShadow);

    // =========================================================================
    // 1. AMBER PHARMACY BOTTLE WITH VISIBLE TABLETS & REALISTIC PRESCRIPTION COVER
    // Landed firmly on GROUND_Y, spacious center-right presentation
    // =========================================================================
    const amberBottleGroup = new THREE.Group();
    amberBottleGroup.position.set(0.35, GROUND_Y + 0.648, 0.12);
    amberBottleGroup.rotation.set(0, 0.15, 0);
    amberBottleGroup.scale.set(0.72, 0.72, 0.72);
    masterGroup.add(amberBottleGroup);

    // Highly Translucent Amber Glass Material with Studio Reflections
    const amberGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9a3412,
      emissive: 0x431407,
      emissiveIntensity: 0.04,
      roughness: 0.03,
      metalness: 0.02,
      transmission: 0.92,
      transparent: true,
      opacity: 0.94,
      ior: 1.52,
      thickness: 1.1,
      attenuationColor: new THREE.Color(0x92400e),
      attenuationDistance: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      specularColor: new THREE.Color(0xffffff),
      specularIntensity: 1.0,
    });

    const bottleRadius = 0.76;
    const bottleBodyHeight = 1.70;

    // Cylindrical Glass Body
    const bottleBodyGeo = new THREE.CylinderGeometry(bottleRadius, bottleRadius, bottleBodyHeight, 64);
    const bottleBodyMesh = new THREE.Mesh(bottleBodyGeo, amberGlassMat);
    bottleBodyMesh.position.y = 0;
    bottleBodyMesh.castShadow = true;
    amberBottleGroup.add(bottleBodyMesh);

    // Rounded Glass Base
    const bottleBaseGeo = new THREE.CylinderGeometry(bottleRadius, bottleRadius * 0.92, 0.10, 64);
    const bottleBaseMesh = new THREE.Mesh(bottleBaseGeo, amberGlassMat);
    bottleBaseMesh.position.y = -bottleBodyHeight / 2 - 0.05;
    bottleBaseMesh.castShadow = true;
    amberBottleGroup.add(bottleBaseMesh);

    // Bottle Curved Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(0.55, bottleRadius, 0.35, 64);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, amberGlassMat);
    shoulderMesh.position.y = bottleBodyHeight / 2 + 0.175;
    shoulderMesh.castShadow = true;
    amberBottleGroup.add(shoulderMesh);

    // Threaded Neck
    const neckGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.28, 64);
    const neckMesh = new THREE.Mesh(neckGeo, amberGlassMat);
    neckMesh.position.y = bottleBodyHeight / 2 + 0.35 + 0.14;
    amberBottleGroup.add(neckMesh);

    // Glass Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.56, 0.028, 16, 64);
    const collarMesh = new THREE.Mesh(collarGeo, amberGlassMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = bottleBodyHeight / 2 + 0.35 + 0.05;
    amberBottleGroup.add(collarMesh);

    // --- REALISTIC CHILD-RESISTANT CAP WITH TOP EMBOSSED COVER TEXTURE ---
    const capCanvas = document.createElement('canvas');
    capCanvas.width = 512;
    capCanvas.height = 512;
    const capCtx = capCanvas.getContext('2d');
    if (capCtx) {
      capCtx.fillStyle = '#FFFFFF';
      capCtx.fillRect(0, 0, 512, 512);

      // Concentric circles & safety directional arrows
      capCtx.strokeStyle = '#94A3B8';
      capCtx.lineWidth = 6;
      capCtx.beginPath();
      capCtx.arc(256, 256, 210, 0, Math.PI * 2);
      capCtx.stroke();

      capCtx.lineWidth = 3;
      capCtx.beginPath();
      capCtx.arc(256, 256, 175, 0, Math.PI * 2);
      capCtx.stroke();

      // Top Instruction: "PUSH DOWN & TURN • CLOSE TIGHTLY"
      capCtx.fillStyle = '#334155';
      capCtx.font = 'bold 24px sans-serif';
      capCtx.textAlign = 'center';
      capCtx.textBaseline = 'middle';
      capCtx.fillText('PUSH DOWN & TURN', 256, 120);
      capCtx.fillText('CLOSE TIGHTLY', 256, 390);

      // Curved rotation arrows
      capCtx.lineWidth = 8;
      capCtx.strokeStyle = '#2563EB';
      capCtx.beginPath();
      capCtx.arc(256, 256, 95, -0.8, 1.2);
      capCtx.stroke();
      // Arrowhead
      capCtx.fillStyle = '#2563EB';
      capCtx.beginPath();
      capCtx.moveTo(256 + Math.cos(1.2) * 95 - 15, 256 + Math.sin(1.2) * 95 - 10);
      capCtx.lineTo(256 + Math.cos(1.2) * 95 + 18, 256 + Math.sin(1.2) * 95 + 12);
      capCtx.lineTo(256 + Math.cos(1.2) * 95 - 2, 256 + Math.sin(1.2) * 95 - 20);
      capCtx.fill();

      // Center Child-Safety Emblem
      capCtx.fillStyle = '#1E293B';
      capCtx.font = 'bold 28px sans-serif';
      capCtx.fillText('Rx LOCK', 256, 256);
    }

    const capTopTex = new THREE.CanvasTexture(capCanvas);
    const capBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.05,
    });
    const capTopMat = new THREE.MeshStandardMaterial({
      map: capTopTex,
      roughness: 0.32,
      metalness: 0.05,
    });

    const capGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.44, 64);
    // Multi-material for cap: side, top, bottom
    const capMaterials = [capBodyMat, capTopMat, capBodyMat];
    const capMesh = new THREE.Mesh(capGeo, capMaterials);
    capMesh.position.y = bottleBodyHeight / 2 + 0.35 + 0.28 + 0.20;
    capMesh.castShadow = true;
    amberBottleGroup.add(capMesh);

    // Cap Knurl Grips around circumference
    const knurlCount = 36;
    const knurlGeo = new THREE.BoxGeometry(0.02, 0.38, 0.024);
    const knurlMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 });
    for (let i = 0; i < knurlCount; i++) {
      const angle = (i / knurlCount) * Math.PI * 2;
      const knurl = new THREE.Mesh(knurlGeo, knurlMat);
      knurl.position.set(Math.cos(angle) * 0.625, bottleBodyHeight / 2 + 0.35 + 0.28 + 0.20, Math.sin(angle) * 0.625);
      knurl.rotation.y = -angle;
      amberBottleGroup.add(knurl);
    }

    // --- PROTECTIVE SAFETY COVER OVER CAP (Clear Shrink Band with Red Pull-Tab) ---
    const capCoverGeo = new THREE.CylinderGeometry(0.635, 0.635, 0.52, 64);
    const capCoverMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.12,
      metalness: 0.02,
      transmission: 0.8,
      transparent: true,
      opacity: 0.72,
      ior: 1.46,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const capCoverMesh = new THREE.Mesh(capCoverGeo, capCoverMat);
    capCoverMesh.position.y = bottleBodyHeight / 2 + 0.35 + 0.28 + 0.18;
    amberBottleGroup.add(capCoverMesh);

    // Red Tamper-Evident Pull-Tab Band on Cap Cover
    const tearStripGeo = new THREE.TorusGeometry(0.642, 0.015, 16, 64);
    const tearStripMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25 });
    const tearStrip = new THREE.Mesh(tearStripGeo, tearStripMat);
    tearStrip.rotation.x = Math.PI / 2;
    tearStrip.position.y = bottleBodyHeight / 2 + 0.35 + 0.28 + 0.05;
    amberBottleGroup.add(tearStrip);

    // --- ULTRA-REALISTIC PRESCRIPTION PHARMACY COVER SLEEVE (Satin Paperboard Finish) ---
    const amberLabelTex = createAmberBottleLabelTexture();
    const coverSleeveGeo = new THREE.CylinderGeometry(bottleRadius * 1.008, bottleRadius * 1.008, 1.0, 64);
    const coverSleeveMat = new THREE.MeshPhysicalMaterial({
      map: amberLabelTex,
      roughness: 0.25,
      metalness: 0.03,
      clearcoat: 0.42,
      clearcoatRoughness: 0.12,
      specularColor: new THREE.Color(0xffffff),
    });
    const coverSleeveMesh = new THREE.Mesh(coverSleeveGeo, coverSleeveMat);
    coverSleeveMesh.position.y = 0.14; // Raised so lower portion of bottle stays transparent for visible tablets!
    coverSleeveMesh.rotation.y = -Math.PI / 2 + 0.28;
    coverSleeveMesh.castShadow = true;
    amberBottleGroup.add(coverSleeveMesh);

    // --- VISIBLE WHITE SCORED TABLETS STACKED INSIDE THE AMBER BOTTLE ---
    const innerTabletMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.02,
    });
    const innerScoreMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.5,
    });

    const createInnerTablet = (radius = 0.20, thickness = 0.09) => {
      const group = new THREE.Group();
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 32), innerTabletMat);
      group.add(cyl);

      const score = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.01, radius * 1.85), innerScoreMat);
      score.position.y = thickness / 2 + 0.002;
      group.add(score);
      return group;
    };

    // 16 realistic scored white tablets settled inside the amber bottle
    const tabletPositions = [
      { x: 0, y: -0.74, z: 0, rx: 0.08, ry: 0.3, rz: 0.05 },
      { x: 0.28, y: -0.73, z: 0.16, rx: -0.12, ry: 0.8, rz: 0.14 },
      { x: -0.26, y: -0.73, z: 0.19, rx: 0.15, ry: 1.4, rz: -0.08 },
      { x: 0.18, y: -0.74, z: -0.28, rx: 0.18, ry: 2.1, rz: 0.1 },
      { x: -0.24, y: -0.74, z: -0.24, rx: -0.1, ry: 2.8, rz: -0.12 },
      { x: 0, y: -0.72, z: 0.32, rx: 0.22, ry: 0.5, rz: 0.02 },
      // Layer 2
      { x: 0.14, y: -0.60, z: 0.06, rx: 0.28, ry: 1.1, rz: -0.15 },
      { x: -0.16, y: -0.61, z: 0.10, rx: -0.24, ry: 2.3, rz: 0.2 },
      { x: 0.24, y: -0.59, z: -0.14, rx: 0.18, ry: 0.7, rz: -0.25 },
      { x: -0.20, y: -0.60, z: -0.12, rx: -0.32, ry: 1.7, rz: 0.18 },
      { x: 0.03, y: -0.58, z: -0.25, rx: 0.15, ry: 2.9, rz: 0.12 },
      // Layer 3
      { x: -0.04, y: -0.46, z: 0.14, rx: 0.35, ry: 0.4, rz: -0.22 },
      { x: 0.16, y: -0.45, z: -0.04, rx: -0.28, ry: 1.6, rz: 0.3 },
      { x: -0.18, y: -0.44, z: -0.03, rx: 0.42, ry: 2.5, rz: -0.18 },
      { x: 0.08, y: -0.34, z: 0.09, rx: -0.38, ry: 0.9, rz: 0.25 },
      { x: -0.06, y: -0.32, z: -0.11, rx: 0.26, ry: 3.1, rz: -0.32 },
    ];

    tabletPositions.forEach((pos) => {
      const tab = createInnerTablet(0.20, 0.09);
      tab.position.set(pos.x, pos.y, pos.z);
      tab.rotation.set(pos.rx, pos.ry, pos.rz);
      amberBottleGroup.add(tab);
    });

    // =========================================================================
    // 2. SECOND MEDICINE BOTTLE: CLINICAL WHITE HDPE BOTTLE WITH BLUE CAP & LABEL
    // Landed firmly on GROUND_Y (bottom of base touches GROUND_Y exactly)
    // =========================================================================
    const whiteBottleGroup = new THREE.Group();
    whiteBottleGroup.position.set(-0.80, GROUND_Y + 0.558, 0.12);
    whiteBottleGroup.rotation.set(0, -0.25, 0);
    whiteBottleGroup.scale.set(0.72, 0.72, 0.72);
    masterGroup.add(whiteBottleGroup);

    // Premium High-Density Polyethylene with subtle satin specular sheen
    const hdpeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcfcfd,
      roughness: 0.18,
      metalness: 0.01,
      clearcoat: 0.35,
      clearcoatRoughness: 0.08,
    });

    const wRadius = 0.64;
    const wHeight = 1.55;
    const wBodyGeo = new THREE.CylinderGeometry(wRadius, wRadius, wHeight, 48);
    const wBodyMesh = new THREE.Mesh(wBodyGeo, hdpeMat);
    wBodyMesh.castShadow = true;
    wBodyMesh.receiveShadow = true;
    whiteBottleGroup.add(wBodyMesh);

    const wBaseGeo = new THREE.CylinderGeometry(wRadius, wRadius * 0.94, 0.1, 48);
    const wBaseMesh = new THREE.Mesh(wBaseGeo, hdpeMat);
    wBaseMesh.position.y = -wHeight / 2 - 0.05;
    wBaseMesh.castShadow = true;
    whiteBottleGroup.add(wBaseMesh);

    const wShoulderGeo = new THREE.CylinderGeometry(0.46, wRadius, 0.30, 48);
    const wShoulderMesh = new THREE.Mesh(wShoulderGeo, hdpeMat);
    wShoulderMesh.position.y = wHeight / 2 + 0.15;
    wShoulderMesh.castShadow = true;
    whiteBottleGroup.add(wShoulderMesh);

    const wNeckGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.24, 48);
    const wNeckMesh = new THREE.Mesh(wNeckGeo, hdpeMat);
    wNeckMesh.position.y = wHeight / 2 + 0.30 + 0.12;
    whiteBottleGroup.add(wNeckMesh);

    // Clinical Supplement Label for White HDPE Bottle
    const hdpeLabelTex = createHdpeBottleLabelTexture();
    const hdpeLabelGeo = new THREE.CylinderGeometry(wRadius * 1.008, wRadius * 1.008, 1.0, 48);
    const hdpeLabelMat = new THREE.MeshPhysicalMaterial({
      map: hdpeLabelTex,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.42,
      clearcoatRoughness: 0.1,
    });
    const hdpeLabelMesh = new THREE.Mesh(hdpeLabelGeo, hdpeLabelMat);
    hdpeLabelMesh.position.y = 0.04;
    hdpeLabelMesh.rotation.y = -Math.PI / 2 + 0.3;
    hdpeLabelMesh.castShadow = true;
    whiteBottleGroup.add(hdpeLabelMesh);

    // Molded volumetric measurement graduation marks on HDPE side
    const gradGroup = new THREE.Group();
    const gradMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    [-0.30, -0.12, 0.06, 0.22].forEach((gy) => {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.014, 0.14), gradMat);
      tick.position.set(-wRadius * 0.99, gy, 0);
      gradGroup.add(tick);
    });
    whiteBottleGroup.add(gradGroup);

    // Cobalt Blue Safety Screw Cap
    const blueCapMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });
    const blueCapGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.38, 48);
    const blueCapMesh = new THREE.Mesh(blueCapGeo, blueCapMat);
    blueCapMesh.position.y = wHeight / 2 + 0.30 + 0.24 + 0.17;
    blueCapMesh.castShadow = true;
    whiteBottleGroup.add(blueCapMesh);

    // Cobalt Cap Knurls
    const blueKnurlGeo = new THREE.BoxGeometry(0.016, 0.34, 0.02);
    const blueKnurlMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.35 });
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const knurl = new THREE.Mesh(blueKnurlGeo, blueKnurlMat);
      knurl.position.set(Math.cos(angle) * 0.535, wHeight / 2 + 0.30 + 0.24 + 0.17, Math.sin(angle) * 0.535);
      knurl.rotation.y = -angle;
      whiteBottleGroup.add(knurl);
    }

    // =========================================================================
    // 3. THIRD CONTAINER: AMBER GLASS DROPPER VIAL WITH APOTHECARY LABEL & PIPETTE
    // Landed firmly on GROUND_Y (bottom of base touches GROUND_Y exactly)
    // =========================================================================
    const dropperGroup = new THREE.Group();
    dropperGroup.position.set(-0.18, GROUND_Y + 0.508, -0.72);
    dropperGroup.rotation.set(0, 0.35, 0);
    dropperGroup.scale.set(0.72, 0.72, 0.72);
    masterGroup.add(dropperGroup);

    const dropperVialRadius = 0.44;
    const dropperVialHeight = 1.25;
    const dropperBodyGeo = new THREE.CylinderGeometry(dropperVialRadius, dropperVialRadius, dropperVialHeight, 48);
    const dropperBodyMesh = new THREE.Mesh(dropperBodyGeo, amberGlassMat);
    dropperBodyMesh.castShadow = true;
    dropperGroup.add(dropperBodyMesh);

    const dropperBaseGeo = new THREE.CylinderGeometry(dropperVialRadius, dropperVialRadius * 0.92, 0.08, 48);
    const dropperBaseMesh = new THREE.Mesh(dropperBaseGeo, amberGlassMat);
    dropperBaseMesh.position.y = -dropperVialHeight / 2 - 0.04;
    dropperGroup.add(dropperBaseMesh);

    const dropperShoulderGeo = new THREE.CylinderGeometry(0.32, dropperVialRadius, 0.22, 48);
    const dropperShoulderMesh = new THREE.Mesh(dropperShoulderGeo, amberGlassMat);
    dropperShoulderMesh.position.y = dropperVialHeight / 2 + 0.11;
    dropperGroup.add(dropperShoulderMesh);

    // Apothecary Label on Dropper Vial
    const dropperLabelTex = createDropperVialLabelTexture();
    const dropperLabelGeo = new THREE.CylinderGeometry(dropperVialRadius * 1.008, dropperVialRadius * 1.008, 0.68, 48);
    const dropperLabelMat = new THREE.MeshPhysicalMaterial({
      map: dropperLabelTex,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.12,
    });
    const dropperLabelMesh = new THREE.Mesh(dropperLabelGeo, dropperLabelMat);
    dropperLabelMesh.position.y = 0.02;
    dropperLabelMesh.rotation.y = -Math.PI / 2 + 0.2;
    dropperGroup.add(dropperLabelMesh);

    // Clear glass internal calibrated pipette tube visible through amber glass
    const pipetteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.02,
      ior: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const pipetteGeo = new THREE.CylinderGeometry(0.06, 0.045, dropperVialHeight * 0.9, 16);
    const pipetteMesh = new THREE.Mesh(pipetteGeo, pipetteMat);
    pipetteMesh.position.y = 0;
    dropperGroup.add(pipetteMesh);

    // Pipette graduation measurement rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    [-0.26, -0.08, 0.08, 0.26].forEach((ry) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.008, 16), ringMat);
      ring.position.y = ry;
      dropperGroup.add(ring);
    });

    const collarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const dCollarGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 48);
    const dCollarMesh = new THREE.Mesh(dCollarGeo, collarMat);
    dCollarMesh.position.y = dropperVialHeight / 2 + 0.22 + 0.12;
    dCollarMesh.castShadow = true;
    dropperGroup.add(dCollarMesh);

    const bulbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const bulbGeo = new THREE.SphereGeometry(0.32, 32, 24);
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.scale.set(0.78, 1.25, 0.78);
    bulbMesh.position.y = dropperVialHeight / 2 + 0.22 + 0.24 + 0.23;
    bulbMesh.castShadow = true;
    dropperGroup.add(bulbMesh);

    // =========================================================================
    // 4. HIGH-FIDELITY CAPSULE BLISTER PACK (8-Capsule Foil Strip)
    // Angled on the right with comfortable, non-colliding air gap
    // =========================================================================
    const blisterGroup = new THREE.Group();
    blisterGroup.position.set(1.50, GROUND_Y + 0.08, 0.12);
    blisterGroup.rotation.set(-Math.PI / 2 + 0.18, 0.04, -0.20);
    blisterGroup.scale.set(0.72, 0.72, 0.72);
    masterGroup.add(blisterGroup);

    // High-Resolution Authentic Blister Foil Canvas
    const blisterFoilCanvas = document.createElement('canvas');
    blisterFoilCanvas.width = 1024;
    blisterFoilCanvas.height = 1536;
    const bfctx = blisterFoilCanvas.getContext('2d');
    if (bfctx) {
      // Base Brushed Aluminum Gradient
      const grad = bfctx.createLinearGradient(0, 0, 1024, 1536);
      grad.addColorStop(0, '#E2E8F0');
      grad.addColorStop(0.3, '#F1F5F9');
      grad.addColorStop(0.7, '#CBD5E1');
      grad.addColorStop(1, '#E2E8F0');
      bfctx.fillStyle = grad;
      bfctx.fillRect(0, 0, 1024, 1536);

      // Micro-embossed waffle grid on seal margins
      bfctx.fillStyle = '#94A3B8';
      for (let x = 0; x < 1024; x += 12) {
        for (let y = 0; y < 1536; y += 12) {
          const isBorder = (x < 64 || x > 960 || y < 70 || y > 1460);
          if (isBorder && (x + y) % 24 === 0) {
            bfctx.fillRect(x, y, 6, 6);
          }
        }
      }

      // Laser Perforation Grid lines between the 8 capsules (2 cols x 4 rows)
      bfctx.setLineDash([10, 8]);
      bfctx.strokeStyle = '#64748B';
      bfctx.lineWidth = 3.5;

      // Vertical center separation cut
      bfctx.beginPath();
      bfctx.moveTo(512, 70);
      bfctx.lineTo(512, 1460);
      bfctx.stroke();

      // Horizontal cuts between 4 rows
      [400, 730, 1060].forEach((yPos) => {
        bfctx.beginPath();
        bfctx.moveTo(64, yPos);
        bfctx.lineTo(960, yPos);
        bfctx.stroke();
      });

      // Branded Pharmaceutical Typography on Each Blister Cell
      bfctx.setLineDash([]);
      bfctx.font = 'bold 24px sans-serif';
      bfctx.fillStyle = '#475569';

      const cellRows = [220, 550, 880, 1210];
      cellRows.forEach((rowY) => {
        [150, 650].forEach((colX) => {
          bfctx.fillText('AMOXICILLIN 500mg', colX, rowY);
          bfctx.font = 'bold 18px monospace';
          bfctx.fillStyle = '#2563EB';
          bfctx.fillText('▼ PUSH TO DISPENSE ▼', colX + 10, rowY + 32);
          bfctx.fillStyle = '#475569';
          bfctx.font = 'bold 24px sans-serif';
        });
      });

      // Top Hang-Slot (Pharmacy display punch hole)
      bfctx.fillStyle = '#64748B';
      bfctx.beginPath();
      bfctx.roundRect(460, 24, 104, 28, 14);
      bfctx.fill();

      // Bottom Embossed Expiration / Batch Stamp
      bfctx.fillStyle = '#1E293B';
      bfctx.font = 'bold 26px monospace';
      bfctx.fillText('EXP 11/2028  •  LOT #9482A  •  NDC 68462-104  •  MEDINFO-RX', 100, 1500);
    }

    const blisterFoilTex = new THREE.CanvasTexture(blisterFoilCanvas);
    blisterFoilTex.anisotropy = 8;
    const blisterFoilMat = new THREE.MeshPhysicalMaterial({
      map: blisterFoilTex,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.45,
      clearcoatRoughness: 0.08,
      reflectivity: 0.8,
    });

    const blisterW = 1.30;
    const blisterH = 1.95;
    const blisterCornerR = 0.15;
    const blisterShape = new THREE.Shape();
    const bx = -blisterW / 2;
    const by = -blisterH / 2;
    blisterShape.moveTo(bx + blisterCornerR, by);
    blisterShape.lineTo(bx + blisterW - blisterCornerR, by);
    blisterShape.quadraticCurveTo(bx + blisterW, by, bx + blisterW, by + blisterCornerR);
    blisterShape.lineTo(bx + blisterW, by + blisterH - blisterCornerR);
    blisterShape.quadraticCurveTo(bx + blisterW, by + blisterH, bx + blisterW - blisterCornerR, by + blisterH);
    blisterShape.lineTo(bx + blisterCornerR, by + blisterH);
    blisterShape.quadraticCurveTo(bx, by + blisterH, bx, by + blisterH - blisterCornerR);
    blisterShape.lineTo(bx, by + blisterCornerR);
    blisterShape.quadraticCurveTo(bx, by, bx + blisterCornerR, by);

    const blisterFoilGeo = new THREE.ExtrudeGeometry(blisterShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    const blisterFoilMesh = new THREE.Mesh(blisterFoilGeo, blisterFoilMat);
    blisterFoilMesh.castShadow = true;
    blisterFoilMesh.receiveShadow = true;
    blisterGroup.add(blisterFoilMesh);

    // Thermoformed Transparent PVC Material for Blister Domes
    const blisterClearPvcMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.97,
      roughness: 0.02,
      metalness: 0.01,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.54,
      transparent: true,
      opacity: 0.92,
      thickness: 0.45,
      specularColor: new THREE.Color(0xffffff),
    });

    const blisterRimMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.9,
      roughness: 0.2,
    });

    // 8 Capsule Cavities (2 Columns x 4 Rows) with Elongated Capsule Domes
    const bCols = [-0.31, 0.31];
    const bRows = [-0.60, -0.20, 0.20, 0.60];

    // High-Gloss Vibrant Two-Tone Gelatin Capsules Inside Blister Pack
    // Striking Ruby Red + Pure Pearl White
    const blisterCapRedMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transmission: 0.12,
      thickness: 0.5,
      metalness: 0.02,
      specularColor: new THREE.Color(0xffffff),
    });
    const blisterCapWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      metalness: 0.02,
      specularColor: new THREE.Color(0xffffff),
    });

    for (let c = 0; c < bCols.length; c++) {
      for (let r = 0; r < bRows.length; r++) {
        const cx = bCols[c];
        const cy = bRows[r];

        // 1. Raised Elongated Flange Rim around each blister cavity
        const rimGeo = new THREE.TorusGeometry(0.15, 0.015, 16, 32);
        const rimMesh = new THREE.Mesh(rimGeo, blisterRimMat);
        rimMesh.position.set(cx, cy, 0.024);
        rimMesh.scale.set(0.85, 1.38, 1.0);
        blisterGroup.add(rimMesh);

        // 2. Realistic Elongated Capsule Thermoformed Blister Bubble
        const domeGroup = new THREE.Group();
        domeGroup.position.set(cx, cy, 0.028);

        const domeRadius = 0.12;
        const domeHeight = 0.18;

        // Center cylinder dome
        const domeMid = new THREE.Mesh(new THREE.CylinderGeometry(domeRadius, domeRadius, domeHeight, 24, 1, true, 0, Math.PI), blisterClearPvcMat);
        domeMid.rotation.z = Math.PI / 2;
        domeMid.rotation.x = Math.PI / 2;
        domeGroup.add(domeMid);

        // Top half-sphere dome
        const domeEnd1 = new THREE.Mesh(new THREE.SphereGeometry(domeRadius, 24, 16, 0, Math.PI, 0, Math.PI / 2), blisterClearPvcMat);
        domeEnd1.position.y = domeHeight / 2;
        domeEnd1.rotation.y = -Math.PI / 2;
        domeGroup.add(domeEnd1);

        // Bottom half-sphere dome
        const domeEnd2 = new THREE.Mesh(new THREE.SphereGeometry(domeRadius, 24, 16, 0, Math.PI, 0, Math.PI / 2), blisterClearPvcMat);
        domeEnd2.position.y = -domeHeight / 2;
        domeEnd2.rotation.y = Math.PI / 2;
        domeGroup.add(domeEnd2);

        blisterGroup.add(domeGroup);

        // 3. Sealed Glossy Capsule Inside Cavity
        const inCap = new THREE.Group();
        inCap.position.set(cx, cy, 0.07);
        inCap.scale.set(0.24, 0.24, 0.24);

        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.38, 24), blisterCapRedMat);
        capTop.position.y = 0.19;
        inCap.add(capTop);

        const capTopDome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), blisterCapRedMat);
        capTopDome.position.y = 0.38;
        inCap.add(capTopDome);

        const capBtm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.38, 24), blisterCapWhiteMat);
        capBtm.position.y = -0.19;
        inCap.add(capBtm);

        const capBtmDome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), blisterCapWhiteMat);
        capBtmDome.position.y = -0.38;
        inCap.add(capBtmDome);

        // Capsule Center Seam Ring
        const capSeam = new THREE.Mesh(
          new THREE.TorusGeometry(0.285, 0.012, 16, 32),
          new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.3 })
        );
        capSeam.rotation.x = Math.PI / 2;
        inCap.add(capSeam);

        blisterGroup.add(inCap);
      }
    }

    // =========================================================================
    // 5. EXTENSIVE FOREGROUND MEDICINES ON TABLETOP
    // All resting on GROUND_Y in front of the bottles and blister pack
    // =========================================================================

    const createTableGelCapsule = (color1: number, color2: number, scale = 1) => {
      const capsule = new THREE.Group();
      const r = 0.33 * scale;
      const h = 0.64 * scale;

      const mat1 = new THREE.MeshPhysicalMaterial({
        color: color1,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.12,
        thickness: 0.5,
        specularColor: new THREE.Color(0xffffff),
      });

      const mat2 = new THREE.MeshPhysicalMaterial({
        color: color2,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.12,
        thickness: 0.5,
        specularColor: new THREE.Color(0xffffff),
      });

      const c1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h / 2, 36), mat1);
      c1.position.y = h / 4;
      c1.castShadow = true;
      capsule.add(c1);

      const d1 = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), mat1);
      d1.position.y = h / 2;
      d1.castShadow = true;
      capsule.add(d1);

      const c2 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h / 2, 36), mat2);
      c2.position.y = -h / 4;
      c2.castShadow = true;
      capsule.add(c2);

      const d2 = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat2);
      d2.position.y = -h / 2;
      d2.castShadow = true;
      capsule.add(d2);

      const seamGeo = new THREE.TorusGeometry(r * 1.018, 0.015 * scale, 16, 36);
      const seamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const seam = new THREE.Mesh(seamGeo, seamMat);
      seam.rotation.x = Math.PI / 2;
      capsule.add(seam);

      return { capsule, radius: r };
    };

    const createTableTablet = (diameter = 0.72, thickness = 0.24) => {
      const tablet = new THREE.Group();
      const tabMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.04,
        clearcoat: 0.25,
      });

      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(diameter / 2, diameter / 2, thickness, 48), tabMat);
      cyl.castShadow = true;
      cyl.receiveShadow = true;
      tablet.add(cyl);

      const grooveGeo = new THREE.BoxGeometry(0.03, 0.02, diameter * 0.95);
      const grooveMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 });
      const groove = new THREE.Mesh(grooveGeo, grooveMat);
      groove.position.y = thickness / 2 + 0.002;
      tablet.add(groove);

      return { tablet, thickness, radius: diameter / 2 };
    };

    // Foreground 1: Crimson & Golden-Amber Capsule
    const { capsule: fgCap1, radius: fgCap1R } = createTableGelCapsule(0xdc2626, 0xf59e0b, 0.85);
    fgCap1.scale.set(0.85, 0.85, 0.85);
    fgCap1.position.set(-0.10, GROUND_Y + fgCap1R * 0.85, 0.92);
    fgCap1.rotation.set(0, 0.45, Math.PI / 2);
    masterGroup.add(fgCap1);

    // Foreground 2: Round Scored Clinical Tablet
    const { tablet: fgTab1, thickness: fgTab1Thick } = createTableTablet(0.50, 0.16);
    fgTab1.scale.set(0.85, 0.85, 0.85);
    fgTab1.position.set(0.35, GROUND_Y + (fgTab1Thick * 0.85) / 2, 0.92);
    fgTab1.rotation.set(0, 0.25, 0);
    masterGroup.add(fgTab1);

    // Foreground 3: Oblong Pharmaceutical Caplet
    const capletGroup = new THREE.Group();
    const capletMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.3,
    });
    const capletRadius = 0.20;
    const capletLen = 0.48;

    const capletMid = new THREE.Mesh(new THREE.CylinderGeometry(capletRadius, capletRadius, capletLen, 32), capletMat);
    capletMid.rotation.z = Math.PI / 2;
    capletMid.castShadow = true;
    capletGroup.add(capletMid);

    const capletEnd1 = new THREE.Mesh(new THREE.SphereGeometry(capletRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), capletMat);
    capletEnd1.rotation.z = -Math.PI / 2;
    capletEnd1.position.x = capletLen / 2;
    capletEnd1.castShadow = true;
    capletGroup.add(capletEnd1);

    const capletEnd2 = new THREE.Mesh(new THREE.SphereGeometry(capletRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), capletMat);
    capletEnd2.rotation.z = -Math.PI / 2;
    capletEnd2.position.x = -capletLen / 2;
    capletEnd2.castShadow = true;
    capletGroup.add(capletEnd2);

    const capletGroove = new THREE.Mesh(new THREE.BoxGeometry(0.022, capletRadius * 2.05, 0.015), innerScoreMat);
    capletGroove.position.y = 0;
    capletGroove.position.z = capletRadius - 0.005;
    capletGroup.add(capletGroove);

    capletGroup.scale.set(0.85, 0.85, 0.85);
    capletGroup.position.set(0.80, GROUND_Y + capletRadius * 0.85, 0.88);
    capletGroup.rotation.set(0, -0.45, 0);
    masterGroup.add(capletGroup);

    // Foreground 4: Translucent Amber Softgel Capsule
    const softgelMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.15,
      roughness: 0.04,
      metalness: 0.02,
      transmission: 0.88,
      transparent: true,
      opacity: 0.95,
      ior: 1.48,
      thickness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      specularColor: new THREE.Color(0xffffff),
    });
    const softgelGeo = new THREE.SphereGeometry(0.22, 32, 24);
    const softgelMesh = new THREE.Mesh(softgelGeo, softgelMat);
    softgelMesh.scale.set(1.10 * 0.85, 0.75 * 0.85, 0.75 * 0.85);
    softgelMesh.position.set(-0.55, GROUND_Y + 0.12, 0.88);
    softgelMesh.rotation.set(0, 0.65, 0.04);
    softgelMesh.castShadow = true;
    masterGroup.add(softgelMesh);

    // =========================================================================
    // STUDIO PRESENTATION WITH MEDIUM SPEED AUTO-ROTATION & CURSOR ROTATION
    // =========================================================================
    container.style.touchAction = 'none';

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let currentYAngle = 0;
    let currentXAngle = 0;
    let targetYAngle = 0;
    let targetXAngle = 0;
    let angularMomentum = 0;

    // Medium auto-rotation speed (~0.007 rad/frame, smooth medium pace)
    const baseRotationSpeed = 0.007;

    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let isHovering = false;

    const onPointerDown = (event: PointerEvent) => {
      isDown = true;
      startX = event.clientX;
      startY = event.clientY;
      angularMomentum = 0;
      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseParallaxX = x * 0.45;
      mouseParallaxY = y * 0.30;

      // When dragging, direct 3D manual rotation
      if (isDown) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        startX = event.clientX;
        startY = event.clientY;

        const sensitivity = 0.007;
        targetYAngle += deltaX * sensitivity;
        targetXAngle = Math.max(-0.25, Math.min(0.30, targetXAngle + deltaY * 0.003));
        angularMomentum = deltaX * sensitivity;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      try {
        container.releasePointerCapture(event.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const onPointerLeave = () => {
      isHovering = false;
      mouseParallaxX = 0;
      mouseParallaxY = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDown) {
        // Continuous rotation at medium speed
        // If user is hovering with cursor, cursor position dynamically steers and accelerates/slows rotation
        const cursorSteer = isHovering ? mouseParallaxX * 0.008 : 0;
        targetYAngle += baseRotationSpeed + cursorSteer;

        // Cursor Y dynamically controls subtle vertical tilt
        const cursorTilt = isHovering ? -mouseParallaxY * 0.25 : 0;
        targetXAngle += (cursorTilt - targetXAngle) * 0.05;

        // Smooth momentum dissipation after manual dragging
        angularMomentum *= 0.92;
        targetYAngle += angularMomentum;
      }

      // Smooth interpolation for butter-smooth rotation
      currentYAngle += (targetYAngle - currentYAngle) * 0.12;
      currentXAngle += (targetXAngle - currentXAngle) * 0.12;

      masterGroup.rotation.y = currentYAngle;
      masterGroup.rotation.x = currentXAngle;
      masterGroup.rotation.z = 0;
      masterGroup.position.set(0, 0, 0);

      // Subtle parallax camera motion for realistic depth
      targetParallaxX += (mouseParallaxX - targetParallaxX) * 0.05;
      targetParallaxY += (mouseParallaxY - targetParallaxY) * 0.05;

      camera.position.x = targetParallaxX * 0.35;
      camera.position.y = 0.68 + targetParallaxY * 0.18;
      camera.lookAt(0.05, GROUND_Y + 0.68, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center select-none pointer-events-auto group">
      {/* Soft studio photography glow on pure background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(224,242,254,0.45),rgba(248,250,252,0.25),transparent_75%)] pointer-events-none -z-10" />

      {/* Pure WebGL Canvas — Spacious Studio Presentation */}
      <div
        ref={mountRef}
        id="hero-3d-medicines-canvas"
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
};
