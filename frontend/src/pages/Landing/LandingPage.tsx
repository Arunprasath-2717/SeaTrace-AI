import React, { useEffect, useRef, useCallback } from 'react';
import { HeroScene } from '../../components/hero/HeroScene';
import { Navbar } from '../../components/navigation/Navbar';
import { HeroContent } from '../../components/hero/Hero';
import { WorkflowTimeline } from '../../components/sections/WorkflowTimeline';
import { SectionResponsibleUse } from '../../components/sections/SectionResponsibleUse';
import { SectionFinalCTA } from '../../components/sections/SectionFinalCTA';
import { Footer } from '../../components/navigation/Footer';

/* ================================================================
   LANDING PAGE — Editorial Product Experience
   ─────────────────────────────────────────────────────────────
   - Photorealistic 3D deep marine ocean & moving white vessel
   - Background scroll reactive and rotating 360° continuously while scrolling
   - Floating pill navbar
   - Redesigned high-contrast hero typography (pure white & sky blue)
   - Connected vertical timeline workflow
   - Direct pathway: LANDING → OPERATIONAL CONSOLE (/app)
   ================================================================ */

export const LandingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<HeroScene | null>(null);

  /* ── 1. Initialize Photorealistic WebGL Scene with Vessel ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: HeroScene | null = null;
    try {
      scene = new HeroScene({
        canvas,
        onError: (err) => {
          console.warn('[LandingPage] 3D Scene notice:', err);
        },
      });
      sceneRef.current = scene;
    } catch (err) {
      console.warn('[LandingPage] WebGL initialization notice:', err);
    }

    return () => {
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  /* ── 2. Continuous Scroll-Reactive Rotating Background ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      // 3 full 360° cinematic orbital rotations across total page scroll
      const totalRotations = 3.2;
      const progress = (window.scrollY / scrollable) * totalRotations;

      if (sceneRef.current) {
        sceneRef.current.setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Local hero pinned scroll callback */
  const handleHeroScrollProgress = useCallback((progress: number) => {
    if (window.scrollY < window.innerHeight * 1.5 && sceneRef.current) {
      sceneRef.current.setScrollProgress(progress);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#0A1935',
        color: '#F8FAFC',
        fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
      }}
    >
      {/* ══════════════════════════════════════════════════════
          FIXED 3D DEEP MARINE CANVAS — z-index 0
          White vessel moving through ocean swells with
          dual stern spray & 360° orbital camera rig
          ═════════════════════════════════════════════════════ */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          display: 'block',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════
          FLOATING PILL NAVBAR
          ═════════════════════════════════════════════════════ */}
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          SCROLLABLE EDITORIAL NARRATIVE — z-index 2
          ═════════════════════════════════════════════════════ */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Section 01: Hero (Centered content, redesigned crisp text) */}
        <HeroContent onScrollProgress={handleHeroScrollProgress} />

        {/* Section 02: Connected Timeline Workflow */}
        <WorkflowTimeline />

        {/* Section 03: Responsible Use & Scientific Governance */}
        <SectionResponsibleUse />

        {/* Section 04: Final CTA (Enter Investigation → Console) */}
        <SectionFinalCTA />
      </main>

      {/* Clean White Themed Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
