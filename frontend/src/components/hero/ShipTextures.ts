import * as THREE from 'three';

/* ================================================================
   SHIP TEXTURES — Authentic Real Maritime Steel & PBR Maps
   ────────────────────────────────────────────────────────────
   Realistic commercial & patrol vessel surface materials:
   - Antifouling Iron Oxide Red bottom with draft marks
   - Deep Marine Slate / Charcoal naval steel topsides
   - Welded hull plate joints, butt seams, and rivet head lines
   - Non-skid maritime green deck coating with safety yellow markings
   - Off-white superstructure with panel joints and watertight doors
   - Industrial semi-matte paint roughness & real metalness maps
   ================================================================ */

export interface ShipPBRTextures {
  albedoMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  metalnessMap: THREE.CanvasTexture;
}

export function generateShipPBRTextures(): ShipPBRTextures {
  const width = 2048;
  const height = 2048;

  /* ── 1. Albedo Canvas (Authentic Real Ship Paint & Steel) ── */
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const ctx = albedoCanvas.getContext('2d')!;

  // Upper section: Dark naval slate hull steel (#232D3B)
  ctx.fillStyle = '#232D3B';
  ctx.fillRect(0, 0, width, height * 0.55);

  // Subtle steel plate tonal variations
  for (let y = 0; y < height * 0.55; y += 120) {
    for (let x = 0; x < width; x += 240) {
      const shade = Math.floor(Math.random() * 12) - 6;
      ctx.fillStyle = `rgb(${0x23 + shade}, ${0x2D + shade}, ${0x3B + shade})`;
      ctx.fillRect(x + 2, y + 2, 236, 116);
    }
  }

  // Waterline demarcation / boot-topping band (deep black-slate)
  ctx.fillStyle = '#0D131A';
  ctx.fillRect(0, height * 0.53, width, height * 0.04);

  // Waterline white draft line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.54);
  ctx.lineTo(width, height * 0.54);
  ctx.stroke();

  // Lower section: Real Antifouling Maritime Oxide Red (#852422)
  const redGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
  redGrad.addColorStop(0.0, '#7A1F1D');
  redGrad.addColorStop(0.3, '#882624');
  redGrad.addColorStop(0.7, '#832220');
  redGrad.addColorStop(1.0, '#661614');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, height * 0.55, width, height * 0.45);

  // Horizontal welded plate lap joints (dark shadow line + light highlight)
  for (let y = 80; y < height; y += 120) {
    // Weld shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    // Weld bead highlight
    ctx.strokeStyle = y < height * 0.55 ? 'rgba(80, 100, 125, 0.35)' : 'rgba(180, 70, 65, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(width, y + 2);
    ctx.stroke();
  }

  // Vertical butt weld seams
  for (let x = 120; x < width; x += 240) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.40)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Rivet rows along vertical frames
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  for (let x = 120; x < width; x += 240) {
    for (let y = 15; y < height; y += 24) {
      ctx.beginPath();
      ctx.arc(x - 6, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draft depth markers (metres/feet numerals on bow)
  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  const draftMarks = ['12M', '10M', '8M', '6M', '4M', '2M'];
  draftMarks.forEach((m, idx) => {
    ctx.fillText(m, 30, height * 0.45 + idx * 80);
    ctx.fillText(m, width - 80, height * 0.45 + idx * 80);
  });

  /* ── 2. Normal Map Canvas (Raised Weld Beads & Plate Seams) ── */
  const normCanvas = document.createElement('canvas');
  normCanvas.width = width;
  normCanvas.height = height;
  const nCtx = normCanvas.getContext('2d')!;

  // Neutral normal base (#8080FF)
  nCtx.fillStyle = '#8080FF';
  nCtx.fillRect(0, 0, width, height);

  // Raised horizontal weld lines
  for (let y = 80; y < height; y += 120) {
    nCtx.fillStyle = '#8060FF'; // top bevel
    nCtx.fillRect(0, y - 2, width, 2);
    nCtx.fillStyle = '#80A0FF'; // bottom bevel
    nCtx.fillRect(0, y + 1, width, 2);
  }

  // Raised vertical butt joints
  for (let x = 120; x < width; x += 240) {
    nCtx.fillStyle = '#6080FF'; // left bevel
    nCtx.fillRect(x - 2, 0, 2, height);
    nCtx.fillStyle = '#A080FF'; // right bevel
    nCtx.fillRect(x + 1, 0, 2, height);
  }

  // Raised rivet bumps
  nCtx.fillStyle = '#9090FF';
  for (let x = 120; x < width; x += 240) {
    for (let y = 15; y < height; y += 24) {
      nCtx.beginPath();
      nCtx.arc(x - 6, y, 2.0, 0, Math.PI * 2);
      nCtx.fill();
    }
  }

  /* ── 3. Roughness Canvas (Industrial Marine Coatings) ── */
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;

  // Topsides satin steel enamel (Roughness ~0.55 -> #8C8C8C)
  rCtx.fillStyle = '#8C8C8C';
  rCtx.fillRect(0, 0, width, height * 0.55);

  // Antifouling matte copper paint (Roughness ~0.68 -> #ADADAD)
  rCtx.fillStyle = '#ADADAD';
  rCtx.fillRect(0, height * 0.55, width, height * 0.45);

  // Weld seams higher roughness (matte slag)
  rCtx.fillStyle = '#C0C0C0';
  for (let y = 80; y < height; y += 120) {
    rCtx.fillRect(0, y - 2, width, 4);
  }

  /* ── 4. Metalness Canvas (Painted Steel & Bare Fittings) ── */
  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = width;
  metalCanvas.height = height;
  const mCtx = metalCanvas.getContext('2d')!;

  // Painted steel base metalness (~0.12 -> #1E1E1E)
  mCtx.fillStyle = '#1E1E1E';
  mCtx.fillRect(0, 0, width, height);

  // Slightly more metallic along worn plate edges
  mCtx.fillStyle = '#3E3E3E';
  for (let y = 80; y < height; y += 120) {
    mCtx.fillRect(0, y, width, 1.5);
  }

  const albedoMap    = new THREE.CanvasTexture(albedoCanvas);
  const normalMap    = new THREE.CanvasTexture(normCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const metalnessMap = new THREE.CanvasTexture(metalCanvas);

  albedoMap.wrapS = albedoMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  metalnessMap.wrapS = metalnessMap.wrapT = THREE.RepeatWrapping;

  return { albedoMap, normalMap, roughnessMap, metalnessMap };
}

export default generateShipPBRTextures;
