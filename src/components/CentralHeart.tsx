import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Particle3D = {
  x: number;
  y: number;
  z: number;
  size: number;
  kind: "outline" | "fill" | "beam";
  twinklePhase: number;
  twinkleSpeed: number;
};

const OUTLINE_COUNT = 220;
const FILL_COUNT = 520;
const BEAM_COUNT = 48;
const PERSPECTIVE = 0.045;
const TILT_X = 0.38;
const HEART_EXTENT_X = 18;
const HEART_EXTENT_Y_TOP = 7;
const HEART_EXTENT_Y_BOTTOM = 19;
const BEAM_EXTENT_Y = 36;
const CANVAS_PADDING = 22;

function getFitScale(width: number, height: number, centerY: number) {
  const maxScaleX = (width / 2 - CANVAS_PADDING) / HEART_EXTENT_X;
  const maxScaleYTop = (centerY - CANVAS_PADDING) / HEART_EXTENT_Y_TOP;
  const maxScaleYBottom =
    (height - centerY - CANVAS_PADDING) /
    (HEART_EXTENT_Y_BOTTOM + BEAM_EXTENT_Y);

  return Math.min(maxScaleX, maxScaleYTop, maxScaleYBottom) * 0.94;
}

function heart2D(t: number): [number, number] {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return [x, y];
}

function isInsideHeart(x: number, y: number): boolean {
  const nx = x / 16;
  const ny = y / 13;
  const a = nx * nx + ny * ny - 1;
  return a * a * a - nx * nx * ny * ny * ny <= 0;
}

function rotateY(p: Particle3D, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos - p.z * sin,
    y: p.y,
    z: p.x * sin + p.z * cos,
  };
}

function rotateX(x: number, y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x,
    y: y * cos - z * sin,
    z: y * sin + z * cos,
  };
}

function createParticles(): Particle3D[] {
  const particles: Particle3D[] = [];

  for (let i = 0; i < OUTLINE_COUNT; i += 1) {
    const t = (i / OUTLINE_COUNT) * Math.PI * 2;
    const [hx, hy] = heart2D(t);
    const shell = (i % 4) - 1.5;
    const jitter = (Math.random() - 0.5) * 1.2;

    particles.push({
      x: hx + jitter * 0.35,
      y: hy + jitter * 0.35,
      z: shell * 2.2 + (Math.random() - 0.5) * 1.4,
      size: 1.1 + (i % 3) * 0.35,
      kind: "outline",
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.8 + Math.random() * 1.4,
    });
  }

  let attempts = 0;
  while (
    particles.length < OUTLINE_COUNT + FILL_COUNT &&
    attempts < FILL_COUNT * 12
  ) {
    attempts += 1;
    const x = (Math.random() * 2 - 1) * 17;
    const y = (Math.random() * 2 - 1) * 16;
    if (!isInsideHeart(x, y)) continue;

    particles.push({
      x,
      y,
      z: (Math.random() * 2 - 1) * 5.5,
      size: 0.45 + Math.random() * 0.75,
      kind: "fill",
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.5 + Math.random() * 1.2,
    });
  }

  const [, tipY] = heart2D(Math.PI);
  for (let i = 0; i < BEAM_COUNT; i += 1) {
    const progress = i / (BEAM_COUNT - 1);
    const spread = (1 - progress) * 2.4;

    particles.push({
      x: (Math.random() - 0.5) * spread,
      y: tipY + 4 + progress * BEAM_EXTENT_Y,
      z: (Math.random() - 0.5) * 1.8,
      size: 0.55 + (1 - progress) * 1.1,
      kind: "beam",
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 1 + Math.random() * 1.5,
    });
  }

  return particles;
}

function ParticleHeartCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef(createParticles());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles = particlesRef.current;
    let frameId = 0;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height * 0.38;
      const elapsed = (time - startTime) / 1000;
      const rotationY = elapsed * 0.55;
      const pulse = 1 + Math.sin(elapsed * 1.4) * 0.03;
      const fitScale = getFitScale(width, height, centerY);

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        width * 0.42,
      );
      glow.addColorStop(0, "rgba(244, 114, 182, 0.32)");
      glow.addColorStop(0.35, "rgba(168, 85, 247, 0.14)");
      glow.addColorStop(1, "rgba(244, 114, 182, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const projected = particles.map((particle) => {
        const rotatedY = rotateY(particle, rotationY);
        const rotated = rotateX(rotatedY.x, rotatedY.y, rotatedY.z, TILT_X);
        const depth = 1 + rotated.z * PERSPECTIVE;
        const scale = fitScale * pulse;

        return {
          particle,
          sx: centerX + (rotated.x * scale) / depth,
          sy: centerY + (rotated.y * scale) / depth,
          depth: rotated.z,
          size: (particle.size * scale) / depth,
        };
      });

      projected.sort((a, b) => a.depth - b.depth);

      for (const point of projected) {
        const { particle, sx, sy, size, depth } = point;
        const twinkle =
          0.55 +
          0.45 *
            Math.sin(elapsed * particle.twinkleSpeed + particle.twinklePhase);
        const depthFade = 0.55 + (depth + 8) / 16;

        let alpha: number;
        let hue: number;
        let blur: number;

        if (particle.kind === "outline") {
          alpha = 0.75 * twinkle * depthFade;
          hue = 330 + depth * 2;
          blur = 8;
        } else if (particle.kind === "beam") {
          alpha = 0.35 * twinkle * depthFade;
          hue = 315;
          blur = 10;
        } else {
          alpha = 0.28 * twinkle * depthFade;
          hue = 305 + depth * 1.5;
          blur = 5;
        }

        context.save();
        context.shadowBlur = blur;
        context.shadowColor = `hsla(${hue}, 95%, 78%, ${alpha})`;
        context.beginPath();
        context.fillStyle = `hsla(${hue}, 92%, ${particle.kind === "outline" ? 88 : 74}%, ${alpha})`;
        context.arc(sx, sy, Math.max(size * 0.5, 0.35), 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="relative h-52 w-52 sm:h-64 sm:w-64"
      aria-hidden
    />
  );
}

export function CentralHeart() {
  const visual = (
    <motion.div
      className="relative"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ParticleHeartCanvas />
    </motion.div>
  );

  return (
    <div
      className={`absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 `}
    >
      {visual}
    </div>
  );
}
