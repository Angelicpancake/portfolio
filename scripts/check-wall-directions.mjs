// Asserts the Work wall's control directions with real three.js math (headless Chrome can't render the WebGL wall).
// Mirrors the formulas in src/hooks/use3DInteraction.ts: if you change a sign there, change it here too.
// Run: node scripts/check-wall-directions.mjs
import { Group, Vector3 } from 'three';

const R = 8;
// where the tile directly in front of the camera ends up (camera at origin, looking down -z)
const frontAfter = ({ tilt = [0, 0, 0], rotY = 0, posY = 0 }) => {
  const rig = new Group();
  const wall = new Group();
  rig.add(wall);
  rig.rotation.set(...tilt);
  wall.rotation.y = rotY;
  wall.position.y = posY;
  rig.updateMatrixWorld(true);
  return new Vector3(0, 0, -R).applyMatrix4(wall.matrixWorld);
};

let fail = 0;
const check = (name, got, want) => {
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: wall moves ${got} (expected ${want})`);
};
const dirX = (v) => (v.x > 1e-6 ? 'right' : v.x < -1e-6 ? 'left' : 'none');
const dirY = (v) => (v.y > 1e-6 ? 'up' : v.y < -1e-6 ? 'down' : 'none');

// --- cursor tilt, using the same formulas as use3DInteraction.ts (x: left=-1, y: up=+1)
const tilt = (x, y) => [-y * 0.06, x * 0.09, x * 0.015];
check('cursor LEFT  -> view looks left', dirX(frontAfter({ tilt: tilt(-1, 0) })), 'right');
check('cursor RIGHT -> view looks right', dirX(frontAfter({ tilt: tilt(1, 0) })), 'left');
check('cursor UP    -> view looks up', dirY(frontAfter({ tilt: tilt(0, 1) })), 'down');
check('cursor DOWN  -> view looks down', dirY(frontAfter({ tilt: tilt(0, -1) })), 'up');

// --- drag (wall follows the pointer): rotY -= dx*SENS ; panY += dy*PAN ; position.y = -panY
const SENS = 0.0042, PAN = 0.012;
check('drag RIGHT 100px -> wall follows right', dirX(frontAfter({ rotY: -100 * SENS })), 'right');
check('drag LEFT  100px -> wall follows left', dirX(frontAfter({ rotY: 100 * SENS })), 'left');
check('drag DOWN  100px -> wall follows down', dirY(frontAfter({ posY: -(100 * PAN) })), 'down');
check('drag UP    100px -> wall follows up', dirY(frontAfter({ posY: -(-100 * PAN) })), 'up');

// --- wheel: velY += deltaX*k (rotY up) ; velPan -= deltaY*k (panY down => position.y up)
check('wheel scroll DOWN  -> wall moves up (like a page)', dirY(frontAfter({ posY: -(-120 * 0.012) })), 'up');
check('wheel scroll UP    -> wall moves down', dirY(frontAfter({ posY: -(120 * 0.012) })), 'down');
check('wheel scroll RIGHT -> wall moves left', dirX(frontAfter({ rotY: 120 * 0.0012 })), 'left');

console.log(fail ? `\n${fail} FAILED` : '\nall directions correct');
process.exit(fail ? 1 : 0);
