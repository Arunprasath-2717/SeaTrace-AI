import * as THREE from 'three';

/* ================================================================
   WATER SPRAY — High-Speed Marine Racing Water Spray & Rooster Tail
   ─────────────────────────────────────────────────────────────────
   Authentic offshore powerboat / racing vessel hydrodynamics:
   - High-velocity Stern Rooster Tail: Massive arched plumes of white
     water spray blasting up from the twin stern propellers
   - Bow Cutwater Spray: Water slicing outwards from the raked bow
     and atomizing into airborne mist
   - Gravity, turbulent aerosol dispersal, and high forward rush
   ================================================================ */

export class WaterSpray {
  public group: THREE.Group;
  private particleCount = 1600;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private particles: THREE.Points;

  // Particle state arrays (world space simulation)
  private positions:    Float32Array;
  private velocities:   Float32Array;
  private lifetimes:    Float32Array;
  private maxLifetimes: Float32Array;
  private types:        Uint8Array; // 0 = stern rooster tail, 1 = bow spray

  constructor() {
    this.group = new THREE.Group();

    const count = this.particleCount;
    this.positions    = new Float32Array(count * 3);
    this.velocities   = new Float32Array(count * 3);
    this.lifetimes    = new Float32Array(count);
    this.maxLifetimes = new Float32Array(count);
    this.types        = new Uint8Array(count);

    // Split particles: 65% stern rooster tail spray, 35% bow slicing spray
    for (let i = 0; i < count; i++) {
      this.types[i] = i < count * 0.65 ? 0 : 1;
      this.resetParticle(i, new THREE.Vector3(), 0, true);
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    // Custom soft-edged droplet radial gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.35, 'rgba(240, 250, 255, 0.92)');
      grad.addColorStop(0.70, 'rgba(215, 235, 255, 0.45)');
      grad.addColorStop(1.00, 'rgba(180, 220, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    this.material = new THREE.PointsMaterial({
      size: 2.1,
      map: texture,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: 0xFFFFFF,
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.group.add(this.particles);
  }

  private resetParticle(i: number, vesselPos: THREE.Vector3, heading: number, initial = false) {
    const isStern = this.types[i] === 0;
    const sinH = Math.sin(heading);
    const cosH = Math.cos(heading);

    const idx = i * 3;

    if (isStern) {
      // ── Stern Rooster Tail Plume ──
      // Twin propeller positions at transom
      const side = Math.random() < 0.5 ? -1 : 1;
      const localX = side * (0.8 + Math.random() * 0.9);
      const localY = 0.15 + Math.random() * 0.35;
      const localZ = -10.5 - Math.random() * 1.5;

      // Transform local spawn to world space
      this.positions[idx]     = vesselPos.x + (localX * cosH + localZ * sinH);
      this.positions[idx + 1] = vesselPos.y + localY;
      this.positions[idx + 2] = vesselPos.z + (-localX * sinH + localZ * cosH);

      // Explosive upward rooster tail arc + backward blast + lateral turbulence
      const upSpeed   = 8.0 + Math.random() * 9.5;    // High arched roostertail
      const backSpeed = 16.0 + Math.random() * 12.0;  // Blasting back behind transom
      const latSpeed  = side * (2.0 + Math.random() * 3.5);

      const vxLocal = latSpeed;
      const vzLocal = -backSpeed;

      this.velocities[idx]     = vxLocal * cosH + vzLocal * sinH;
      this.velocities[idx + 1] = upSpeed;
      this.velocities[idx + 2] = -vxLocal * sinH + vzLocal * cosH;

      const dur = 0.65 + Math.random() * 0.45;
      this.maxLifetimes[i] = dur;
      this.lifetimes[i]    = initial ? Math.random() * dur : 0.0;

    } else {
      // ── Bow Cutwater Spray Sheets ──
      const side = Math.random() < 0.5 ? -1 : 1;
      const localX = side * (0.35 + Math.random() * 0.6);
      const localY = 0.20 + Math.random() * 0.45;
      const localZ = 10.5 + Math.random() * 2.2;

      this.positions[idx]     = vesselPos.x + (localX * cosH + localZ * sinH);
      this.positions[idx + 1] = vesselPos.y + localY;
      this.positions[idx + 2] = vesselPos.z + (-localX * sinH + localZ * cosH);

      // Flaring outwards sideways, upward curl, swept back by speed
      const outSpeed  = side * (5.5 + Math.random() * 6.5);
      const upSpeed   = 3.5 + Math.random() * 5.0;
      const backSpeed = 10.0 + Math.random() * 8.0;

      const vxLocal = outSpeed;
      const vzLocal = -backSpeed;

      this.velocities[idx]     = vxLocal * cosH + vzLocal * sinH;
      this.velocities[idx + 1] = upSpeed;
      this.velocities[idx + 2] = -vxLocal * sinH + vzLocal * cosH;

      const dur = 0.48 + Math.random() * 0.38;
      this.maxLifetimes[i] = dur;
      this.lifetimes[i]    = initial ? Math.random() * dur : 0.0;
    }
  }

  public update(delta: number, _time: number, vesselPos: THREE.Vector3, heading: number, _speed: number) {
    const count = this.particleCount;
    const pos = this.positions;
    const vel = this.velocities;
    const life = this.lifetimes;
    const maxL = this.maxLifetimes;

    const gravity = 22.0; // Rapid ocean gravity pulls spray back into swells

    for (let i = 0; i < count; i++) {
      life[i] += delta;
      if (life[i] >= maxL[i]) {
        this.resetParticle(i, vesselPos, heading);
        continue;
      }

      const idx = i * 3;

      // Gravity pulls droplets down
      vel[idx + 1] -= gravity * delta;

      // Aerodynamic air drag
      vel[idx]     *= Math.max(0.0, 1.0 - 0.9 * delta);
      vel[idx + 2] *= Math.max(0.0, 1.0 - 0.7 * delta);

      // Position update in world space
      pos[idx]     += vel[idx]     * delta;
      pos[idx + 1] += vel[idx + 1] * delta;
      pos[idx + 2] += vel[idx + 2] * delta;

      // Spray dissolves upon plunging below ocean surface
      if (pos[idx + 1] < 0.02) {
        this.resetParticle(i, vesselPos, heading);
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default WaterSpray;
