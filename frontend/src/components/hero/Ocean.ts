import * as THREE from 'three';

/* ================================================================
   OCEAN — Physically-Grounded Deep Marine Ocean Shader
   ─────────────────────────────────────────────────────────────
   Targets high-end photorealism:
   - 8-harmonic Gerstner waves with multi-scale dispersion
   - Deep marine absorption palette: #061522 abyss, #0A2035 deep, #0B3552 ocean
   - Schlick Fresnel reflectance with water IOR = 1.333 (F0 = 0.02)
   - Micro-normal surface perturbation for fluid optical detail
   - Natural sky environment reflection & restrained sun specular glints
   - Crest foam breakup & soft atmospheric perspective fog
   ================================================================ */

export class Ocean {
  public mesh: THREE.Mesh;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.ShaderMaterial;

  constructor(size = 900, segments = 512) {
    this.geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:           { value: 0.0 },
        uScrollProgress: { value: 0.0 },
        // Strictly Dark Blue & Navy Blue Palette — NO white shades
        uAbyssColor:     { value: new THREE.Color('#061224') }, // Deep Navy
        uDeepColor:      { value: new THREE.Color('#0A1C36') }, // Dark Navy
        uOceanColor:     { value: new THREE.Color('#0D254C') }, // Navy Blue
        uSurfaceColor:   { value: new THREE.Color('#102E5C') }, // Dark Blue
        uCrestColor:     { value: new THREE.Color('#163B75') }, // Navy Crest
        uFoamColor:      { value: new THREE.Color('#0F2952') }, // Dark Navy Foam (NO white)
        uSunColor:       { value: new THREE.Color('#1B3A6B') }, // Navy Blue Specular (NO white)
        uSkyZenith:      { value: new THREE.Color('#08152B') }, // Deep Navy Zenith
        uSkyHorizon:     { value: new THREE.Color('#0E2244') }, // Dark Navy Horizon
        uSunDir:         { value: new THREE.Vector3(-0.45, 0.75, -0.48).normalize() },
      },

      vertexShader: /* glsl */`
        #define PI 3.14159265358979

        uniform float uTime;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vElevation;
        varying float vFoam;
        varying float vDepthFog;
        varying vec3 vTangent;
        varying vec3 vBitangent;

        /* Gerstner wave displacement */
        vec3 gerstner(vec2 pos, vec2 dir, float k, float a, float Q, float spd, float t) {
          float w     = sqrt(9.81 * k);
          float phase = k * dot(dir, pos) - w * spd * t;
          float s = sin(phase);
          float c = cos(phase);
          return vec3(Q * a * dir.x * c, a * s, Q * a * dir.y * c);
        }

        /* Gerstner normal contribution */
        vec3 gerstnerNormal(vec2 pos, vec2 dir, float k, float a, float Q, float spd, float t) {
          float w     = sqrt(9.81 * k);
          float phase = k * dot(dir, pos) - w * spd * t;
          float WA = k * a;
          return vec3(-dir.x * WA * cos(phase), -Q * WA * sin(phase), -dir.y * WA * cos(phase));
        }

        void main() {
          vec3 pos = position;
          vec2 xz  = pos.xz;
          float t  = uTime * 0.95;

          /* ── Multi-Scale Gerstner Waves (Deep Ocean Physics) ── */

          // Long primary ocean swell
          vec2  d1 = normalize(vec2(0.20, -0.98));
          float k1 = 2.0 * PI / 64.0;
          vec3  w1 = gerstner(xz, d1, k1, 0.45, 0.45, 1.05, t);
          vec3  n1 = gerstnerNormal(xz, d1, k1, 0.45, 0.45, 1.05, t);

          // Secondary cross-swell
          vec2  d2 = normalize(vec2(-0.48, -0.88));
          float k2 = 2.0 * PI / 42.0;
          vec3  w2 = gerstner(xz, d2, k2, 0.28, 0.40, 0.95, t);
          vec3  n2 = gerstnerNormal(xz, d2, k2, 0.28, 0.40, 0.95, t);

          // Mid wind waves
          vec2  d3 = normalize(vec2(0.68, -0.73));
          float k3 = 2.0 * PI / 24.0;
          vec3  w3 = gerstner(xz, d3, k3, 0.15, 0.35, 1.25, t);
          vec3  n3 = gerstnerNormal(xz, d3, k3, 0.15, 0.35, 1.25, t);

          // Short surface chop
          vec2  d4 = normalize(vec2(-0.35, -0.94));
          float k4 = 2.0 * PI / 12.0;
          vec3  w4 = gerstner(xz, d4, k4, 0.08, 0.30, 1.45, t);
          vec3  n4 = gerstnerNormal(xz, d4, k4, 0.08, 0.30, 1.45, t);

          // Capillary ripples
          vec2  d5 = normalize(vec2(0.85, -0.52));
          float k5 = 2.0 * PI / 6.0;
          vec3  w5 = gerstner(xz, d5, k5, 0.035, 0.25, 1.75, t);
          vec3  n5 = gerstnerNormal(xz, d5, k5, 0.035, 0.25, 1.75, t);

          vec3 totalDisp = w1 + w2 + w3 + w4 + w5;
          vec3 totalNorm = n1 + n2 + n3 + n4 + n5;

          pos += totalDisp;
          vElevation = totalDisp.y;

          // Foam on peak curvature
          vFoam = smoothstep(0.32, 0.72, vElevation);

          vec3 N = normalize(vec3(0.0, 1.0, 0.0) + totalNorm);
          vNormal = normalize((modelMatrix * vec4(N, 0.0)).xyz);

          // Tangent frame for micro-normal mapping
          vec3 T = normalize(cross(N, vec3(0.0, 0.0, 1.0)));
          vec3 B = cross(N, T);
          vTangent   = normalize((modelMatrix * vec4(T, 0.0)).xyz);
          vBitangent = normalize((modelMatrix * vec4(B, 0.0)).xyz);

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          float camDist = length(vWorldPosition - cameraPosition);
          vDepthFog = smoothstep(140.0, 650.0, camDist);

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,

      fragmentShader: /* glsl */`
        precision highp float;

        uniform float uTime;
        uniform vec3  uAbyssColor;
        uniform vec3  uDeepColor;
        uniform vec3  uOceanColor;
        uniform vec3  uSurfaceColor;
        uniform vec3  uCrestColor;
        uniform vec3  uFoamColor;
        uniform vec3  uSunColor;
        uniform vec3  uSkyZenith;
        uniform vec3  uSkyHorizon;
        uniform vec3  uSunDir;

        varying vec3  vNormal;
        varying vec3  vWorldPosition;
        varying float vElevation;
        varying float vFoam;
        varying float vDepthFog;
        varying vec3  vTangent;
        varying vec3  vBitangent;

        /* Procedural Noise */
        float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2  r = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = r * p * 2.05;
            a *= 0.48;
          }
          return v;
        }

        void main() {
          vec3 V = normalize(cameraPosition - vWorldPosition);
          vec3 L = uSunDir;
          vec2 xz = vWorldPosition.xz;
          float t = uTime;

          // ── 1. High-Resolution Micro-Normal Surface Facets ──
          float eps = 0.05;
          vec2 scrollA = vec2(t * 0.12, -t * 0.65);
          vec2 scrollB = vec2(-t * 0.18, -t * 0.95);

          float hC  = fbm(xz * 0.25 + scrollA) + fbm(xz * 0.55 + scrollB) * 0.5;
          float hRx = fbm((xz + vec2(eps, 0.0)) * 0.25 + scrollA) + fbm((xz + vec2(eps, 0.0)) * 0.55 + scrollB) * 0.5;
          float hRz = fbm((xz + vec2(0.0, eps)) * 0.25 + scrollA) + fbm((xz + vec2(0.0, eps)) * 0.55 + scrollB) * 0.5;

          vec3 microNormal = normalize(vec3(
            (hC - hRx) / eps * 0.09,
            1.0,
            (hC - hRz) / eps * 0.09
          ));

          vec3 N = normalize(
            vTangent   * microNormal.x +
            vNormal    * microNormal.y +
            vBitangent * microNormal.z
          );

          // ── 2. Physically-Correct Schlick Fresnel (F0 = 0.02 for water IOR 1.333) ──
          float cosTheta = clamp(dot(N, V), 0.0, 1.0);
          float fresnel  = 0.02 + 0.98 * pow(1.0 - cosTheta, 5.0);

          // ── 3. Depth-Based Volumetric Color Absorption (Deep Marine Palette) ──
          float depthFactor = smoothstep(-0.60, 0.70, vElevation);
          vec3 waterCol = mix(uAbyssColor, uDeepColor, smoothstep(0.0, 0.35, depthFactor));
          waterCol = mix(waterCol, uOceanColor, smoothstep(0.35, 0.68, depthFactor));
          waterCol = mix(waterCol, uSurfaceColor, smoothstep(0.68, 0.92, depthFactor));

          // ── 4. Subsurface Scattering (Wave Crest Translucency) ──
          float sssForward = pow(clamp(dot(V, -L), 0.0, 1.0), 3.0);
          float sssPeak    = smoothstep(0.10, 0.55, vElevation);
          float sssAmount  = (sssForward * 0.50 + sssPeak * 0.45) * (1.0 - fresnel * 0.6);
          waterCol = mix(waterCol, uCrestColor, sssAmount * 0.55);

          // Ambient & directional solar diffuse
          float diff = max(dot(N, L), 0.0);
          waterCol *= (0.85 + 0.25 * diff);

          // ── 5. Cool Sky Environment Reflection ──
          vec3 R = reflect(-V, N);
          float skyGrad = smoothstep(-0.05, 0.85, max(0.0, R.y));
          vec3 reflectedSky = mix(uSkyHorizon, uSkyZenith, skyGrad);
          waterCol = mix(waterCol, reflectedSky, fresnel * 0.75);

          // ── 6. Restrained PBR Sun Glitter (Controlled Glints, No Blowout) ──
          vec3 H = normalize(L + V);
          float nH = max(dot(N, H), 0.0);

          float specBroad   = pow(nH, 48.0)  * 0.22; // soft sun reflection corridor
          float specGlint   = pow(nH, 180.0) * 0.95; // crisp glint
          float specDiamond = pow(nH, 600.0) * 2.50; // diamond point sparkle
          float totalSpec   = (specBroad + specGlint + specDiamond) * fresnel;

          waterCol += uSunColor * totalSpec;

          // ── 7. Organic Wave Crest Foam ──
          float foamNoise = fbm(xz * 0.5 + vec2(t * 0.25, -t * 0.8));
          float rawFoam = vFoam * (foamNoise * 0.75 + 0.25);
          float finalFoam = smoothstep(0.35, 0.68, rawFoam) * 0.80;
          waterCol = mix(waterCol, uFoamColor, finalFoam);

          // ── 8. Atmospheric Perspective Fog Blending (Navy & Royal Horizon) ──
          vec3 fogCol = mix(uSkyHorizon, vec3(0.10, 0.24, 0.50), 0.40);
          waterCol = mix(waterCol, fogCol, vDepthFog * 0.85);

          gl_FragColor = vec4(waterCol, 0.98);
        }
      `,
      transparent: true,
      depthWrite:  true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.name = 'ocean';
  }

  public update(time: number, scrollProgress = 0.0) {
    this.material.uniforms.uTime.value           = time;
    this.material.uniforms.uScrollProgress.value = scrollProgress;
  }

  /**
   * Real-time physical wave height calculation for ship buoyancy.
   */
  public getWaveHeightAt(x: number, z: number, time: number): number {
    const t = time * 0.95;
    const PI = Math.PI;

    const k1 = (2.0 * PI) / 64.0;
    const p1 = k1 * (0.20 * x - 0.98 * z) - Math.sqrt(9.81 * k1) * 1.05 * t;

    const k2 = (2.0 * PI) / 42.0;
    const p2 = k2 * (-0.48 * x - 0.88 * z) - Math.sqrt(9.81 * k2) * 0.95 * t;

    const k3 = (2.0 * PI) / 24.0;
    const p3 = k3 * (0.68 * x - 0.73 * z) - Math.sqrt(9.81 * k3) * 1.25 * t;

    return 0.45 * Math.sin(p1) + 0.28 * Math.sin(p2) + 0.15 * Math.sin(p3);
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
