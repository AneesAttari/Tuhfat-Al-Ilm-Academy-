import * as THREE from 'three';

// -------------------------------------------------------------
// Procedural Textures (Zero 404s, 100% Canvas Generated)
// -------------------------------------------------------------

export function createProceduralCanvasTexture(
  drawFn: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  size = 512,
  wrap = true
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawFn(ctx, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (wrap) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }
  return texture;
}

// Cream Limestone Paving with Subtle Geometric Grid
export function getLimestoneTexture(): THREE.CanvasTexture {
  return createProceduralCanvasTexture((ctx, w, h) => {
    // Base stone color
    ctx.fillStyle = '#F5EFEB';
    ctx.fillRect(0, 0, w, h);

    // Subtle stone flecks & noise
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 2 + 0.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 203, 190, 0.4)' : 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant carved paver joints
    const tileSize = w / 8;
    ctx.strokeStyle = 'rgba(180, 165, 148, 0.55)';
    ctx.lineWidth = 3;
    for (let x = 0; x <= w; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Inner tile border accent
    ctx.strokeStyle = 'rgba(220, 208, 195, 0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += tileSize) {
      for (let y = 0; y < h; y += tileSize) {
        ctx.strokeRect(x + 4, y + 4, tileSize - 8, tileSize - 8);
      }
    }
  }, 512);
}

// Central Eight-Point Star Plaza Inlay Pattern
export function getStarPlazaTexture(): THREE.CanvasTexture {
  return createProceduralCanvasTexture((ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Background sandstone
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, w, h);

    // Concentric rings
    ctx.strokeStyle = '#D9B44A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    // 8-Pointed Star (Two interlocking squares)
    const size = w * 0.35;
    const drawRotatedSquare = (angleRad: number, fill: string, stroke: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad);
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.rect(-size / 2, -size / 2, size, size);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    drawRotatedSquare(0, 'rgba(6, 78, 59, 0.12)', '#D9B44A');
    drawRotatedSquare(Math.PI / 4, 'rgba(217, 180, 74, 0.18)', '#064E3B');

    // Central circular rosette
    ctx.fillStyle = '#064E3B';
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#D9B44A';
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Radiating petals
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const x1 = cx + Math.cos(angle) * (w * 0.13);
      const y1 = cy + Math.sin(angle) * (w * 0.13);
      const x2 = cx + Math.cos(angle) * (w * 0.40);
      const y2 = cy + Math.sin(angle) * (w * 0.40);

      ctx.strokeStyle = i % 2 === 0 ? 'rgba(217, 180, 74, 0.7)' : 'rgba(6, 78, 59, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, 1024, false);
}

// Geometric Jali / Lattice Openwork Screen Texture
export function getJaliScreenTexture(): THREE.CanvasTexture {
  return createProceduralCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, w, h);

    const step = w / 8;
    ctx.fillStyle = '#064E3B';
    ctx.strokeStyle = '#D9B44A';
    ctx.lineWidth = 2;

    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        const mx = x + step / 2;
        const my = y + step / 2;

        // Cutout diamond pattern
        ctx.beginPath();
        ctx.moveTo(mx, y + 2);
        ctx.lineTo(x + step - 2, my);
        ctx.lineTo(mx, y + step - 2);
        ctx.lineTo(x + 2, my);
        ctx.closePath();
        ctx.stroke();

        // Star center
        ctx.beginPath();
        ctx.arc(mx, my, step * 0.15, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }, 256);
}

// -------------------------------------------------------------
// Shared Material Palette
// -------------------------------------------------------------

export interface UniverseMaterials {
  creamStone: THREE.MeshStandardMaterial;
  whiteMarble: THREE.MeshStandardMaterial;
  emeraldMarble: THREE.MeshStandardMaterial;
  goldTrim: THREE.MeshStandardMaterial;
  waterSurface: THREE.MeshStandardMaterial;
  terracotta: THREE.MeshStandardMaterial;
  cypressFoliage: THREE.MeshStandardMaterial;
  cypressTrunk: THREE.MeshStandardMaterial;
  palmFrond: THREE.MeshStandardMaterial;
  lanternMetal: THREE.MeshStandardMaterial;
  lanternGlass: THREE.MeshStandardMaterial;
  groundGrass: THREE.MeshStandardMaterial;
  pathPaving: THREE.MeshStandardMaterial;
  beaconGlow: THREE.MeshBasicMaterial;
}

export function createUniverseMaterials(): UniverseMaterials {
  const limestoneTex = getLimestoneTexture();
  limestoneTex.repeat.set(12, 12);

  const pathTex = getLimestoneTexture();
  pathTex.repeat.set(4, 16);

  return {
    creamStone: new THREE.MeshStandardMaterial({
      color: 0xF3ECE3,
      roughness: 0.65,
      metalness: 0.05,
      map: limestoneTex
    }),
    whiteMarble: new THREE.MeshStandardMaterial({
      color: 0xFAF9F5,
      roughness: 0.35,
      metalness: 0.1
    }),
    emeraldMarble: new THREE.MeshStandardMaterial({
      color: 0x064E3B,
      roughness: 0.3,
      metalness: 0.25
    }),
    goldTrim: new THREE.MeshStandardMaterial({
      color: 0xE2BA49,
      roughness: 0.25,
      metalness: 0.85
    }),
    waterSurface: new THREE.MeshStandardMaterial({
      color: 0x0D9488,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xBD7348,
      roughness: 0.85,
      metalness: 0.05
    }),
    cypressFoliage: new THREE.MeshStandardMaterial({
      color: 0x1E3A2F,
      roughness: 0.8,
      metalness: 0.05,
      flatShading: true
    }),
    cypressTrunk: new THREE.MeshStandardMaterial({
      color: 0x3E2723,
      roughness: 0.9,
      metalness: 0.05
    }),
    palmFrond: new THREE.MeshStandardMaterial({
      color: 0x2D5A43,
      roughness: 0.7,
      metalness: 0.05,
      side: THREE.DoubleSide
    }),
    lanternMetal: new THREE.MeshStandardMaterial({
      color: 0x2D241E,
      roughness: 0.4,
      metalness: 0.8
    }),
    lanternGlass: new THREE.MeshStandardMaterial({
      color: 0xFFFBEB,
      emissive: 0xF59E0B,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92
    }),
    groundGrass: new THREE.MeshStandardMaterial({
      color: 0x2B4C38,
      roughness: 0.9,
      metalness: 0.02
    }),
    pathPaving: new THREE.MeshStandardMaterial({
      color: 0xEDE5D8,
      roughness: 0.6,
      metalness: 0.08,
      map: pathTex
    }),
    beaconGlow: new THREE.MeshBasicMaterial({
      color: 0xD9B44A,
      transparent: true,
      opacity: 0.85,
      wireframe: false
    })
  };
}

// -------------------------------------------------------------
// Procedural Geometry Builders (Composite THREE.Group meshes)
// -------------------------------------------------------------

/**
 * Creates an Islamic Horseshoe Arch using ExtrudeGeometry
 */
export function createHorseshoeArchMesh(
  materials: UniverseMaterials,
  width = 3.6,
  height = 5.0,
  depth = 0.5
): THREE.Group {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  const halfW = width / 2;
  const pillarW = 0.55;
  const springY = height * 0.58;

  // Outer frame outline
  shape.moveTo(-halfW, 0);
  shape.lineTo(-halfW, springY);
  // Outer horseshoe curve
  const rOuter = halfW;
  const curvePoints = 24;
  for (let i = 0; i <= curvePoints; i++) {
    const theta = Math.PI - (i / curvePoints) * Math.PI;
    const x = Math.cos(theta) * rOuter;
    const y = springY + Math.sin(theta) * (height - springY);
    shape.lineTo(x, y);
  }
  shape.lineTo(halfW, springY);
  shape.lineTo(halfW, 0);
  shape.lineTo(halfW - pillarW, 0);
  shape.lineTo(halfW - pillarW, springY);

  // Inner cutout arch hole
  const hole = new THREE.Path();
  const innerHalfW = halfW - pillarW;
  hole.moveTo(-innerHalfW, 0);
  hole.lineTo(-innerHalfW, springY);
  for (let i = 0; i <= curvePoints; i++) {
    const theta = Math.PI - (i / curvePoints) * Math.PI;
    const x = Math.cos(theta) * innerHalfW;
    const y = springY + Math.sin(theta) * (height - springY - 0.4);
    hole.lineTo(x, y);
  }
  hole.lineTo(innerHalfW, springY);
  hole.lineTo(innerHalfW, 0);
  hole.closePath();

  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06
  };

  const archGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  archGeo.center();
  archGeo.translate(0, height / 2, 0);

  const archMesh = new THREE.Mesh(archGeo, materials.creamStone);
  archMesh.castShadow = true;
  archMesh.receiveShadow = true;
  group.add(archMesh);

  // Dual flanking stone columns with gold capitals and base plinths
  const colGeo = new THREE.CylinderGeometry(0.24, 0.28, springY, 16);
  colGeo.translate(0, springY / 2, 0);
  const leftCol = new THREE.Mesh(colGeo, materials.whiteMarble);
  leftCol.position.set(-halfW + pillarW / 2, 0, depth / 2);
  leftCol.castShadow = true;
  const rightCol = leftCol.clone();
  rightCol.position.x = halfW - pillarW / 2;
  group.add(leftCol);
  group.add(rightCol);

  // Ornate capitals
  const capGeo = new THREE.CylinderGeometry(0.36, 0.26, 0.4, 8);
  capGeo.translate(0, springY + 0.2, 0);
  const leftCap = new THREE.Mesh(capGeo, materials.goldTrim);
  leftCap.position.set(-halfW + pillarW / 2, 0, depth / 2);
  const rightCap = leftCap.clone();
  rightCap.position.x = halfW - pillarW / 2;
  group.add(leftCap);
  group.add(rightCap);

  // Spire pinnacle / finial on top of arch
  const spireGeo = new THREE.ConeGeometry(0.18, 0.8, 8);
  spireGeo.translate(0, height + 0.4, depth / 2);
  const spire = new THREE.Mesh(spireGeo, materials.goldTrim);
  group.add(spire);

  return group;
}

/**
 * Creates the Central Courtyard Multi-Tier Fountain & Plaza
 */
export function createCentralPlaza(materials: UniverseMaterials): {
  group: THREE.Group;
  waterMesh: THREE.Mesh;
} {
  const group = new THREE.Group();

  // 1. Broad octagonal stepped platform (radius 11m, height 0.45m)
  const podiumGeo = new THREE.CylinderGeometry(11, 11.5, 0.45, 8);
  podiumGeo.translate(0, 0.225, 0);
  const podium = new THREE.Mesh(podiumGeo, materials.creamStone);
  podium.receiveShadow = true;
  group.add(podium);

  // Plaza Star Pattern Inlay Decal (polygonOffset prevents z-fighting)
  const starGeo = new THREE.CircleGeometry(10.2, 32);
  starGeo.rotateX(-Math.PI / 2);
  starGeo.translate(0, 0.46, 0);
  const starMat = new THREE.MeshStandardMaterial({
    map: getStarPlazaTexture(),
    roughness: 0.5,
    metalness: 0.15,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });
  const starMesh = new THREE.Mesh(starGeo, starMat);
  starMesh.receiveShadow = true;
  group.add(starMesh);

  // 2. Central Fountain Structure
  // Fountain outer octagonal marble pool basin (radius 3.8m, height 0.7m)
  const outerBasinGeo = new THREE.CylinderGeometry(3.8, 4.0, 0.7, 8);
  outerBasinGeo.translate(0, 0.35 + 0.45, 0);
  const outerBasin = new THREE.Mesh(outerBasinGeo, materials.emeraldMarble);
  outerBasin.castShadow = true;
  outerBasin.receiveShadow = true;
  group.add(outerBasin);

  // Outer pool water surface
  const waterGeo = new THREE.CircleGeometry(3.6, 24);
  waterGeo.rotateX(-Math.PI / 2);
  waterGeo.translate(0, 1.05, 0);
  const waterMesh = new THREE.Mesh(waterGeo, materials.waterSurface);
  group.add(waterMesh);

  // Fountain Center Pedestal (Lathe Geometry)
  const pedestalPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.8, 0),
    new THREE.Vector2(0.8, 0.4),
    new THREE.Vector2(0.5, 0.8),
    new THREE.Vector2(0.5, 1.4),
    new THREE.Vector2(1.4, 1.6),
    new THREE.Vector2(1.5, 1.8),
    new THREE.Vector2(1.3, 1.9),
    new THREE.Vector2(0.4, 2.2),
    new THREE.Vector2(0.4, 2.7),
    new THREE.Vector2(0.9, 2.8),
    new THREE.Vector2(1.0, 3.0),
    new THREE.Vector2(0.8, 3.1),
    new THREE.Vector2(0.25, 3.4),
    new THREE.Vector2(0.0, 3.7)
  ];
  const pedestalGeo = new THREE.LatheGeometry(pedestalPoints, 24);
  pedestalGeo.translate(0, 0.45, 0);
  const pedestalMesh = new THREE.Mesh(pedestalGeo, materials.whiteMarble);
  pedestalMesh.castShadow = true;
  pedestalMesh.receiveShadow = true;
  group.add(pedestalMesh);

  // Fountain Gold Finial Crown on Top
  const finialGeo = new THREE.SphereGeometry(0.35, 16, 16);
  finialGeo.translate(0, 4.3, 0);
  const finialMesh = new THREE.Mesh(finialGeo, materials.goldTrim);
  finialMesh.castShadow = true;
  group.add(finialMesh);

  // 3. Four Grand Cardinal Horseshoe Portals facing North, South, East, West
  const cardinalAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  cardinalAngles.forEach((ang) => {
    const arch = createHorseshoeArchMesh(materials, 3.8, 5.2, 0.55);
    arch.position.set(Math.cos(ang) * 9.5, 0.45, Math.sin(ang) * 9.5);
    arch.rotation.y = -ang + Math.PI / 2;
    group.add(arch);
  });

  return { group, waterMesh };
}

/**
 * Creates an Architectural Learning Destination Pavilion
 */
export function createDestinationPavilion(
  materials: UniverseMaterials,
  colorHex = '#064E3B',
  title = ''
): {
  group: THREE.Group;
  hitBox: THREE.Mesh;
  beaconRing: THREE.Mesh;
  lanternLight: THREE.PointLight;
} {
  const group = new THREE.Group();
  group.name = `destination-${title}`;

  // 1. Pavilion Base Podium (Elevated octagonal plinth)
  const baseGeo = new THREE.CylinderGeometry(2.8, 3.1, 0.4, 8);
  baseGeo.translate(0, 0.2, 0);
  const baseMesh = new THREE.Mesh(baseGeo, materials.creamStone);
  baseMesh.receiveShadow = true;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Inset emerald border
  const borderGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.42, 8);
  borderGeo.translate(0, 0.21, 0);
  const customEmerald = materials.emeraldMarble.clone();
  customEmerald.color = new THREE.Color(colorHex);
  const borderMesh = new THREE.Mesh(borderGeo, customEmerald);
  borderMesh.receiveShadow = true;
  group.add(borderMesh);

  // 2. Slender Marble Columns supporting pavilion canopy (6 columns in hex ring)
  const colRadius = 2.1;
  const colHeight = 3.6;
  const colGeo = new THREE.CylinderGeometry(0.14, 0.16, colHeight, 12);
  colGeo.translate(0, colHeight / 2 + 0.4, 0);

  const capGeo = new THREE.CylinderGeometry(0.24, 0.16, 0.25, 8);
  capGeo.translate(0, colHeight + 0.4 + 0.12, 0);

  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    const cx = Math.cos(ang) * colRadius;
    const cz = Math.sin(ang) * colRadius;

    const col = new THREE.Mesh(colGeo, materials.whiteMarble);
    col.position.set(cx, 0, cz);
    col.castShadow = true;
    group.add(col);

    const cap = new THREE.Mesh(capGeo, materials.goldTrim);
    cap.position.set(cx, 0, cz);
    cap.castShadow = true;
    group.add(cap);
  }

  // 3. Classical Islamic Domed Canopy / Roof
  const roofRimGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.35, 12);
  roofRimGeo.translate(0, colHeight + 0.55, 0);
  const roofRim = new THREE.Mesh(roofRimGeo, materials.creamStone);
  roofRim.castShadow = true;
  group.add(roofRim);

  // Pointed Arched Dome
  const domePoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(2.3, 0),
    new THREE.Vector2(2.1, 0.6),
    new THREE.Vector2(1.6, 1.4),
    new THREE.Vector2(0.9, 2.1),
    new THREE.Vector2(0.3, 2.7),
    new THREE.Vector2(0.0, 3.0)
  ];
  const domeGeo = new THREE.LatheGeometry(domePoints, 16);
  domeGeo.translate(0, colHeight + 0.7, 0);
  const domeMesh = new THREE.Mesh(domeGeo, customEmerald);
  domeMesh.castShadow = true;
  group.add(domeMesh);

  // Gold Crescent Finial
  const finialCone = new THREE.ConeGeometry(0.16, 0.7, 8);
  finialCone.translate(0, colHeight + 3.9, 0);
  const finialMesh = new THREE.Mesh(finialCone, materials.goldTrim);
  finialMesh.castShadow = true;
  group.add(finialMesh);

  // 4. Central Pedagogical Scriptorium Lectern (representing learning & study)
  const lecternBaseGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 8);
  lecternBaseGeo.translate(0, 0.85, 0);
  const lecternBase = new THREE.Mesh(lecternBaseGeo, materials.whiteMarble);
  lecternBase.castShadow = true;
  group.add(lecternBase);

  // Ornate Gold Trim on Lectern
  const trimRing = new THREE.TorusGeometry(0.46, 0.05, 8, 16);
  trimRing.rotateX(Math.PI / 2);
  trimRing.translate(0, 1.3, 0);
  const trimRingMesh = new THREE.Mesh(trimRing, materials.goldTrim);
  group.add(trimRingMesh);

  // 5. Hanging Brass Lantern
  const lanternGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.45, 6);
  lanternGeo.translate(0, colHeight + 0.1, 0);
  const lanternMesh = new THREE.Mesh(lanternGeo, materials.lanternGlass);
  group.add(lanternMesh);

  const lanternCapGeo = new THREE.ConeGeometry(0.26, 0.2, 6);
  lanternCapGeo.translate(0, colHeight + 0.4, 0);
  const lanternCap = new THREE.Mesh(lanternCapGeo, materials.lanternMetal);
  group.add(lanternCap);

  // Soft Point Light for Evening Warmth
  const lanternLight = new THREE.PointLight(0xF59E0B, 0, 10, 1.5);
  lanternLight.position.set(0, colHeight + 0.1, 0);
  lanternLight.castShadow = false;
  group.add(lanternLight);

  // 6. Interactive Ground Beacon Ring (glows on hover and pulses softly)
  const beaconGeo = new THREE.RingGeometry(3.0, 3.4, 32);
  beaconGeo.rotateX(-Math.PI / 2);
  beaconGeo.translate(0, 0.08, 0);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0xD9B44A,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const beaconRing = new THREE.Mesh(beaconGeo, beaconMat);
  group.add(beaconRing);

  // 7. Raycast Target / Hit Box (invisible simplified cylinder for crisp, rapid clicks)
  const hitGeo = new THREE.CylinderGeometry(3.3, 3.3, 6.5, 8);
  hitGeo.translate(0, 3.25, 0);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false
  });
  const hitBox = new THREE.Mesh(hitGeo, hitMat);
  hitBox.name = `hitbox-${title}`;
  group.add(hitBox);

  return { group, hitBox, beaconRing, lanternLight };
}

/**
 * Creates Mediterranean Cypress Trees (Composite Group of trunk + 4 stacked foliage cones)
 */
export function createCypressTree(materials: UniverseMaterials, scale = 1.0): THREE.Group {
  const group = new THREE.Group();

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 1.4 * scale, 8);
  trunkGeo.translate(0, (0.7 * scale), 0);
  const trunk = new THREE.Mesh(trunkGeo, materials.cypressTrunk);
  trunk.castShadow = true;
  group.add(trunk);

  // 4 tiered foliage cones with slight per-tier scale & overlap
  const foliageTiers = [
    { r: 0.95 * scale, h: 2.4 * scale, y: 1.6 * scale },
    { r: 0.85 * scale, h: 2.2 * scale, y: 2.7 * scale },
    { r: 0.70 * scale, h: 2.0 * scale, y: 3.8 * scale },
    { r: 0.48 * scale, h: 1.8 * scale, y: 4.8 * scale }
  ];

  foliageTiers.forEach((tier) => {
    const coneGeo = new THREE.ConeGeometry(tier.r, tier.h, 7);
    coneGeo.translate(0, tier.y, 0);
    const foliageMesh = new THREE.Mesh(coneGeo, materials.cypressFoliage);
    foliageMesh.castShadow = true;
    foliageMesh.receiveShadow = true;
    group.add(foliageMesh);
  });

  return group;
}

/**
 * Creates Date Palm Trees
 */
export function createPalmTree(materials: UniverseMaterials, height = 7.0): THREE.Group {
  const group = new THREE.Group();

  // Segmented curved trunk
  const trunkSegments = 9;
  const segHeight = height / trunkSegments;
  for (let i = 0; i < trunkSegments; i++) {
    const bottomR = 0.35 - (i / trunkSegments) * 0.12;
    const topR = 0.33 - (i / trunkSegments) * 0.12;
    const segGeo = new THREE.CylinderGeometry(topR, bottomR, segHeight, 8);
    segGeo.translate(0, segHeight / 2, 0);
    const seg = new THREE.Mesh(segGeo, materials.cypressTrunk);
    // Subtle organic curve
    seg.position.set(Math.sin(i * 0.2) * 0.15, i * segHeight, 0);
    seg.rotation.z = Math.sin(i * 0.25) * 0.05;
    seg.castShadow = true;
    group.add(seg);
  }

  // Radiating crown of drooping palm fronds
  const frondCount = 10;
  const crownY = height;
  for (let i = 0; i < frondCount; i++) {
    const angle = (i * Math.PI * 2) / frondCount;
    const frondShape = new THREE.Shape();
    frondShape.moveTo(0, 0);
    frondShape.quadraticCurveTo(1.6, 0.4, 3.2, -0.9);
    frondShape.quadraticCurveTo(1.8, 0.2, 0, 0);

    const frondGeo = new THREE.ShapeGeometry(frondShape);
    const frondMesh = new THREE.Mesh(frondGeo, materials.palmFrond);
    frondMesh.position.set(0, crownY, 0);
    frondMesh.rotation.y = angle;
    frondMesh.rotation.z = -0.35;
    frondMesh.castShadow = true;
    group.add(frondMesh);
  }

  return group;
}

/**
 * Creates Carved Stone Pathway connecting Center to Destination
 */
export function createPathwayMesh(
  materials: UniverseMaterials,
  start: THREE.Vector3,
  end: THREE.Vector3,
  width = 2.4
): THREE.Mesh {
  const length = start.distanceTo(end);
  const pathGeo = new THREE.PlaneGeometry(width, length);
  pathGeo.rotateX(-Math.PI / 2);

  const pathMesh = new THREE.Mesh(pathGeo, materials.pathPaving);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  pathMesh.position.copy(mid);
  pathMesh.position.y = 0.04; // offset above ground to avoid z-fighting
  pathMesh.lookAt(end.x, 0.04, end.z);
  pathMesh.receiveShadow = true;

  return pathMesh;
}
