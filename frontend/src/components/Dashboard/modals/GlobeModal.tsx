import React, { useEffect, useRef } from 'react';
import { X, Globe } from 'lucide-react';
import * as THREE from 'three';

interface GlobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const GlobeModal: React.FC<GlobeModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Earth Sphere (Ocean)
    const sphereGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x0f2444,
      emissive: 0x051329,
      specular: 0x38bdf8,
      shininess: 30,
      transparent: true,
      opacity: 0.95,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(0.9, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Wireframe Grid / Lat-Lon Lines
    const wireGeo = new THREE.SphereGeometry(0.855, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Points of interest: India Marine / Arabian Sea (Lat: 18N, Lon: 72E)
    // Spherical to Cartesian: phi = (90 - lat) * (PI / 180), theta = (lon + 180) * (PI / 180)
    const addMarker = (lat: number, lon: number, color: number, size: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = 0.86;
      const x = -r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const markerGeo = new THREE.SphereGeometry(size, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(x, y, z);
      globeGroup.add(marker);
    };

    // Add Key Indian Maritime Markers
    addMarker(21.45, 68.32, 0xef4444, 0.022); // ST-2046 Prime Suspect
    addMarker(19.22, 72.11, 0xf97316, 0.016); // MV ADRIATIC STAR
    addMarker(15.0, 73.5, 0x38bdf8, 0.014);   // Mumbai / Goa EEZ
    addMarker(8.5, 77.0, 0x10b981, 0.015);    // Cape Comorin
    addMarker(13.0, 80.2, 0x6366f1, 0.015);   // Chennai / Bay of Bengal

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Initial rotation facing Indian Ocean
    globeGroup.rotation.y = 2.1;
    globeGroup.rotation.x = 0.35;

    // Animation Loop
    let reqId: number;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const domEl = mountRef.current;
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (rendererRef.current && domEl.contains(rendererRef.current.domElement)) {
        domEl.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div
        className={`w-full max-w-4xl h-[620px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#060c18] border-blue-900/50 text-white' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">3D Orbital Ocean Globe · Navarea VIII</h2>
              <p className="text-[11px] text-slate-400">Interactive 360° Spatiotemporal Earth View with India EEZ Overlay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Container */}
        <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />

          {/* Interactive Legend Overlay */}
          <div className="absolute bottom-5 left-5 z-10 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Orbital Tracks</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs text-white/90 font-medium">MT OCEAN TITAN (Slick ST-2046)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-white/90 font-medium">MV ADRIATIC STAR (12.4 kn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-xs text-white/90 font-medium">India Arabian Sea EEZ (200 NM)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/90 font-medium">Indian Coast Guard QRF Station</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-slate-300">
            Click & Drag to Rotate 360°
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-black/30 shrink-0">
          <span className="text-xs text-slate-400">Projection: WGS84 Geocentric Spherical</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all"
          >
            Back to Command Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
