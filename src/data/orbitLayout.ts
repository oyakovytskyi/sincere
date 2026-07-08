import type { WishItem } from "./wishes";
import {
  clamp,
  orbitPoint3D,
  projectPoint3D,
} from "../utils/perspective3d";

export const ORBIT_CENTER_Y_OFFSET = 20;
export const ORBIT_ELLIPSE_X = 3;
export const ORBIT_ELLIPSE_Y = 0.3;
export const ORBIT_BASE_RADIUS = 118;

export const BLOCK_GAP = 2;

const ORBIT_SAMPLE_STEPS = 72;
const WISH_CARD_HALF_W = 94;
const WISH_CARD_HALF_H = 52;
const VIEWPORT_EDGE_PADDING = 14;
const BOTTOM_HINT_RESERVE = 56;
const MIN_WISH_SCALE = 0.82;
const MAX_WISH_SCALE = 1.12;
const ORBIT_TARGET_WIDTH_RATIO = 0.75;
const ORBIT_FIT_SCALE_MIN = 0.5;
const ORBIT_FIT_SCALE_MAX = 20;

function sampleOrbitExtents(radiusScale: number, orbitScale: number) {
  const radius = ORBIT_BASE_RADIUS * radiusScale * orbitScale;
  let maxSxExtent = 0;
  let maxSyExtent = 0;

  for (let i = 0; i < ORBIT_SAMPLE_STEPS; i += 1) {
    const angle = (i / ORBIT_SAMPLE_STEPS) * Math.PI * 2;
    const orbit = orbitPoint3D(
      angle,
      radius,
      ORBIT_ELLIPSE_X,
      ORBIT_ELLIPSE_Y,
    );
    const projected = projectPoint3D(orbit.x, orbit.y, orbit.z, {
      centerX: 0,
      centerY: 0,
    });

    maxSxExtent = Math.max(
      maxSxExtent,
      Math.abs(projected.sx) + WISH_CARD_HALF_W * MAX_WISH_SCALE,
    );
    maxSyExtent = Math.max(
      maxSyExtent,
      Math.abs(projected.sy) + WISH_CARD_HALF_H * MAX_WISH_SCALE,
    );
  }

  return { maxSxExtent, maxSyExtent };
}

export function getOrbitFitScale(
  viewportWidth: number,
  viewportHeight: number,
  maxRadiusScale: number,
): number {
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2 + ORBIT_CENTER_Y_OFFSET;

  const limitX =
    (centerX - VIEWPORT_EDGE_PADDING) * ORBIT_TARGET_WIDTH_RATIO;
  const limitYTop = centerY - VIEWPORT_EDGE_PADDING;
  const limitYBottom =
    viewportHeight - BOTTOM_HINT_RESERVE - VIEWPORT_EDGE_PADDING - centerY;

  const { maxSxExtent, maxSyExtent } = sampleOrbitExtents(maxRadiusScale, 1);

  const fitX = limitX / maxSxExtent;
  const fitY = Math.min(limitYTop, limitYBottom) / maxSyExtent;

  return clamp(
    Math.min(fitX, fitY),
    ORBIT_FIT_SCALE_MIN,
    ORBIT_FIT_SCALE_MAX,
  );
}

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

export type ProjectedWishPosition = {
  sx: number;
  sy: number;
  zIndex: number;
  opacity: number;
  scale: number;
};

export function getWishOrbitAngle(wish: WishItem, elapsed: number): number {
  const speed = ((2 * Math.PI) / wish.orbitDuration) * wish.orbitDirection;
  return wish.orbitAngle + elapsed * speed;
}

export function getProjectedWishPosition(
  wish: WishItem,
  elapsed: number,
  orbitFitScale = 1,
): ProjectedWishPosition {
  const angle = getWishOrbitAngle(wish, elapsed);
  const radius = ORBIT_BASE_RADIUS * wish.orbitRadius * orbitFitScale;
  const orbit = orbitPoint3D(
    angle,
    radius,
    ORBIT_ELLIPSE_X,
    ORBIT_ELLIPSE_Y,
  );
  const projected = projectPoint3D(orbit.x, orbit.y, orbit.z, {
    centerX: 0,
    centerY: 0,
  });

  return {
    sx: projected.sx,
    sy: projected.sy,
    zIndex: Math.round(projected.depth * 100),
    opacity: clamp(projected.depthFade, 0.65, 1),
    scale: clamp(
      MIN_WISH_SCALE + MAX_WISH_SCALE - projected.sizeScale,
      MIN_WISH_SCALE,
      MAX_WISH_SCALE,
    ),
  };
}
