import React, { useEffect, useRef } from 'react';

export type CurrencyType = 'gold_coin' | 'dollar_banknote' | 'bdt_banknote' | 'emerald_sparkle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  scale: number;
  type: CurrencyType;
  denomination: string;
  
  // 3D rotations & fluttering physics
  rotation: number; // in-plane roll (Z-axis)
  rotationSpeed: number;
  yaw: number; // Y-axis spin
  yawSpeed: number;
  pitch: number; // X-axis tumble
  pitchSpeed: number;
  
  // Paper flutter & curve
  flutterPhase: number;
  flutterSpeed: number;
  flutterAmplitude: number;
  driftFrequency: number;
  
  // Visuals
  opacity: number;
  layer: 'bg' | 'fg';
  shineAngle: number;
  shineSpeed: number;

  // Bounce physics
  hasBounced: boolean;
  bounceCount: number;
}

interface FallingDollarsCanvasProps {
  intensity?: 'normal' | 'celebration' | 'ambient';
  isCelebrating?: boolean;
  layer?: 'background' | 'foreground' | 'all';
  className?: string;
}

export const FallingDollarsCanvas: React.FC<FallingDollarsCanvasProps> = ({
  intensity = 'normal',
  isCelebrating = false,
  layer = 'all',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isReducedMotionRef = useRef<boolean>(false);
  const phaseRef = useRef<'active' | 'decay' | 'ambient'>('active');
  const phaseTimerRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotionRef.current = mediaQuery.matches;
      const handler = (e: MediaQueryListEvent) => {
        isReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    if (isReducedMotionRef.current) {
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    phaseRef.current = isCelebrating ? 'active' : intensity === 'ambient' ? 'ambient' : 'active';
    phaseTimerRef.current = Date.now();

    // Create realistic banknote or gold coin particle
    const createParticle = (forceTop: boolean = true, isCelebrationBurst: boolean = false): Particle => {
      const isFg = layer === 'foreground' || (layer === 'all' && Math.random() > 0.45);
      
      // Mix: 45% Banknotes, 45% Gold Coins, 10% Emerald Sparkles
      const randType = Math.random();
      let type: CurrencyType = 'gold_coin';
      let denomination = '$100';

      if (randType < 0.45) {
        type = 'gold_coin';
        denomination = Math.random() > 0.3 ? '$' : '৳';
      } else if (randType < 0.88) {
        type = Math.random() > 0.35 ? 'dollar_banknote' : 'bdt_banknote';
        denomination = type === 'dollar_banknote' ? (Math.random() > 0.5 ? '$100' : '$50') : '৳500';
      } else {
        type = 'emerald_sparkle';
      }

      // Sizes
      const baseScale = isFg ? 0.9 + Math.random() * 0.35 : 0.6 + Math.random() * 0.25;
      const coinRadius = (16 + Math.random() * 8) * baseScale;
      const noteWidth = (64 + Math.random() * 12) * baseScale;
      const noteHeight = noteWidth * 0.52; // realistic currency ratio

      return {
        x: Math.random() * width,
        y: forceTop ? -40 - Math.random() * 60 : Math.random() * height * 0.8,
        vx: (Math.random() - 0.5) * (type === 'gold_coin' ? 1.2 : 2.0),
        vy: isCelebrationBurst
          ? (type === 'gold_coin' ? 2.5 + Math.random() * 3.0 : 1.8 + Math.random() * 2.5)
          : (type === 'gold_coin' ? 1.6 + Math.random() * 1.8 : 1.2 + Math.random() * 1.4),
        width: type === 'gold_coin' ? coinRadius * 2 : noteWidth,
        height: type === 'gold_coin' ? coinRadius * 2 : noteHeight,
        scale: baseScale,
        type,
        denomination,
        rotation: (Math.random() - 0.5) * Math.PI * 0.5,
        rotationSpeed: (Math.random() - 0.5) * (type === 'gold_coin' ? 0.04 : 0.02),
        yaw: Math.random() * Math.PI * 2,
        yawSpeed: (0.025 + Math.random() * 0.05) * (Math.random() > 0.5 ? 1 : -1),
        pitch: Math.random() * Math.PI * 2,
        pitchSpeed: (0.02 + Math.random() * 0.04) * (Math.random() > 0.5 ? 1 : -1),
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: 0.04 + Math.random() * 0.06,
        flutterAmplitude: 4 + Math.random() * 6,
        driftFrequency: 0.015 + Math.random() * 0.02,
        opacity: isFg ? 0.9 + Math.random() * 0.1 : 0.45 + Math.random() * 0.25,
        layer: isFg ? 'fg' : 'bg',
        shineAngle: Math.random() * Math.PI * 2,
        shineSpeed: 0.03 + Math.random() * 0.04,
        hasBounced: false,
        bounceCount: 0,
      };
    };

    // Initialize particles count
    const initialCount = isCelebrating ? 42 : intensity === 'ambient' ? 6 : 22;
    particlesRef.current = Array.from({ length: initialCount }, () => createParticle(false, isCelebrating));

    let lastTime = performance.now();

    // ==========================================
    // DRAWING HELPERS FOR REALISTIC ASSETS
    // ==========================================

    // 1. Realistic 3D Gold Coin with Milled Rim & Specular Shine
    const drawRealisticGoldCoin = (p: Particle) => {
      const radius = p.width / 2;
      const cosYaw = Math.cos(p.yaw);
      const sinPitch = Math.sin(p.pitch);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 3D Perspective Scaling
      const scaleX = cosYaw;
      const scaleY = 0.85 + Math.abs(sinPitch) * 0.15;
      ctx.scale(scaleX, scaleY);
      ctx.globalAlpha = p.opacity;

      // Outer 3D Coin Edge/Rim Thickness (when tilted)
      const isFlipped = cosYaw < 0;
      const edgeThickness = (1 - Math.abs(cosYaw)) * 6 * p.scale;
      
      if (edgeThickness > 1.2) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#78350F'; // deep bronze coin edge
        ctx.fill();

        // Edge reeding/ridges
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Coin Body - Multi-stop Realistic Gold Gradient
      const goldGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
      goldGrad.addColorStop(0, '#FEF08A'); // bright specular highlight
      goldGrad.addColorStop(0.25, '#FBBF24'); // lustrous golden face
      goldGrad.addColorStop(0.65, '#F59E0B'); // warm rich amber
      goldGrad.addColorStop(0.9, '#D97706'); // deep gold bevel
      goldGrad.addColorStop(1, '#92400E'); // rim shadow

      ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      ctx.shadowBlur = p.layer === 'fg' ? 12 : 5;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = goldGrad;
      ctx.fill();

      // Milled Outer Rim Bead
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.86, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.lineWidth = Math.max(1, 1.5 * p.scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.5)';
      ctx.lineWidth = Math.max(1, 1 * p.scale);
      ctx.stroke();

      // Embossed Symbol in Center (Dollar or Taka)
      if (Math.abs(scaleX) > 0.22) {
        const fontSize = Math.round(radius * 1.05);
        ctx.font = `900 ${fontSize}px "Anek Bangla", -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Embossed shadow
        ctx.fillStyle = 'rgba(120, 53, 15, 0.9)';
        ctx.fillText(p.denomination, 1 * p.scale, 1.5 * p.scale);

        // Embossed gold highlight
        ctx.fillStyle = '#FFFBEB';
        ctx.fillText(p.denomination, -0.5 * p.scale, -0.5 * p.scale);

        // Face surface color
        ctx.fillStyle = '#F59E0B';
        ctx.fillText(p.denomination, 0, 0);
      }

      // Dynamic Specular Glint Sweep (Light glints as coin rotates)
      const glintX = Math.cos(p.shineAngle) * (radius * 0.45);
      const glintY = Math.sin(p.shineAngle) * (radius * 0.45);
      const glintGrad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, radius * 0.4);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      glintGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.3)');
      glintGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.beginPath();
      ctx.arc(glintX, glintY, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = glintGrad;
      ctx.fill();

      ctx.restore();
    };

    // 2. Realistic Dollar / Currency Banknote with Flutter & 3D Curve
    const drawRealisticBanknote = (p: Particle) => {
      const w = p.width;
      const h = p.height;
      const cosYaw = Math.cos(p.yaw);
      const sinPitch = Math.sin(p.pitch);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 3D Perspective & Tumbling
      const scaleX = cosYaw;
      const scaleY = 0.8 + Math.abs(sinPitch) * 0.2;
      ctx.scale(scaleX, scaleY);
      ctx.globalAlpha = p.opacity;

      // Aerodynamic Wave Curve (paper bends gently along its width)
      const bend = Math.sin(p.flutterPhase) * (p.flutterAmplitude * p.scale);

      ctx.shadowColor = 'rgba(6, 78, 59, 0.4)';
      ctx.shadowBlur = p.layer === 'fg' ? 14 : 6;

      // Draw Curved Banknote Body
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2);
      // Top curved edge
      ctx.quadraticCurveTo(0, -h / 2 + bend, w / 2, -h / 2);
      // Right edge
      ctx.lineTo(w / 2, h / 2);
      // Bottom curved edge
      ctx.quadraticCurveTo(0, h / 2 + bend, -w / 2, h / 2);
      // Left edge
      ctx.closePath();

      // Banknote Base Gradient (Deep Emerald / Classic Currency)
      const noteGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      if (p.type === 'dollar_banknote') {
        noteGrad.addColorStop(0, '#022C22'); // dark forest
        noteGrad.addColorStop(0.3, '#064E3B'); // deep emerald
        noteGrad.addColorStop(0.7, '#065F46'); // classic banknote green
        noteGrad.addColorStop(1, '#022C22');
      } else {
        // BDT Banknote (violet-emerald tint)
        noteGrad.addColorStop(0, '#042F2E');
        noteGrad.addColorStop(0.4, '#134E4A');
        noteGrad.addColorStop(0.8, '#0F766E');
        noteGrad.addColorStop(1, '#042F2E');
      }

      ctx.fillStyle = noteGrad;
      ctx.fill();

      // Intricate Guilloche Border
      ctx.strokeStyle = p.type === 'dollar_banknote' ? 'rgba(52, 211, 153, 0.7)' : 'rgba(45, 212, 191, 0.7)';
      ctx.lineWidth = Math.max(1, 1.2 * p.scale);
      ctx.stroke();

      // Inner Gold Security Frame
      ctx.beginPath();
      const pad = 3.5 * p.scale;
      ctx.moveTo(-w / 2 + pad, -h / 2 + pad);
      ctx.quadraticCurveTo(0, -h / 2 + pad + bend * 0.9, w / 2 - pad, -h / 2 + pad);
      ctx.lineTo(w / 2 - pad, h / 2 - pad);
      ctx.quadraticCurveTo(0, h / 2 - pad + bend * 0.9, -w / 2 + pad, h / 2 - pad);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = Math.max(0.8, 0.9 * p.scale);
      ctx.stroke();

      // Central Oval Vignette / Seal
      if (Math.abs(scaleX) > 0.3) {
        ctx.save();
        ctx.translate(0, bend * 0.6);

        // Center Oval
        ctx.beginPath();
        ctx.ellipse(0, 0, w * 0.22, h * 0.34, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 95, 70, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Central BringDollar Emblem or $
        ctx.fillStyle = '#FEF08A';
        ctx.font = `bold ${Math.round(h * 0.4)}px "Anek Bangla", -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.denomination, 0, 0);

        // Security Hologram / Cyan Metallic Foil Strip
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.fillRect(-w * 0.32, -h / 2 + pad, w * 0.08, h - pad * 2);

        // Corner Denominations
        ctx.font = `bold ${Math.round(h * 0.22)}px monospace`;
        ctx.fillStyle = '#6EE7B7';

        // Top Left & Bottom Right
        ctx.textAlign = 'left';
        ctx.fillText(p.denomination, -w / 2 + pad * 1.5, -h / 2 + pad * 2.8);
        ctx.textAlign = 'right';
        ctx.fillText(p.denomination, w / 2 - pad * 1.5, h / 2 - pad * 1.8);

        ctx.restore();
      }

      // Paper Fold / Specular Light Highlight along the curve
      const lightGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      lightGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.15)');
      lightGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
      lightGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.15)');
      lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = lightGrad;
      ctx.fill();

      ctx.restore();
    };

    // 3. Emerald Sparkle Particle
    const drawEmeraldSparkle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#34D399';

      const s = (p.width / 4) * p.scale;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const elapsed = (Date.now() - phaseTimerRef.current) / 1000;

      // Lifecycle handling: ~2.8s active cascade then gently decay to ambient
      if (phaseRef.current === 'active' && !isCelebrating) {
        if (elapsed > 2.8) {
          phaseRef.current = 'decay';
        }
      } else if (phaseRef.current === 'decay') {
        if (particlesRef.current.length <= 6) {
          phaseRef.current = 'ambient';
        }
      }

      ctx.clearRect(0, 0, width, height);

      const targetCount = isCelebrating
        ? 45
        : phaseRef.current === 'active'
        ? 24
        : phaseRef.current === 'decay'
        ? 8
        : 6;

      // Spawn new particles from top if needed
      if (particlesRef.current.length < targetCount) {
        if (Math.random() < 0.28) {
          particlesRef.current.push(createParticle(true, isCelebrating));
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        // Filter by layer if specified
        if (layer === 'background' && p.layer !== 'bg') return false;
        if (layer === 'foreground' && p.layer !== 'fg') return false;

        // Physics Updates
        p.yaw += p.yawSpeed;
        p.pitch += p.pitchSpeed;
        p.rotation += p.rotationSpeed;
        p.flutterPhase += p.flutterSpeed;
        p.shineAngle += p.shineSpeed;

        // Realistic Air Drag & Drift: banknotes flutter horizontally much more than coins
        const flutterDrift = Math.sin(p.flutterPhase) * (p.type === 'gold_coin' ? 0.6 : 1.8);
        p.x += (p.vx + flutterDrift) * (dt * 60);
        p.y += p.vy * (dt * 60);

        // Soft Bounce & Landing: Coins softly bounce on bottom threshold
        if (p.type === 'gold_coin' && !p.hasBounced && p.y > height - 60 && p.bounceCount === 0) {
          p.vy = -p.vy * 0.35; // soft elastic bounce
          p.hasBounced = true;
          p.bounceCount++;
        }

        // Ambient mode gentle opacity reduction
        if (phaseRef.current === 'ambient' && p.opacity > 0.35) {
          p.opacity = Math.max(0.2, p.opacity - dt * 0.25);
        }

        // Draw particle based on type
        if (p.type === 'gold_coin') {
          drawRealisticGoldCoin(p);
        } else if (p.type === 'dollar_banknote' || p.type === 'bdt_banknote') {
          drawRealisticBanknote(p);
        } else {
          drawEmeraldSparkle(p);
        }

        // Boundary check
        if (p.y > height + 50 || p.x < -60 || p.x > width + 60) {
          if (phaseRef.current === 'active' || isCelebrating) {
            return false; // Repopulate from top
          }
          if (phaseRef.current === 'ambient' && Math.random() < 0.5) {
            p.y = -30;
            p.x = Math.random() * width;
            p.opacity = 0.3;
            p.hasBounced = false;
            return true;
          }
          return false;
        }

        return true;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        lastTime = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intensity, isCelebrating, layer]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
