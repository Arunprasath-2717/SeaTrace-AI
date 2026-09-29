import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { generateShipPBRTextures, ShipPBRTextures } from './ShipTextures';

/* ================================================================
   VESSEL — Authentic Maritime Commercial & Patrol Vessel
   ────────────────────────────────────────────────────────────
   Real Ship Anatomy & Authentic Materials:
   - Antifouling Iron Oxide Red lower hull (#852422) with bulbous bow
   - Boot-topping waterline demarcation stripe (#0E141B)
   - Dark Slate / Maritime Charcoal welded steel topsides (#232D3B)
   - Non-skid maritime green weather deck (#1E3529)
   - Marine off-white bridge & superstructure (#DEE5ED)
   - Polarized solar-tinted bridge observation windows (#061824)
   - Dark funnel with maritime identification band & soot exhaust rim
   - SOLAS high-visibility safety orange lifeboats & life rafts (#EA580C)
   - Cast naval steel deck fittings, bitts, anchor winches & rudders
   - Dual rotating radar scanners with safety tips & SATCOM radome
   - Official IMO regulation navigation lights (Port Red, Stbd Green, Masthead White)
   ================================================================ */

export class Vessel {
  public group: THREE.Group;
  private shipModel: THREE.Group | null = null;
  private radarScannerPrimary: THREE.Object3D | null = null;
  private radarScannerSecondary: THREE.Object3D | null = null;
  private highPolyProceduralGroup: THREE.Group;
  public isLoaded = false;

  /* Textures */
  private pbrTextures: ShipPBRTextures;

  /* Physical Kinematics & Steering */
  public forwardSpeed = 12.5; // High-speed transit velocity
  public headingAngle = 0.0;  // Radians
  public sternWorldPos = new THREE.Vector3();
  public bowWorldPos   = new THREE.Vector3();
  public velocityVector = new THREE.Vector3(0, 0, 1);

  private targetRudder  = 0.0;
  private currentRudder = 0.0;
  private currentPitch  = 0.028; // Dynamic bow rise under speed
  private currentRoll   = 0.0;
  private currentYaw    = 0.0;
  private currentY      = 0.0;

  constructor() {
    this.group = new THREE.Group();
    this.highPolyProceduralGroup = new THREE.Group();
    this.group.add(this.highPolyProceduralGroup);

    // Generate high-resolution 2048x2048 realistic maritime PBR maps
    this.pbrTextures = generateShipPBRTextures();

    // Build ultra-detailed authentic maritime steel vessel
    this.buildRealisticMaritimeVessel();

    // Load FBX asset with authentic palette texture mapping
    this.loadKotorFrigate();
  }

  /**
   * Builds an ultra-detailed, realistic maritime vessel with authentic
   * red antifouling bottom, dark slate steel topsides, green deck, and white bridge.
   */
  private buildRealisticMaritimeVessel() {
    /* ════════════════ AUTHENTIC SHIP MATERIALS ════════════════ */

    // 1. Antifouling Oxide Red (Underwater hull / keel / bulbous bow)
    const hullBottom = new THREE.MeshStandardMaterial({
      color:           new THREE.Color(0x84201E),
      roughness:       0.65,
      metalness:       0.06,
      map:             this.pbrTextures.albedoMap,
      normalMap:       this.pbrTextures.normalMap,
      normalScale:     new THREE.Vector2(0.4, 0.4),
      roughnessMap:    this.pbrTextures.roughnessMap,
    });

    // 2. Topsides Welded Naval Slate Steel (Freeboard hull above waterline)
    const hullSteel = new THREE.MeshStandardMaterial({
      color:           new THREE.Color(0x232D3B),
      roughness:       0.56,
      metalness:       0.20,
      map:             this.pbrTextures.albedoMap,
      normalMap:       this.pbrTextures.normalMap,
      normalScale:     new THREE.Vector2(0.5, 0.5),
      roughnessMap:    this.pbrTextures.roughnessMap,
      metalnessMap:    this.pbrTextures.metalnessMap,
    });

    // 3. Boot-topping Waterline Demarcation Band
    const bootTopping = new THREE.MeshStandardMaterial({
      color:     0x0E141B,
      roughness: 0.70,
      metalness: 0.10,
    });

    // 4. Weather Deck: Non-skid Maritime Green
    const deckMat = new THREE.MeshStandardMaterial({
      color:     0x1E3529,
      roughness: 0.86,
      metalness: 0.08,
    });

    // 5. Foredeck & Working Deck Dark Slate Non-skid
    const workingDeckMat = new THREE.MeshStandardMaterial({
      color:     0x222C38,
      roughness: 0.82,
      metalness: 0.12,
    });

    // 6. Superstructure & Accommodation Bridge: Marine Off-White
    const bridgeWhite = new THREE.MeshStandardMaterial({
      color:        new THREE.Color(0xDEE5ED),
      roughness:    0.42,
      metalness:    0.10,
      normalMap:    this.pbrTextures.normalMap,
      normalScale:  new THREE.Vector2(0.2, 0.2),
    });

    // 7. Polarized Solar Bridge Glass
    const bridgeGlass = new THREE.MeshPhysicalMaterial({
      color:              0x061824,
      roughness:          0.04,
      metalness:          0.12,
      clearcoat:          1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity:    2.2,
      reflectivity:       0.95,
    });

    // 8. Galvanized Naval Steel & Cast Iron (deck machinery, winches, bitts)
    const navalSteel = new THREE.MeshStandardMaterial({
      color:     0x5A6B7C,
      roughness: 0.32,
      metalness: 0.85,
    });

    // 9. Bronze / Brass (Propellers, bells, directional fittings)
    const bronze = new THREE.MeshStandardMaterial({
      color:     0xB8860B,
      roughness: 0.28,
      metalness: 0.88,
    });

    // 10. Funnel / Exhaust Casing
    const funnelBody = new THREE.MeshStandardMaterial({
      color:     0x1A222E,
      roughness: 0.48,
      metalness: 0.18,
    });

    // Funnel Maritime Identification Stripe (Emerald / White)
    const funnelStripe = new THREE.MeshStandardMaterial({
      color:     0x10B981,
      roughness: 0.40,
      metalness: 0.10,
    });

    // Funnel Soot Exhaust Rim
    const sootRim = new THREE.MeshStandardMaterial({
      color:     0x0A0D10,
      roughness: 0.95,
      metalness: 0.02,
    });

    // 11. SOLAS Safety Orange (Lifeboats & Life Rafts)
    const solasOrange = new THREE.MeshStandardMaterial({
      color:     0xEA580C,
      roughness: 0.46,
      metalness: 0.05,
    });

    // 12. Rubber Fenders & Gaskets
    const rubberMat = new THREE.MeshStandardMaterial({
      color:     0x11161C,
      roughness: 0.92,
      metalness: 0.01,
    });

    /* ════════════════════════ 1. HULL STRUCTURE ════════════════════════ */
    const hullGroup = new THREE.Group();

    // ── A. Lower Hull: Oxide Red Antifouling Keel ──
    const lowerHullGeo = new THREE.CylinderGeometry(1.78, 1.40, 24.0, 36, 8);
    lowerHullGeo.rotateX(Math.PI / 2);
    lowerHullGeo.scale(1.0, 0.48, 1.0);
    const lowerHull = new THREE.Mesh(lowerHullGeo, hullBottom);
    lowerHull.position.set(0, -0.05, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    hullGroup.add(lowerHull);

    // Bulbous Bow (Underwater forward cutwater in Oxide Red)
    const bulbGeo = new THREE.SphereGeometry(1.20, 24, 16);
    bulbGeo.scale(0.70, 0.70, 1.85);
    const bulb = new THREE.Mesh(bulbGeo, hullBottom);
    bulb.position.set(0, -0.15, 12.8);
    bulb.castShadow = true;
    hullGroup.add(bulb);

    // ── B. Waterline Boot-topping Stripe ──
    const bootGeo = new THREE.CylinderGeometry(1.82, 1.80, 24.2, 36, 1);
    bootGeo.rotateX(Math.PI / 2);
    bootGeo.scale(1.0, 0.12, 1.0);
    const boot = new THREE.Mesh(bootGeo, bootTopping);
    boot.position.set(0, 0.26, 0);
    hullGroup.add(boot);

    // ── C. Upper Hull Topsides: Dark Slate Steel ──
    const upperHullGeo = new THREE.CylinderGeometry(1.82, 1.65, 24.0, 36, 8);
    upperHullGeo.rotateX(Math.PI / 2);
    upperHullGeo.scale(1.0, 0.65, 1.0);
    const upperHull = new THREE.Mesh(upperHullGeo, hullSteel);
    upperHull.position.set(0, 0.65, 0);
    upperHull.castShadow = true;
    upperHull.receiveShadow = true;
    hullGroup.add(upperHull);

    // Raked Flared Bow (Sharp cutwater rising forward)
    const bowGeo = new THREE.ConeGeometry(1.82, 9.2, 32);
    bowGeo.rotateX(Math.PI / 2);
    bowGeo.scale(0.85, 1.15, 1.0);
    const bow = new THREE.Mesh(bowGeo, hullSteel);
    bow.position.set(0, 0.72, 13.6);
    bow.castShadow = true;
    hullGroup.add(bow);

    // Bow cutwater knife edge (stem post in naval steel)
    const stemGeo = new THREE.BoxGeometry(0.12, 2.6, 9.0);
    const stem = new THREE.Mesh(stemGeo, navalSteel);
    stem.position.set(0, 0.72, 13.5);
    stem.rotation.x = -0.32;
    hullGroup.add(stem);

    // Transom Stern (Flat square industrial stern)
    const sternGeo = new THREE.BoxGeometry(3.35, 2.3, 0.30);
    const stern = new THREE.Mesh(sternGeo, hullSteel);
    stern.position.set(0, 0.55, -11.9);
    stern.castShadow = true;
    hullGroup.add(stern);

    // Stern body transition fillet
    const sternBodyGeo = new THREE.BoxGeometry(3.35, 2.3, 3.2);
    const sternBody = new THREE.Mesh(sternBodyGeo, hullSteel);
    sternBody.position.set(0, 0.55, -10.4);
    hullGroup.add(sternBody);

    // Bilge chine strake (port & starboard)
    const chineGeoP = new THREE.BoxGeometry(0.18, 0.12, 26.0);
    const chineP = new THREE.Mesh(chineGeoP, hullSteel);
    chineP.position.set(-1.68, 0.10, 0);
    chineP.rotation.z = 0.12;
    hullGroup.add(chineP);

    const chineS = chineP.clone();
    chineS.position.set(1.68, 0.10, 0);
    chineS.rotation.z = -0.12;
    hullGroup.add(chineS);

    // Waterline heavy-duty rubber rubbing strake
    const strakeGeo = new THREE.BoxGeometry(0.12, 0.14, 26.0);
    const strakeP = new THREE.Mesh(strakeGeo, rubberMat);
    strakeP.position.set(-1.76, 0.40, 0);
    hullGroup.add(strakeP);
    const strakeS = strakeP.clone();
    strakeS.position.set(1.76, 0.40, 0);
    hullGroup.add(strakeS);

    // Bulwarks (Dark steel perimeter wall on deck)
    const bulwarkGeo = new THREE.BoxGeometry(0.12, 0.40, 24.5);
    const bulwarkP = new THREE.Mesh(bulwarkGeo, hullSteel);
    bulwarkP.position.set(-1.82, 1.35, 0);
    hullGroup.add(bulwarkP);
    const bulwarkS = bulwarkP.clone();
    bulwarkS.position.set(1.82, 1.35, 0);
    hullGroup.add(bulwarkS);

    // Bulwark cap rail (Galvanized steel top rail)
    const railCapGeo = new THREE.BoxGeometry(0.18, 0.06, 24.5);
    const railCapP = new THREE.Mesh(railCapGeo, navalSteel);
    railCapP.position.set(-1.82, 1.56, 0);
    hullGroup.add(railCapP);
    const railCapS = railCapP.clone();
    railCapS.position.set(1.82, 1.56, 0);
    hullGroup.add(railCapS);

    // Heavy port fenders (4 rubber cylinders per side)
    for (let i = 0; i < 4; i++) {
      const fGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.65, 12);
      const fP = new THREE.Mesh(fGeo, rubberMat);
      fP.position.set(-1.90, 0.65, -5.0 + i * 3.4);
      hullGroup.add(fP);
      const fS = fP.clone();
      fS.position.set(1.90, 0.65, -5.0 + i * 3.4);
      hullGroup.add(fS);
    }

    // Anchor hawse pipes & anchors (port and starboard bow)
    for (const side of [-1, 1]) {
      const hawseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 12);
      hawseGeo.rotateZ(Math.PI / 2);
      const hawse = new THREE.Mesh(hawseGeo, navalSteel);
      hawse.position.set(side * 1.35, 0.85, 11.2);
      hullGroup.add(hawse);

      // Cast iron anchor shank & flukes seated in pocket
      const shankGeo = new THREE.BoxGeometry(0.10, 0.70, 0.12);
      const shank = new THREE.Mesh(shankGeo, navalSteel);
      shank.position.set(side * 1.48, 0.75, 11.2);
      shank.rotation.z = side * 0.2;
      hullGroup.add(shank);

      const flukeGeo = new THREE.BoxGeometry(0.35, 0.10, 0.28);
      const fluke = new THREE.Mesh(flukeGeo, navalSteel);
      fluke.position.set(side * 1.50, 0.45, 11.2);
      hullGroup.add(fluke);
    }

    this.highPolyProceduralGroup.add(hullGroup);

    /* ════════════════════════ 2. WEATHER DECK & MACHINERY ════════════════════════ */
    const deckGroup = new THREE.Group();

    // Main weather deck surface (Maritime green non-skid)
    const deckSurfGeo = new THREE.BoxGeometry(3.45, 0.10, 26.0);
    const deckSurf = new THREE.Mesh(deckSurfGeo, deckMat);
    deckSurf.position.set(0, 1.20, 0);
    deckSurf.receiveShadow = true;
    deckGroup.add(deckSurf);

    // Raised forecastle working platform at bow (Dark slate non-skid)
    const foredGeo = new THREE.BoxGeometry(3.25, 0.15, 6.5);
    const fored = new THREE.Mesh(foredGeo, workingDeckMat);
    fored.position.set(0, 1.28, 11.8);
    deckGroup.add(fored);

    // Forward wave breakwater (V-shaped wave deflector on foredeck)
    const bwGeoL = new THREE.BoxGeometry(0.12, 0.55, 2.2);
    bwGeoL.rotateY(0.45);
    const bwL = new THREE.Mesh(bwGeoL, navalSteel);
    bwL.position.set(-0.85, 1.62, 8.8);
    deckGroup.add(bwL);

    const bwGeoR = new THREE.BoxGeometry(0.12, 0.55, 2.2);
    bwGeoR.rotateY(-0.45);
    const bwR = new THREE.Mesh(bwGeoR, navalSteel);
    bwR.position.set(0.85, 1.62, 8.8);
    deckGroup.add(bwR);

    // Foredeck heavy anchor windlass / winches (Twin drums in naval cast steel)
    const windlassBaseGeo = new THREE.BoxGeometry(1.60, 0.40, 1.10);
    const windlassBase = new THREE.Mesh(windlassBaseGeo, navalSteel);
    windlassBase.position.set(0, 1.55, 12.0);
    deckGroup.add(windlassBase);

    for (const side of [-0.55, 0.55]) {
      const drumGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.45, 12);
      drumGeo.rotateZ(Math.PI / 2);
      const drum = new THREE.Mesh(drumGeo, navalSteel);
      drum.position.set(side, 1.82, 12.0);
      deckGroup.add(drum);
    }

    // Foredeck Mooring Bitts (Cast steel twin posts)
    for (let i = 0; i < 4; i++) {
      const bittGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.45, 10);
      const bittP = new THREE.Mesh(bittGeo, navalSteel);
      bittP.position.set(-1.15, 1.55, 10.2 - i * 2.4);
      deckGroup.add(bittP);

      const bittS = bittP.clone();
      bittS.position.set(1.15, 1.55, 10.2 - i * 2.4);
      deckGroup.add(bittS);
    }

    // Aft deck mooring capstans and towing bitts
    for (let i = 0; i < 3; i++) {
      const cleatGeo = new THREE.BoxGeometry(0.32, 0.16, 0.60);
      const cleatP = new THREE.Mesh(cleatGeo, navalSteel);
      cleatP.position.set(-1.25, 1.35, -8.6 + i * 1.8);
      deckGroup.add(cleatP);

      const cleatS = cleatP.clone();
      cleatS.position.set(1.25, 1.35, -8.6 + i * 1.8);
      deckGroup.add(cleatS);
    }

    // Stern towing winch & hydraulic reel
    const towWinchGeo = new THREE.BoxGeometry(1.8, 0.65, 1.2);
    const towWinch = new THREE.Mesh(towWinchGeo, navalSteel);
    towWinch.position.set(0, 1.62, -7.5);
    deckGroup.add(towWinch);

    this.highPolyProceduralGroup.add(deckGroup);

    /* ════════════════════════ 3. SUPERSTRUCTURE & BRIDGE ════════════════════════ */
    const superGroup = new THREE.Group();

    // ── Tier 1: Lower Accommodation Deckhouse (Off-White) ──
    const t1Geo = new THREE.BoxGeometry(3.05, 1.55, 12.8);
    const t1 = new THREE.Mesh(t1Geo, bridgeWhite);
    t1.position.set(0, 2.02, 1.0);
    t1.castShadow = true;
    t1.receiveShadow = true;
    superGroup.add(t1);

    // ── Tier 2: Navigation Bridge / Wheelhouse (Off-White) ──
    const t2Geo = new THREE.BoxGeometry(3.40, 1.25, 5.2);
    const t2 = new THREE.Mesh(t2Geo, bridgeWhite);
    t2.position.set(0, 3.22, 3.6);
    t2.castShadow = true;
    t2.receiveShadow = true;
    superGroup.add(t2);

    // Bridge Wings (Port & Starboard extended observation balconies)
    const wingGeo = new THREE.BoxGeometry(1.35, 0.14, 3.8);
    const wingP = new THREE.Mesh(wingGeo, bridgeWhite);
    wingP.position.set(-2.38, 3.08, 3.6);
    superGroup.add(wingP);

    const wingS = wingP.clone();
    wingS.position.set(2.38, 3.08, 3.6);
    superGroup.add(wingS);

    // Bridge Wing Safety Railings (Naval steel)
    const wingRailGeo = new THREE.BoxGeometry(0.06, 0.65, 3.8);
    const wingRailP = new THREE.Mesh(wingRailGeo, navalSteel);
    wingRailP.position.set(-3.02, 3.45, 3.6);
    superGroup.add(wingRailP);

    const wingRailS = wingRailP.clone();
    wingRailS.position.set(3.02, 3.45, 3.6);
    superGroup.add(wingRailS);

    // ── Panoramic Bridge Windows (Solar Tinted Glass Ribbon) ──
    const winFwdGeo = new THREE.BoxGeometry(3.42, 0.60, 4.8);
    const winFwd = new THREE.Mesh(winFwdGeo, bridgeGlass);
    winFwd.position.set(0, 3.40, 3.8);
    superGroup.add(winFwd);

    // Bridge Window Mullions (Vertical black dividing bars)
    for (let x = -1.5; x <= 1.5; x += 0.5) {
      const mulGeo = new THREE.BoxGeometry(0.05, 0.62, 0.08);
      const mul = new THREE.Mesh(mulGeo, navalSteel);
      mul.position.set(x, 3.40, 6.22);
      superGroup.add(mul);
    }

    // Cabin Portholes / Deadlights along lower deckhouse
    for (let i = 0; i < 7; i++) {
      const phGeo = new THREE.CircleGeometry(0.16, 12);
      const phP = new THREE.Mesh(phGeo, bridgeGlass);
      phP.position.set(-1.54, 2.10, 5.0 - i * 1.5);
      phP.rotation.y = Math.PI / 2;
      superGroup.add(phP);

      const phS = phP.clone();
      phS.position.set(1.54, 2.10, 5.0 - i * 1.5);
      phS.rotation.y = -Math.PI / 2;
      superGroup.add(phS);
    }

    // Watertight access doors (Cast steel frame with handle)
    const doorGeo = new THREE.BoxGeometry(0.85, 1.30, 0.08);
    const doorFwd = new THREE.Mesh(doorGeo, navalSteel);
    doorFwd.position.set(0, 1.90, 7.42);
    superGroup.add(doorFwd);

    // ── Exhaust Funnel (Maritime Navy Casing + Stripe + Soot Rim) ──
    const funnelGeo = new THREE.CylinderGeometry(0.55, 0.85, 2.6, 20);
    funnelGeo.scale(0.80, 1.0, 1.60);
    const funnel = new THREE.Mesh(funnelGeo, funnelBody);
    funnel.position.set(0, 3.25, -2.8);
    funnel.rotation.x = -0.18;
    funnel.castShadow = true;
    superGroup.add(funnel);

    // Funnel Company Identification Stripe (Emerald / Green Band)
    const stripeGeo = new THREE.CylinderGeometry(0.66, 0.76, 0.65, 20);
    stripeGeo.scale(0.81, 1.0, 1.61);
    const stripe = new THREE.Mesh(stripeGeo, funnelStripe);
    stripe.position.set(0, 3.35, -2.8);
    stripe.rotation.x = -0.18;
    superGroup.add(stripe);

    // Soot-Blackened Exhaust Top Rim
    const frimGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 20);
    const frim = new THREE.Mesh(frimGeo, sootRim);
    funnel.add(frim);
    frim.position.set(0, 1.32, 0);
    frim.rotation.x = Math.PI / 2;

    // Twin Exhaust Stacks inside Funnel Casing
    for (const side of [-0.22, 0.22]) {
      const flueGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.70, 12);
      const flue = new THREE.Mesh(flueGeo, sootRim);
      flue.position.set(side, 4.45, -2.7);
      superGroup.add(flue);
    }

    // ── SOLAS High-Visibility Safety Orange Lifeboats on Davits ──
    for (const side of [-1, 1]) {
      // Davit arms
      const davitGeo = new THREE.BoxGeometry(0.12, 1.80, 0.12);
      const davit = new THREE.Mesh(davitGeo, navalSteel);
      davit.position.set(side * 1.85, 3.0, -1.2);
      superGroup.add(davit);

      // Enclosed modern lifeboat capsule (SOLAS Orange with white roof)
      const boatGroup = new THREE.Group();
      const boatHullGeo = new THREE.CylinderGeometry(0.40, 0.35, 2.6, 12);
      boatHullGeo.rotateX(Math.PI / 2);
      const boatHull = new THREE.Mesh(boatHullGeo, solasOrange);
      boatGroup.add(boatHull);

      const boatRoofGeo = new THREE.CylinderGeometry(0.36, 0.38, 2.4, 12);
      boatRoofGeo.rotateX(Math.PI / 2);
      const boatRoof = new THREE.Mesh(boatRoofGeo, bridgeWhite);
      boatRoof.position.set(0, 0.18, 0);
      boatGroup.add(boatRoof);

      boatGroup.position.set(side * 1.95, 2.50, -1.2);
      superGroup.add(boatGroup);

      // Cylindrical Life Raft Cannisters (SOLAS Orange)
      const raftGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.70, 12);
      raftGeo.rotateX(Math.PI / 2);
      const raft = new THREE.Mesh(raftGeo, solasOrange);
      raft.position.set(side * 1.95, 2.35, -4.0);
      superGroup.add(raft);
    }

    this.highPolyProceduralGroup.add(superGroup);

    /* ════════════════════════ 4. MAST, RADARS & SENSORS ════════════════════════ */
    const mastGroup = new THREE.Group();

    // Primary Naval Steel Lattice Mast Column
    const mastGeo = new THREE.CylinderGeometry(0.10, 0.28, 5.4, 10);
    const mast = new THREE.Mesh(mastGeo, navalSteel);
    mast.position.set(0, 4.65, 2.0);
    mastGroup.add(mast);

    // Mast Crossbar / Yardarm (Signal flag halyard mounts)
    const yardGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.4, 8);
    yardGeo.rotateZ(Math.PI / 2);
    const yard = new THREE.Mesh(yardGeo, navalSteel);
    yard.position.set(0, 6.80, 2.0);
    mastGroup.add(yard);

    // Primary S-Band Long-Range Marine Radar Scanner (Rotating)
    const radarPrimaryGeo = new THREE.BoxGeometry(2.4, 0.22, 0.16);
    this.radarScannerPrimary = new THREE.Mesh(radarPrimaryGeo, bridgeWhite);
    this.radarScannerPrimary.position.set(0, 6.45, 2.0);

    // Orange Safety Endcaps on Radar Antenna
    for (const side of [-1.15, 1.15]) {
      const capGeo = new THREE.BoxGeometry(0.12, 0.24, 0.18);
      const cap = new THREE.Mesh(capGeo, solasOrange);
      cap.position.set(side, 0, 0);
      this.radarScannerPrimary.add(cap);
    }
    mastGroup.add(this.radarScannerPrimary);

    // Secondary X-Band Compact Navigation Radar Scanner (Rotating)
    const radarSecondaryGeo = new THREE.BoxGeometry(1.6, 0.18, 0.14);
    this.radarScannerSecondary = new THREE.Mesh(radarSecondaryGeo, bridgeWhite);
    this.radarScannerSecondary.position.set(0, 5.50, 2.2);
    mastGroup.add(this.radarScannerSecondary);

    // SATCOM Communications Radome (Polar White Dome on pedestal)
    const domeGeo = new THREE.SphereGeometry(0.68, 22, 16);
    const dome = new THREE.Mesh(domeGeo, bridgeWhite);
    dome.position.set(0, 4.25, -0.6);
    mastGroup.add(dome);

    const pedGeo = new THREE.CylinderGeometry(0.20, 0.24, 0.65, 8);
    const ped = new THREE.Mesh(pedGeo, navalSteel);
    ped.position.set(0, 3.82, -0.6);
    mastGroup.add(ped);

    // VHF & AIS Whip Antennas
    for (const x of [-0.4, 0.4]) {
      const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 6);
      const ant = new THREE.Mesh(antGeo, navalSteel);
      ant.position.set(x, 7.8, 2.0);
      mastGroup.add(ant);
    }

    this.highPolyProceduralGroup.add(mastGroup);

    /* ════════════════════════ 5. PROPULSION & STERN DETAILS ════════════════════════ */
    const sternGroup = new THREE.Group();

    // Twin Screws / Bronze Propellers & Propeller Shafts
    for (const side of [-0.90, 0.90]) {
      const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 10);
      shaftGeo.rotateX(Math.PI / 2);
      const shaft = new THREE.Mesh(shaftGeo, navalSteel);
      shaft.position.set(side, -0.42, -11.6);
      sternGroup.add(shaft);

      // Bronze Propeller Hub
      const hubGeo = new THREE.SphereGeometry(0.24, 12, 10);
      const hub = new THREE.Mesh(hubGeo, bronze);
      hub.position.set(side, -0.42, -13.0);
      sternGroup.add(hub);

      // 4-Bladed Propeller
      for (let b = 0; b < 4; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.06, 0.48, 0.22);
        bladeGeo.rotateZ((b * Math.PI) / 2);
        const blade = new THREE.Mesh(bladeGeo, bronze);
        hub.add(blade);
      }

      // High-Efficiency Semi-Balanced Rudder behind propeller
      const rudderGeo = new THREE.BoxGeometry(0.08, 1.4, 0.85);
      const rudder = new THREE.Mesh(rudderGeo, hullSteel);
      rudder.position.set(side, -0.38, -13.8);
      sternGroup.add(rudder);
    }

    // Aft Deck Hydraulic Crane for launch & recovery
    const craneBaseGeo = new THREE.CylinderGeometry(0.28, 0.32, 1.2, 12);
    const craneBase = new THREE.Mesh(craneBaseGeo, solasOrange);
    craneBase.position.set(-1.0, 1.8, -6.0);
    sternGroup.add(craneBase);

    const boomGeo = new THREE.BoxGeometry(0.14, 0.18, 3.6);
    const boom = new THREE.Mesh(boomGeo, solasOrange);
    boom.position.set(-0.8, 2.5, -4.5);
    boom.rotation.x = -0.22;
    sternGroup.add(boom);

    this.highPolyProceduralGroup.add(sternGroup);

    // Add IMO Regulation Navigation Point Lights
    this.addNavigationLights();
  }

  /**
   * Loads the authentic Kotor-Class Frigate FBX model with real Pallete128 texture
   */
  private loadKotorFrigate() {
    const fbxLoader = new FBXLoader();
    fbxLoader.setResourcePath('/models/');

    // Load authentic ship palette texture
    const textureLoader = new THREE.TextureLoader();
    const paletteTexture = textureLoader.load(
      '/models/Pallete128.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
      }
    );

    fbxLoader.load(
      '/models/Kotor-ClassFrigate.fbx',
      (fbx) => {
        this.shipModel = fbx;

        const SCALE = 2.85;
        fbx.scale.set(SCALE, SCALE, SCALE);
        fbx.position.set(0, 0.88, 0);

        fbx.traverse((child) => {
          if (child.name === 'RadarTurret') {
            this.radarScannerPrimary = child;
          }

          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = mesh.name.toLowerCase();

            // Hide weapons, cannons, missile tubes for a modern maritime surveillance vessel look
            if (
              name.includes('cannon') ||
              name.includes('ak726') ||
              name.includes('ak230') ||
              name.includes('p15') ||
              (name.includes('turret') && !name.includes('radar'))
            ) {
              mesh.visible = false;
              return;
            }

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.geometry?.computeVertexNormals();

            // Apply authentic ship palette texture with realistic industrial marine PBR response
            mesh.material = new THREE.MeshStandardMaterial({
              map:             paletteTexture,
              roughness:       0.62,
              metalness:       0.24,
              envMapIntensity: 0.90,
            });
          }
        });

        this.addNavigationLights();

        // Switch smoothly to the loaded textured model
        this.highPolyProceduralGroup.visible = false;
        this.group.add(this.shipModel);
        this.isLoaded = true;
      },
      undefined,
      (err) => {
        console.warn('[Vessel] Retaining procedural authentic maritime vessel:', err);
      }
    );
  }

  /**
   * Official IMO Navigation Lights (Red Port, Green Starboard, White Masthead)
   */
  private addNavigationLights() {
    const target = this.shipModel || this.highPolyProceduralGroup;

    // Starboard Green navigation light (112.5° sector light)
    const greenLight = new THREE.PointLight(0x00FF88, 2.2, 18);
    greenLight.position.set(-1.6, 3.4, 3.8);
    target.add(greenLight);

    // Port Red navigation light (112.5° sector light)
    const redLight = new THREE.PointLight(0xFF2244, 2.2, 18);
    redLight.position.set(1.6, 3.4, 3.8);
    target.add(redLight);

    // Forward Masthead 225° White running light
    const whiteLight = new THREE.PointLight(0xFFFFFF, 2.8, 22);
    whiteLight.position.set(0, 6.8, 2.0);
    target.add(whiteLight);

    // Stern 135° White light
    const sternLight = new THREE.PointLight(0xFFFFFF, 1.8, 14);
    sternLight.position.set(0, 1.8, -12.2);
    target.add(sternLight);
  }

  /**
   * Controlled Cursor Steering
   */
  public setCursorSteering(cursorX: number) {
    this.targetRudder = -cursorX * 0.14;
  }

  /**
   * Update vessel motion, heavy displacement hydrodynamics, and stern wake origin
   */
  public update(time: number, delta: number, wBow: number, wStern: number) {
    // 1. Radar scanner rotations (Primary & Secondary rotating at realistic radar sweeps)
    if (this.radarScannerPrimary) {
      this.radarScannerPrimary.rotation.y += delta * 2.8;
    }
    if (this.radarScannerSecondary) {
      this.radarScannerSecondary.rotation.y += delta * 3.6;
    }

    // 2. Controlled Steering Physics & Heading
    const rudderResponse = Math.min(1.0, delta * 2.0);
    this.currentRudder += (this.targetRudder - this.currentRudder) * rudderResponse;

    // Heading advances with rudder and forward velocity
    this.currentYaw += this.currentRudder * (this.forwardSpeed * 0.038) * delta;

    // Centripetal inward/outward roll during racing turn
    const turnInducedRoll = -this.currentRudder * 0.35;

    // 3. Heavy Displacement Pitch & Heave
    const targetPitch = Math.atan2(wBow - wStern, 23.0) * 0.65 + 0.028;
    const meanWave    = (wBow + wStern) * 0.5;
    const targetY     = meanWave * 0.50 + 0.08;

    // Wave swell gentle roll combined with turn roll
    const waveRoll    = Math.sin(time * 0.90) * 0.022;
    const targetRoll  = turnInducedRoll + waveRoll;

    const lerpRate = Math.min(1.0, delta * 3.8);
    this.currentPitch += (targetPitch - this.currentPitch) * lerpRate;
    this.currentRoll  += (targetRoll  - this.currentRoll)  * lerpRate;
    this.currentY     += (targetY     - this.currentY)     * lerpRate;

    // 4. Continuous Forward Transit along Heading
    this.group.position.x += Math.sin(this.currentYaw) * (this.forwardSpeed * delta);
    this.group.position.z += Math.cos(this.currentYaw) * (this.forwardSpeed * delta);

    // Apply orientation
    this.group.position.y = this.currentY;
    this.group.rotation.x = this.currentPitch;
    this.group.rotation.z = this.currentRoll;
    this.group.rotation.y = this.currentYaw;

    // 5. Compute exact Stern position in World Space for physical wake attachment
    const sternLocal = new THREE.Vector3(0, 0, -10.5);
    this.sternWorldPos.copy(this.group.localToWorld(sternLocal));

    const bowLocal = new THREE.Vector3(0, 0, 12.0);
    this.bowWorldPos.copy(this.group.localToWorld(bowLocal));

    this.headingAngle = this.currentYaw;
    this.velocityVector.set(Math.sin(this.currentYaw), 0, Math.cos(this.currentYaw));
  }

  public dispose() {
    this.shipModel?.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });

    this.highPolyProceduralGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });

    this.pbrTextures.albedoMap.dispose();
    this.pbrTextures.normalMap.dispose();
    this.pbrTextures.roughnessMap.dispose();
    this.pbrTextures.metalnessMap.dispose();
  }
}

export default Vessel;
