import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    let animId: number;
    let renderer: import('three').WebGLRenderer;

    const init = async () => {
      try {
        const THREE = await import('three');
        const W = mountRef.current!.clientWidth;
        const H = mountRef.current!.clientHeight;

        /* Scene */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
        camera.position.z = 4;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mountRef.current!.appendChild(renderer.domElement);

        /* Particles */
        const COUNT = 420;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(COUNT * 3);
        const colors    = new Float32Array(COUNT * 3);
        const sizes     = new Float32Array(COUNT);

        const palette = [
          new THREE.Color('#6366f1'), new THREE.Color('#818cf8'),
          new THREE.Color('#c7d2fe'), new THREE.Color('#38bdf8'),
          new THREE.Color('#bfdbfe'),
        ];

        for (let i = 0; i < COUNT; i++) {
          positions[i * 3]     = (Math.random() - 0.5) * 10;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
          const c = palette[Math.floor(Math.random() * palette.length)];
          colors[i * 3]     = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
          sizes[i] = Math.random() * 3 + 1;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.PointsMaterial({
          size: 0.035, vertexColors: true, transparent: true,
          opacity: 0.55, sizeAttenuation: true, blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        /* Animate */
        let t = 0;
        const loop = () => {
          animId = requestAnimationFrame(loop);
          t += 0.0008;
          points.rotation.y = t * 0.12;
          points.rotation.x = Math.sin(t * 0.3) * 0.06;
          renderer.render(scene, camera);
        };
        loop();

        /* Resize */
        const onResize = () => {
          if (!mountRef.current) return;
          const W2 = mountRef.current.clientWidth;
          const H2 = mountRef.current.clientHeight;
          camera.aspect = W2 / H2;
          camera.updateProjectionMatrix();
          renderer.setSize(W2, H2);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      } catch (e) {
        console.error('Three.js init error:', e);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (mountRef.current) {
        const canvas = mountRef.current.querySelector('canvas');
        if (canvas) canvas.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleBackground;
