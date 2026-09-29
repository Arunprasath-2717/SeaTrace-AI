import * as THREE from 'three';

/* ================================================================
   WAKE — Photorealistic Racing Kelvin Wake
   ────────────────────────────────────────
   Simulates authentic high-speed powerboat / vessel stern wake:
   - Soft, aerated central propeller wash behind twin stern screws
   - Expanding Kelvin V-shaped wake shoulders (~19.5°)
   - Velvety micro-foam turbulence with smooth Gaussian falloff
   - Zero sharp stepped lines or jagged staircases
   ================================================================ */

export class Wake {
  public mesh: THREE.Mesh;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;

  constructor(length = 150, maxWidth = 42) {
    const segments = 140;
    const vertices: number[] = [];
    const uvs:      number[] = [];
    const indices:  number[] = [];

    /* Smooth expanding wake ribbon originating at stern */
    for (let i = 0; i <= segments; i++) {
      const v = i / segments;

      // Smooth parabolic Kelvin wake expansion
      const kelvinExpansion = Math.tan(THREE.MathUtils.degToRad(19.5));
      const width = 3.6 + (maxWidth - 3.6) * Math.pow(v, 0.72) * kelvinExpansion * 2.6;
      const z = -v * length;

      // Left vertex
      vertices.push(-width * 0.5, 0.05, z);
      uvs.push(0.0, v);

      // Right vertex
      vertices.push( width * 0.5, 0.05, z);
      uvs.push(1.0, v);

      if (i < segments) {
        const r1 = i * 2;
        const r2 = (i + 1) * 2;
        indices.push(r1, r1 + 1, r2);
        indices.push(r1 + 1, r2 + 1, r2);
      }
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
    this.geometry.setIndex(indices);
    this.geometry.computeVertexNormals();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:        { value: 0.0 },
        uSpeed:       { value: 12.5 },
        uFoamColor:   { value: new THREE.Color('#FFFFFF') },
        uWaterColor:  { value: new THREE.Color('#0D254C') },
        uTealDisturb: { value: new THREE.Color('#E0F2FE') },
      },

      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: /* glsl */`
        precision highp float;

        uniform float uTime;
        uniform float uSpeed;
        uniform vec3  uFoamColor;
        uniform vec3  uWaterColor;
        uniform vec3  uTealDisturb;

        varying vec2 vUv;

        // Smooth simplex-like hash & noise
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float gnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
            mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * gnoise(p);
            p = p * 2.05;
            a *= 0.5;
          }
          return v * 0.5 + 0.5;
        }

        void main() {
          float u = vUv.x;
          float v = vUv.y;
          float centerDist = abs(u - 0.5) * 2.0; // 0 at center keel, 1 at lateral edge

          // ── 1. Twin Propeller Wash Core (Behind stern screws) ──
          // Smooth Gaussian central trough
          float propCore = exp(-centerDist * centerDist * 16.0);
          float washNoise = fbm(vec2(u * 12.0, v * 24.0 - uTime * 7.5));
          float washDetail = fbm(vec2(u * 28.0, v * 52.0 - uTime * 14.0));
          float propFroth = propCore * (washNoise * 0.65 + washDetail * 0.35) * (1.0 - pow(v, 0.65));

          // ── 2. Diverging Kelvin Wave V-Wings (19.5° smooth envelope) ──
          float kelvinProfile = 0.58 * pow(v, 0.78);
          float distToWing = abs(centerDist - kelvinProfile);
          // Soft Gaussian crest
          float wingCrest = exp(-distToWing * distToWing * 45.0) * (1.0 - v * 0.55);
          float wingNoise = fbm(vec2(u * 18.0, v * 20.0 - uTime * 3.5));
          wingCrest *= (0.6 + 0.4 * wingNoise);

          // ── 3. Transverse Rolling Stern Sinks ──
          float wavePulse = sin(v * 42.0 - uTime * 6.0) * 0.5 + 0.5;
          float pulseFoam = wavePulse * exp(-centerDist * centerDist * 6.0) * (1.0 - v) * 0.25;

          // Combined smooth foam density
          float foamDensity = clamp(propFroth * 1.5 + wingCrest * 1.25 + pulseFoam, 0.0, 1.0);

          // Smooth edge falloff
          float lateralFalloff = smoothstep(1.0, 0.65, centerDist);
          float tailFalloff    = smoothstep(1.0, 0.75, v);
          float dissipation    = lateralFalloff * tailFalloff;

          // Color blend: Turquoise disturbed water base -> Brilliant pure white aerated foam
          vec3 disturbedBase = mix(uWaterColor, uTealDisturb, (1.0 - centerDist * 0.5));
          vec3 finalColor = mix(disturbedBase, uFoamColor, smoothstep(0.18, 0.70, foamDensity));

          float finalAlpha = smoothstep(0.05, 0.65, foamDensity) * dissipation * 0.92;

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = 2;
  }

  public update(time: number, sternPos: THREE.Vector3, heading: number, speed: number) {
    this.material.uniforms.uTime.value  = time;
    this.material.uniforms.uSpeed.value = speed;

    this.mesh.position.set(sternPos.x, 0.06, sternPos.z);
    this.mesh.rotation.y = heading;
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default Wake;
