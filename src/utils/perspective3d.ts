export const PERSPECTIVE = 0.045;
export const TILT_X = 0.38;

export type Vec3 = { x: number; y: number; z: number };

export function rotateY(x: number, y: number, z: number, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    y,
    z: x * sin + z * cos,
  };
}

export function rotateX(x: number, y: number, z: number, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x,
    y: y * cos - z * sin,
    z: y * sin + z * cos,
  };
}

export type ProjectOptions = {
  rotationY?: number;
  tiltX?: number;
  scale?: number;
  centerX: number;
  centerY: number;
};

export type ProjectedPoint = {
  sx: number;
  sy: number;
  depth: number;
  sizeScale: number;
  depthFade: number;
};

export function projectPoint3D(
  x: number,
  y: number,
  z: number,
  opts: ProjectOptions,
): ProjectedPoint {
  const { rotationY = 0, tiltX = TILT_X, scale = 1, centerX, centerY } = opts;

  const rotatedY = rotateY(x, y, z, rotationY);
  const rotated = rotateX(rotatedY.x, rotatedY.y, rotatedY.z, tiltX);
  const depthDivisor = 1 + rotated.z * PERSPECTIVE;

  return {
    sx: centerX + (rotated.x * scale) / depthDivisor,
    sy: centerY + (rotated.y * scale) / depthDivisor,
    depth: rotated.z,
    sizeScale: scale / depthDivisor,
    depthFade: 0.55 + (rotated.z + 8) / 16,
  };
}

export function orbitPoint3D(
  angle: number,
  radius: number,
  ellipseX: number,
  ellipseY: number,
  z = 0,
): Vec3 {
  return {
    x: Math.cos(angle) * radius * ellipseX,
    y: Math.sin(angle) * radius * ellipseY,
    z,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
