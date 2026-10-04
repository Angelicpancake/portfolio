# Prompt: change or audit the Work wall's control directions

Paste into Claude Code. Fill in `<…>`; delete lines that don't apply.

---

On the Work tab's 3D wall (`src/hooks/use3DInteraction.ts`), <describe the problem, e.g. "moving the cursor left makes the view feel like it turns right" / "dragging feels inverted" / "make tilt subtler">.

**Conventions (the wall is a cylinder around a camera at the origin looking down -z)**

| Input | Expected result |
|---|---|
| Cursor moves left / right | The view follows the cursor: the wall slides right / left (camera looks left / right) |
| Cursor moves up / down | The view follows the cursor: the wall slides down / up |
| Drag right / left / down / up | The wall follows the pointer (grab-and-move) |
| Wheel / trackpad scroll down | The wall moves up, like a page (scroll up: down) |
| Wheel / trackpad scroll right | The wall moves left (scroll left: right) |

**Where each lives in `use3DInteraction.ts`**
- Cursor tilt (applied to the `rig` group): `rotation.x = -y*k`, `rotation.y = x*k`, `rotation.z = x*k2`; `x`/`y` are `frame.pointer` (left/up are -1/+1).
- Drag: `rotY -= dx*SENS` (horizontal), `panY += dy*PAN` (vertical, because `wall.position.y = -panY`); the inertia velocities (`velY`, `velPan`) must use the same signs.
- Wheel: `velY += deltaX*k`, `velPan -= deltaY*k`.

**Math to remember (three.js, right-handed):** rotating the wall by `+θ` about Y moves the tile in front of the camera LEFT (`x = -R·sinθ`); rotating by `+θ` about X moves it UP (`y = +R·sinθ`). The wall moves opposite to where the view turns, so for "cursor left → view looks left" the wall must slide right, which needs a negative Y rotation when the cursor is left. Don't trust mental sign-flipping; use the check script.

**Rules**
- Change signs/magnitudes only in `use3DInteraction.ts`; keep drag inertia, clamp (`maxPanY`) and the click-vs-drag threshold intact.
- Keep tilt, drag inertia and wheel mutually consistent (the table above); if one direction changes, say why in the report.
- Update `scripts/check-wall-directions.mjs` to mirror any formula you change, and make it fail first on the old behaviour (revert a sign temporarily to prove the check can fail).

**Verify and report**
`node scripts/check-wall-directions.mjs` (must print "all directions correct"), then `npm run type-check && npm run lint && NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. Headless Chrome cannot render the WebGL wall, so also tell me exactly what to try in `npm run dev` (move the cursor left, drag down, scroll down) and what I should see. Commit only the hook, the check script and docs.
