# Rocket Babu Space — V1 Prototype

A flappy-style run for the Babu Arcade. Hold to burn a jetpack instead of tapping to flap. Fly past obstacles, grab power-ups, survive a boss every 2000 m, bank coins and spend them on skins.

Status: **v1 prototype, playable, placeholder art. Hidden from the arcade shelf.**

Based on the Rocket Babu Space design artifact. This folder holds the whole game.

---

## Files

```
arcade/RocketBabuSpace/
  index.html        canvas page; loads the two scripts below
  game.js           all game logic, tuning and rendering
  thumbnail.svg     1280x720 cover used by the arcade
  README.md         this file
  sprites/
    manifest.js     sprite key -> file + draw size
    *.svg           placeholder art, one file per sprite
```

## Playing it while hidden

The game is not listed in `arcade/games.json`, so the arcade shelf doesn't show it and nothing outside this folder points to it. Open it directly at `/arcade/RocketBabuSpace/`.

To publish it, add this entry to `arcade/games.json`:

```json
{
  "id": "rocket-babu-space",
  "folder": "RocketBabuSpace",
  "name": "Rocket Babu Space",
  "thumbnail": "RocketBabuSpace/thumbnail.svg",
  "type": "internal",
  "description": "Hold to burn the jetpack. Survive boss fights, grab power-ups, then spend coins on skins.",
  "tags": ["flappy", "arcade", "prototype"]
}
```

---

## Swapping sprites

Every image lives in `sprites/` and is listed in `sprites/manifest.js`.

1. Put the new file in `sprites/` (PNG, SVG or WebP).
2. In `manifest.js`, change that key's `file` to the new file name. If the file name is the same, nothing else changes.
3. Adjust `w` / `h` if the art should be drawn at a different size. Art can be any resolution; 2x the draw size looks crisp on high-DPI screens.

Collision does not depend on sprite size, so new art never changes gameplay. A missing or broken file shows as a magenta box with its key.

| Key | Draw size | Notes |
|---|---|---|
| `babu-default`, `babu-gold`, `babu-neon`, `babu-shadow` | 40x40 | Player skins. Hitbox is a 14 px radius circle at the centre. Facing right. |
| `jetpack-<id>` | 16x28 | Behind Babu's left side. ids: standard, turbo, eco, rocket. |
| `flame-<id>` | 12x24 | Hangs from the jetpack nozzle while thrusting; height flickers. |
| `coin` | 20x20 | |
| `pickup-shield`, `pickup-slowmo`, `pickup-overdrive`, `pickup-fuel` | 32x32 | |
| `shield-bubble` | 48x48 | Drawn over Babu while a shield is held. Keep it see-through. |
| `pipe-body` | 56 wide | Stretched vertically to fill each pipe. |
| `pipe-cap` | 64x18 | Lip at the gap edge of each pipe. |
| `saw` | 56x56 | Rotates. |
| `laser-emitter` | 16x24 | One at each end of a laser. |
| `laser-beam` | 12 tall | Stretched horizontally. |
| `crusher-arm` | 20 wide | Stretched vertically from the ceiling. |
| `crusher-head` | 56x40 | The part that hits. |
| `boss-sentinel`, `boss-warden`, `boss-hornet`, `boss-titan` | 96x160 | Sit on the right edge, facing left. |
| `boss-beam` | 26 tall | Sentinel lane laser, stretched horizontally. |
| `boss-orb` | 24x24 | Warden homing orb. |
| `boss-drone` | 22x22 | Hornet swarm drone. |
| `boss-wall` | 56 wide | Titan sweeping wall, stretched vertically. |

New skin: add a row to `PLAYER_SKINS` or `JETPACK_SKINS` in `game.js`, then add `babu-<id>` (or `jetpack-<id>` and `flame-<id>`) to the manifest.

---

## What's in v1

**Controls.** Hold Space, W, Up, mouse or touch to thrust. Release to fall and refill fuel. Tap or Space to start and retry.

**Jetpack.** Gravity 1000 px/s², thrust 2100 px/s², max speed ±600 px/s. Fuel 160, drains 38/s while thrusting, refills 30/s otherwise. Ceiling is a soft stop; the floor kills unless shielded.

**Obstacles.** One per column, every 300 px, picked by weight: pipe 5, saw 2, laser 2, crusher 2. Scroll starts at 170 px/s and ramps up to 1.6x. Three coins float between columns.

**Bosses.** 2000 m of normal flying, then a 1000 m boss arena, repeating. Four bosses, shuffled once per run. Obstacles clear and stop spawning during a fight. Survive the arena to win.

| Boss | Attack |
|---|---|
| Sentinel | Marks one of three lanes for 1.0 s, fires a laser along it for 0.6 s, rests 0.8 s. |
| Warden | Homing orb every 1.4 s. |
| Hornet | Wave of five weaving drones every 2.5 s. |
| Titan | Full-height wall with one gap every 3.2 s. |

**Power-ups.** 40% chance per column.

| Power-up | Effect | Time |
|---|---|---|
| Shield | Absorbs one hit, then 1.2 s of safety | Until hit |
| Slow-mo | Half scroll speed (not in boss fights) | 5 s |
| Overdrive | 1.5x scroll, coins worth 2 (not in boss fights) | 5 s |
| Fuel boost | Refills fuel, 3x regen | 4 s |

**Shop.** Player skins are cosmetic: Babu (free), Gold Babu 150, Neon 300, Shadow 500. Jetpacks change how you fly:

| Jetpack | Price | Thrust | Fuel use | Perk |
|---|---|---|---|---|
| Standard | Free | 1.00x | 1.00x | None |
| Turbo | 200 | 1.15x | 1.00x | Coin magnet |
| Eco | 250 | 1.00x | 0.70x | Fuel use -30% |
| Rocket | 600 | 1.30x | 1.25x | Power-ups last 1.5x |

**Save.** `localStorage` key `babu-arcade.rocket-babu-space.v1`: coins, best distance, owned and equipped skins. Written on crash, purchase and equip. If storage is blocked the game still plays.

All tuning values are at the top of `game.js`.

---

## Testing shortcuts

From the browser console while a run is going:

- `RBS.debug.skipTo(1990)` jumps to 1990 m (10 m before the first boss).
- `RBS.debug.addCoins(1000)` adds banked coins for shop testing.

---

## Known limitations

- No sound, particles or death animation.
- Bosses have no health; they are beaten by surviving.
- Coin income is not balanced against shop prices yet.
- Pickups spawn at random, not on a schedule.
- Shop layout assumes a reasonable window height.
- The FPS readout is on. Set `SHOW_STATS = false` in `game.js` for release.
- Save is per browser.

## Open questions

1. Continuous hold, or should a tap give a short burst?
2. Fuel bar, or heat and cooldown?
3. How many coins per run should feel good?
4. Should player skins ever carry a perk?
5. Should progress move to an arcade account later?
6. Should gaps tighten over time?
