import { useEffect, useRef } from "react";

interface GenerativeVisualProps {
  className?: string;
}

export default function GenerativeVisual({ className }: GenerativeVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const getHsl = (name: string) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const [hue, saturation, lightness] = raw.split(/\s+/);
      return hue && saturation && lightness
        ? `hsl(${hue}, ${saturation}, ${lightness})`
        : "hsl(0, 0%, 50%)";
    };

    const palette = () => ({
      node: "hsl(217, 91%, 68%)",
      line: "hsl(48, 96%, 53%)",
      pulse: "hsl(48, 96%, 63%)",
    });

    const count = 64;
    const linkDistance = 118;
    const maxLinks = 4;
    const speed = 0.18;

    const mouseRef = { x: 0, y: 0, active: false };

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let spawnStart = 0;
    const spawnDuration = 1100;

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 1.4 + 0.8,
        });
      }
      spawnStart = performance.now();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const colors = palette();

      const spawnProgress = Math.min(1, (performance.now() - spawnStart) / spawnDuration);
      const eased = 1 - Math.pow(1 - spawnProgress, 3);
      const visibleCount = Math.max(1, Math.floor(eased * particles.length));

      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i];
        let links = 0;

        for (let j = i + 1; j < visibleCount; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkDistance && links < maxLinks) {
            const alpha = 1 - dist / linkDistance;
            ctx.globalAlpha = (0.22 + alpha * 0.42) * eased;
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 1.05;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            links++;
          }
        }
      }

      const pulse = (Math.sin(Date.now() / 900) + 1) / 2;

      ctx.fillStyle = colors.node;

      const mx = mouseRef.x;
      const my = mouseRef.y;
      const hasMouse = mouseRef.active;
      const influenceRadius = 140;

      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i];
        if (hasMouse) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceRadius && dist > 0.01) {
            const force = (1 - dist / influenceRadius) * 0.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        } else {
          // Smoothly ease velocity back toward the original base speed.
          const mag = Math.hypot(p.vx, p.vy);
          if (mag > speed) {
            const decay = 0.985;
            p.vx *= decay;
            p.vy *= decay;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.globalAlpha = 0.95 * eased;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = colors.pulse;
      ctx.lineWidth = 1;
      for (let i = 0; i < visibleCount; i += 9) {
        const p = particles[i];
        ctx.globalAlpha = (0.2 + pulse * 0.22) * eased;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 4 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.x = e.clientX - rect.left;
      mouseRef.y = e.clientY - rect.top;
      mouseRef.active = true;
    };
    const handleLeave = () => {
      mouseRef.active = false;
    };
    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerenter", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerenter", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 block h-full w-full rounded-2xl drop-shadow-[0_0_28px_hsl(217,91%,60%,0.45)]"
      />
    </div>
  );
}
