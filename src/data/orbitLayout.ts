import type { WishItem } from "./wishes";

export const ORBIT_CENTER_Y_OFFSET = 20;
export const ORBIT_ELLIPSE_X = 0.92;
export const ORBIT_ELLIPSE_Y = 0.58;
export const ORBIT_BASE_RADIUS = 118;

export const BLOCK_GAP = 6;

export function getOrbitOffset(angle: number, radiusScale: number) {
  const radius = ORBIT_BASE_RADIUS * radiusScale;
  return {
    x: Math.cos(angle) * radius * ORBIT_ELLIPSE_X,
    y: Math.sin(angle) * radius * ORBIT_ELLIPSE_Y,
  };
}

export function getWishOrbitOffset(wish: WishItem) {
  return getOrbitOffset(wish.orbitAngle, wish.orbitRadius);
}
