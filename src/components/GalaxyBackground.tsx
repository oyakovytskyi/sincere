import { useEffect, useRef } from "react";
import {
  ORBIT_CENTER_Y_OFFSET,
  ORBIT_ELLIPSE_X,
  ORBIT_ELLIPSE_Y,
} from "../data/orbitLayout";
import { orbitPoint3D, projectPoint3D } from "../utils/perspective3d";

type Particle = {
  angle: number;
  radius: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
};

const PARTICLE_COUNT = 900;

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const spiralTurn = index / PARTICLE_COUNT;
    return {
      angle: spiralTurn * Math.PI * 7 + (index % 11) * 0.08,
      radius: 40 + spiralTurn * 420 + (index % 7) * 6,
      z: (Math.random() * 2 - 1) * 15,
      size: 0.6 + (index % 5) * 0.35,
      opacity: 0.15 + (index % 9) * 0.08,
      speed: 0.00008 + (index % 6) * 0.00003,
    };
  });
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles = createParticles();
    let frameId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 1.9 + ORBIT_CENTER_Y_OFFSET;

      context.fillStyle = "#030108";
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        180,
      );
      glow.addColorStop(0, "rgba(236, 72, 153, 0.35)");
      glow.addColorStop(0.45, "rgba(168, 85, 247, 0.12)");
      glow.addColorStop(1, "rgba(3, 1, 8, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const projected = particles.map((particle) => {
        particle.angle += particle.speed;

        const orbit = orbitPoint3D(
          particle.angle,
          particle.radius,
          ORBIT_ELLIPSE_X,
          ORBIT_ELLIPSE_Y,
          particle.z,
        );
        const point = projectPoint3D(orbit.x, orbit.y, orbit.z, {
          centerX,
          centerY,
        });

        return {
          particle,
          sx: point.sx,
          sy: point.sy,
          depth: point.depth,
          size: particle.size * point.sizeScale,
          opacity: particle.opacity * point.depthFade,
        };
      });

      projected.sort((a, b) => a.depth - b.depth);

      for (const point of projected) {
        const { particle, sx, sy, size, opacity } = point;
        if (size <= 0 || opacity <= 0) continue;

        const drawSize = Math.max(size, 0.15);
        const drawOpacity = Math.min(opacity, 1);
        const hue = 300 + (particle.radius / 500) * 40;
        context.beginPath();
        context.fillStyle = `hsla(${hue}, 90%, 72%, ${drawOpacity})`;
        context.arc(sx, sy, drawSize, 0, Math.PI * 2);
        context.fill();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
