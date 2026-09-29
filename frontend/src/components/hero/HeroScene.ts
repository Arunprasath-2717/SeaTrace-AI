import * as THREE from 'three';
import { Ocean }      from './Ocean';
import { Vessel }     from './Vessel';
import { Wake }       from './Wake';
import { WaterSpray } from './WaterSpray';

/* ================================================================
   HERO SCENE — Pinned 360-Degree Orbital Cinematic Camera Rig
   ───────────────────────────────────────────────────────────
   White-Themed Coastal Maritime Environment:
   - Sunlit azure ocean and luminous pearl horizon
   - Pure brilliant white high-speed racing vessel
   - Dual stern rooster tail spray + bow cutwater spray
   - Pinned 360° camera orbit synchronized with hero scroll
   ================================================================ */

export interface HeroSceneOptions {
  canvas:   HTMLCanvasElement;
  onReady?: () => void;
  onError?: (err: Error) => void;
}

export class HeroScene {
  private canvas:      HTMLCanvasElement;
  private renderer:    THREE.WebGLRenderer | null = null;
  private scene:       THREE.Scene;
  private camera:      THREE.PerspectiveCamera;
  private ocean:       Ocean;
  private vessel:      Vessel;
  private wake:        Wake;
  private waterSpray:  WaterSpray;
  private skyDome:     THREE.Mesh;
  private clock:       THREE.Clock;

  /* Lights */
  private ambientLight: THREE.AmbientLight;
  private sunLight:     THREE.DirectionalLight;
  private rimLight:     THREE.DirectionalLight;
  private hemiLight:    THREE.HemisphereLight;

  /* Mouse Parallax State */
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  /* Scroll-Driven Pinned Cinematic Orbit State */
  private scrollProgress       = 0.0;
  private targetScrollProgress = 0.0;

  /* Damped Camera Rig Vectors */
  private currentCamPos  = new THREE.Vector3(0, 16, -26);
  private currentLookPos = new THREE.Vector3(0, 1.8, 2.5);

  private isReducedMotion = false;
  private isVisible       = true;
  private animFrameId:     number | null = null;
  private resizeObserver:  ResizeObserver | null = null;

  constructor(options: HeroSceneOptions) {
    this.canvas = options.canvas;

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mq.matches;
      mq.addEventListener('change', e => { this.isReducedMotion = e.matches; });
    }

    try {
      /* ── 1. Renderer — High-Fidelity PBR ── */
      this.renderer = new THREE.WebGLRenderer({
        canvas:          this.canvas,
        antialias:       true,
        alpha:           false,
        powerPreference: 'high-performance',
      });
      // Deep rich navy blue clear color (never black)
      this.renderer.setClearColor(0x0A1935, 1.0);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      this.renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;
      this.renderer.shadowMap.enabled   = true;
      this.renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
      this.renderer.outputColorSpace    = THREE.SRGBColorSpace;

      /* ── 2. Scene & Deep Navy Maritime Fog (Not Black) ── */
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0B2044, 0.0014);

      /* ── 3. Camera Rig Setup ── */
      const w = this.canvas.clientWidth  || window.innerWidth;
      const h = this.canvas.clientHeight || window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(42, w / h, 0.4, 1200);

      // Initial high rear / aerial position
      this.camera.position.set(0, 16, -26);
      this.camera.lookAt(0, 1.8, 2.5);

      /* ── 4. Atmospheric Sky Dome (Deep Navy, Royal Blue, & Marine Horizon) ── */
      const skyGeo = new THREE.SphereGeometry(750, 48, 24);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uSunDir: { value: new THREE.Vector3(-0.45, 0.75, -0.48).normalize() },
        },
        vertexShader: /* glsl */`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: /* glsl */`
          uniform vec3 uSunDir;
          varying vec3 vWorldPosition;
          void main() {
            vec3 dir = normalize(vWorldPosition);
            float h = max(dir.y, 0.0);

            // Rich oceanic navy, royal blue, and dark marine sky (NOT black)
            vec3 zenith  = vec3(0.045, 0.105, 0.220); // Deep Navy Blue #0B1B38
            vec3 midSky  = vec3(0.075, 0.170, 0.340); // Dark Royal Navy #132B57
            vec3 horizon = vec3(0.120, 0.260, 0.490); // Luminous Royal Marine #1F427D

            vec3 col = mix(horizon, midSky, smoothstep(0.0, 0.35, h));
            col = mix(col, zenith, smoothstep(0.35, 0.90, h));

            // Moonlight / celestial light source
            float sunAngle = max(dot(dir, uSunDir), 0.0);
            float moonGlow = pow(sunAngle, 12.0) * 0.14;
            float moonDisc = pow(sunAngle, 600.0) * 0.65;
            col += vec3(0.85, 0.92, 1.0) * (moonGlow + moonDisc);

            // Stars — sparse procedural dots
            float starSeed = fract(sin(dot(dir.xz, vec2(127.1, 311.7))) * 43758.5453);
            float star = step(0.992, starSeed) * smoothstep(0.08, 0.30, h) * 0.75;
            col += vec3(0.85, 0.95, 1.0) * star;

            if (dir.y < 0.0) {
              col = mix(vec3(0.04, 0.09, 0.18), horizon, smoothstep(-0.35, 0.0, dir.y));
            }

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      this.skyDome = new THREE.Mesh(skyGeo, skyMat);
      this.scene.add(this.skyDome);

      /* ── 5. Generate Environment Map for PBR Reflections ── */
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileCubemapShader();
      const envRT = pmremGenerator.fromScene(this.scene, 0, 0.1, 1000);
      this.scene.environment = envRT.texture;
      pmremGenerator.dispose();

      /* ── 6. Luminous Navy & Royal Maritime Lighting ── */
      // Hemisphere: vibrant royal blue sky above, deep navy sea below
      this.hemiLight = new THREE.HemisphereLight(0x2563EB, 0x0A1935, 0.85);
      this.scene.add(this.hemiLight);

      // Ambient fill revealing the royal/navy water and vessel
      this.ambientLight = new THREE.AmbientLight(0x1D4ED8, 0.50);
      this.scene.add(this.ambientLight);

      // Primary key light: crisp daylight / moonlight key
      this.sunLight = new THREE.DirectionalLight(0xE0F0FE, 2.7);
      this.sunLight.position.set(-70, 120, -60);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width  = 2048;
      this.sunLight.shadow.mapSize.height = 2048;
      this.sunLight.shadow.camera.near = 5;
      this.sunLight.shadow.camera.far  = 350;
      this.sunLight.shadow.camera.left  = -55;
      this.sunLight.shadow.camera.right =  55;
      this.sunLight.shadow.camera.top   =  55;
      this.sunLight.shadow.camera.bottom = -55;
      this.sunLight.shadow.bias = -0.0003;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);

      // Rim: vibrant royal/azure rim defining ship profile and wave crests
      this.rimLight = new THREE.DirectionalLight(0x60A5FA, 1.2);
      this.rimLight.position.set(60, 25, 60);
      this.scene.add(this.rimLight);

      /* ── 7. Scene Entities ── */
      this.ocean      = new Ocean(900, 512);
      this.vessel     = new Vessel();
      this.wake       = new Wake(150, 42);
      this.waterSpray = new WaterSpray();

      this.vessel.group.position.set(0, 0, 0);

      this.scene.add(this.ocean.mesh);
      this.scene.add(this.vessel.group);
      this.scene.add(this.wake.mesh);
      this.scene.add(this.waterSpray.group);

      /* ── 8. Clock & Event Listeners ── */
      this.clock = new THREE.Clock();

      this.handleResize();
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.canvas);

      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(([e]) => { this.isVisible = e.isIntersecting; });
        io.observe(this.canvas);
      }

      this.start();
      options.onReady?.();

    } catch (err) {
      console.error('[HeroScene] Init failed:', err);
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  public setScrollProgress(progress: number) {
    this.targetScrollProgress = Math.max(0, progress);
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isReducedMotion) return;
    this.targetMouseX = ((e.clientX / window.innerWidth)  * 2 - 1);
    this.targetMouseY = ((e.clientY / window.innerHeight) * 2 - 1);
  };

  private handleResize = () => {
    if (!this.renderer || !this.canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  /**
   * 360-Degree Orbital Camera Rig around moving vessel
   */
  private calculateCameraOrbit(p: number, shipPos: THREE.Vector3): { camPos: THREE.Vector3; lookTarget: THREE.Vector3 } {
    const heading = this.vessel.headingAngle;
    const baseAngle = Math.PI + heading + p * Math.PI * 2.0;

    const sinCycle = Math.sin(p * Math.PI * 2.0);
    const radius = 24.0 - Math.abs(sinCycle) * 3.5;
    const height = 14.0 - sinCycle * 4.5 + Math.cos(p * Math.PI * 2.0) * 1.5;

    // Look-at target slightly above ship center of mass
    const lookTarget = new THREE.Vector3(
      shipPos.x + this.mouseX * 0.85,
      shipPos.y + 1.8 + this.mouseY * 0.35,
      shipPos.z + Math.cos(heading) * 2.0
    );

    // Orbit position offset from ship
    const offsetX = Math.sin(baseAngle) * radius;
    const offsetZ = Math.cos(baseAngle) * radius;
    const offsetY = Math.max(4.5, height);

    const camPos = new THREE.Vector3(
      shipPos.x + offsetX,
      shipPos.y + offsetY,
      shipPos.z + offsetZ
    );

    return { camPos, lookTarget };
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    if (!this.isVisible) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const time  = this.isReducedMotion ? 2.0 : this.clock.getElapsedTime();

    if (!this.isReducedMotion) {
      // 1. Smooth scroll progression
      this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.045;

      // 2. Smooth cursor damping
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;

      // 3. Controlled cursor steering
      this.vessel.setCursorSteering(this.mouseX);

      // 4. Sample wave heights for heavy tonnage buoyancy
      const vp = this.vessel.group.position;
      const wBow   = this.ocean.getWaveHeightAt(vp.x, vp.z + 10.0, time);
      const wStern = this.ocean.getWaveHeightAt(vp.x, vp.z - 10.0, time);

      // 5. Update vessel physics, heading, and forward velocity
      this.vessel.update(time, delta, wBow, wStern);

      // 6. Smooth Kelvin wake aligned with vessel stern
      this.wake.update(
        time,
        this.vessel.sternWorldPos,
        this.vessel.headingAngle,
        this.vessel.forwardSpeed
      );

      // 7. Explosive 3D Water Spray (Rooster tail + Bow spray)
      this.waterSpray.update(
        delta,
        time,
        vp,
        this.vessel.headingAngle,
        this.vessel.forwardSpeed
      );

      // 8. Keep ocean mesh centered beneath the ship
      this.ocean.mesh.position.set(vp.x, 0, vp.z);
      this.ocean.update(time, this.scrollProgress);

      // 9. 360-Degree Orbital Camera Rig
      const { camPos, lookTarget } = this.calculateCameraOrbit(this.scrollProgress, vp);

      // Smooth camera interpolation
      const ls = 0.065;
      this.currentCamPos.lerp(camPos, ls);
      this.currentLookPos.lerp(lookTarget, ls);

      this.camera.position.copy(this.currentCamPos);
      this.camera.lookAt(this.currentLookPos);

      // 10. Keep lighting and shadow frustum synced with ship position
      this.sunLight.position.set(vp.x - 70, 120, vp.z - 60);
      this.sunLight.target.position.copy(vp);
      this.rimLight.position.set(vp.x + 60, 25, vp.z + 60);
    }

    this.renderer?.render(this.scene, this.camera);
  };

  public start() {
    if (!this.animFrameId) {
      this.clock.start();
      this.animate();
    }
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public dispose() {
    this.stop();
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.resizeObserver?.disconnect();
    this.ocean.dispose();
    this.vessel.dispose();
    this.wake.dispose();
    this.waterSpray.dispose();
    this.skyDome.geometry.dispose();
    (this.skyDome.material as THREE.Material).dispose();
    this.scene.environment?.dispose();
    this.renderer?.dispose();
    this.renderer = null;
  }
}

export default HeroScene;

