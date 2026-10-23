# Rocket Babu Journey Through Space — Prototype Plan

A flappy-style prototype for the Babu Arcade. Instead of tapping to flap, the player holds to fire a jetpack. Every 2000 m a boss fight starts. Runs earn coins that are banked between sessions and spent in a shop on player skins and jetpack skins. Pickups change how a run plays.

Status: **prototype, playable, placeholder art.** Lives at `arcade/RocketBabu2/`. Display name: "Rocket Babu Journey Through Space".

---

## 1. Fit with the arcade

Follows the existing game pattern (see `arcade/_template/index.html`):

- One self-contained `index.html` with inline CSS and JS, so the folder is a complete game.
- A 1280x720 `thumbnail.png` next to it.
- An entry in `arcade/games.json`. `arcade.html` and `play.html` read that file, so nothing else changes.
- Fixed 60 UPS simulation with a variable-rate render loop, DPR-aware canvas, keyboard and pointer input. All taken from the template.
- Runs inside the 4:3 iframe on `play.html`, and also works opened directly.

Registry entry:

```json
{
  "id": "rocket-babu-2",
  "folder": "RocketBabu2",
  "name": "Rocket Babu Journey Through Space",
  "thumbnail": "RocketBabu2/thumbnail.png",
  "type": "internal",
  "description": "Hold to burn the jetpack. Grab coins and power-ups, then spend them on skins.",
  "tags": ["flappy", "arcade", "prototype"]
}
```

---

## 2. Core loop

1. **Title.** Tap or Space to start. Shop button. Shows best distance and coins.
2. **Run.** Babu scrolls right. Pipe columns with gaps scroll in. Hold to thrust; release to fall. Fly through gaps, collect coins, grab power-ups.
3. **Crash.** Run ends. Coins from the run are added to the bank. Best distance is updated. Save is written.
4. **Shop.** Spend banked coins on skins. Equip what you own. Back to title, then retry.

Score is distance (shown as metres, 1 m = 10 px travelled). Coins are a separate currency.

---

## 3. Controls

| Input | Action |
|---|---|
| Hold Space / hold mouse / hold touch | Jetpack thrust (burns fuel) |
| Release | Fall, fuel recharges |
| Tap / Space on title or after game over | Start / retry |
| Tap on a button | Shop, equip, buy, back |

The jetpack replaces flap. One design decision to test: holding means constant thrust with fuel, not a tap-impulse. This gives finer control and makes Fuel a real resource.

---

## 4. Jetpack mechanics

| Value | Setting |
|---|---|
| Gravity | 1000 px/s² |
| Thrust | 2100 px/s² while held (times skin multiplier) |
| Max vertical speed | ±600 px/s |
| Fuel max | 160 |
| Fuel drain | 38 /s while thrusting (times skin drain) |
| Fuel regen | 30 /s when not thrusting |
| Fuel empty | Thrust stops until fuel regenerates |

The ceiling is a soft stop. The floor is a hard stop and kills unless shielded.

---

## 5. Obstacles and world

- **Columns** every 300 px. Each column spawns one obstacle, picked by weight:

| Obstacle | Weight | Behaviour | Beat it by |
|---|---|---|---|
| Pipe | 5 | Two blocks with a 180 px gap at a random height | Threading the gap |
| Saw | 2 | Spinning disc that bobs up and down | Timing a dip or climb past it |
| Laser | 2 | Horizontal beam that blinks on for 1.4 s, off for 1.0 s | Waiting for the off phase |
| Crusher | 2 | Block hanging from the ceiling that sways up and down | Staying clear of its lower edge |

- Obstacles are placeholder shapes. Each type has its own draw and hit test, so real sprites can replace them one at a time.
- **Scroll speed** starts at 170 px/s and ramps up by distance, capped at 1.6x. Ramp rate: `SCROLL_RAMP = 0.00015` per px.
- **Coin row.** Three coins sit in the gap line between columns.
- Columns and coins are culled once they leave the screen.

---

## 5b. Boss fights

- **Schedule.** Normal flying runs for 2000 m, then a boss fight begins. Each fight lasts 1000 m. When it ends, normal flying resumes for another 2000 m before the next boss. Sequence: 0–2000 m normal, 2000–3000 m boss, 3000–5000 m normal, 5000–6000 m boss, and so on.
- **Order.** The four bosses are shuffled once per run. The same order repeats after the fourth boss.
- **Clearing.** At boss start all obstacles and shots are removed. No obstacles spawn during the fight. Coins and power-ups still spawn.
- **Power-ups in boss fights.** Slow-mo and Overdrive never spawn during a boss fight, and any still running are cleared when it starts. Shield and Fuel boost still spawn.
- **Defeat.** The boss is defeated when the player survives the 1000 m arena. There is no damage model in this prototype.
- **Hit.** Any boss attack that touches Babu counts as a hit. Shield absorbs one hit like any other.
- **HUD.** Shows "NEXT BOSS IN x m" during normal flying and "BOSS NAME x m left" during a fight.
- **Tuning.** `BOSS_EVERY`, `BOSS_LENGTH`, `BOSSES` and `M_TO_PX` at the top of the config block.

Each boss has its own attack for the full 1000 m:

| Boss | Attack | How it works | Colour (placeholder) |
|---|---|---|---|
| Sentinel | Lane laser | Every cycle it picks one of three lanes at random. The lane is marked for 1.0 s (safe), the laser fires across the full width for 0.6 s, then it rests for 0.8 s. | Red |
| Warden | Homing orbs | Fires an orb every 1.4 s. Each orb drifts left and slowly steers toward Babu's height, capped so it stays dodgeable. Lasts up to 8 s. | Violet |
| Hornet | Drone swarm | Every 2.5 s, a wave of five drones starts at a random height on the right and weaves up and down as it crosses the screen. | Gold |
| Titan | Sweeping walls | Every 3.2 s, a fast full-height wall with one gap sweeps across the screen. | Teal |

- **Lanes** are the three horizontal bands of the screen. Only the Sentinel uses them.
- **Tuning values.** Lane timings are in the `BOSSES` entries. Shot speeds, intervals and sizes are in `updateBossAttack()` and `fireBossShot()`.

## 6. Pickups

Spawn chance per column is 40%. Type is weighted.

| Pickup | Weight | Effect | Duration | Why it matters |
|---|---|---|---|---|
| **Shield** (S) | 2 | Absorbs one hit (pipe or floor). Pipe that hit is removed. 1.2 s of invulnerability after. | Until hit | Safety net. Lets the player take one risky line. |
| **Slow-mo** (T) | 3 | Scroll speed halved. | 5 s | Easier threading. Calmer pacing. |
| **Overdrive** (O) | 3 | Scroll speed 1.5x. Coins worth 2. | 5 s | Risk for reward. Rewards fast play. |
| **Fuel boost** (F) | 2 | Refills fuel. Fuel regen 3x. | 4 s | Lets you hold thrust through tight sections. |

Timed effects can overlap (e.g. Slow-mo and Fuel boost together). Only one shield can be held at a time. Timers are shown in the HUD.

---

## 7. Economy

- **Coins** are collected in-run (1 each, 2 under Overdrive) and banked on crash.
- **Best distance** is saved separately.
- **Prices** (placeholder):

| Player skin | Price | Note |
|---|---|---|
| Babu (default) | 0 | Owned at start |
| Gold Babu | 150 | |
| Neon | 300 | |
| Shadow | 500 | |

| Jetpack skin | Price | Thrust | Fuel drain | Perk |
|---|---|---|---|---|
| Standard (default) | 0 | 1.00x | 1.00x | None |
| Turbo | 200 | 1.15x | 1.00x | Coin magnet (pulls coins within 60 px) |
| Eco | 250 | 1.00x | 0.70x | Fuel use -30% (same as the drain column) |
| Rocket | 600 | 1.30x | 1.25x | Power-ups last 1.5x as long |

- Perks live on jetpacks only. Player skins are cosmetic and carry no stats or perks. Jetpack skins change stats and carry one perk each.
- Shop tabs: Players / Jetpacks. Cards show EQUIP, EQUIPPED, BUY price, or COINS needed.

Tuning notes: the coin economy has not been balanced. Each run currently yields a handful of coins. Playtesting should decide whether the 150–600 prices are reachable in a sensible number of runs.

---

## 8. Save system

- Stored in `localStorage` under the key `babu-arcade.jetpack-babu.v1`.
- Fields: `coins`, `best`, `owned.player[]`, `owned.jetpack[]`, `equipped.player`, `equipped.jetpack`.
- Written on crash, purchase, and equip.
- Load validates ids against the skin tables. Unknown ids are dropped. The free default is always kept.
- Wrapped in try/catch. If storage is blocked, the game still plays, progress just won't persist.

Limits of this approach: it is per browser and per origin. It does not sync across devices. If the game moves to a shared arcade account system later, swap the `loadSave` / `persist` pair.

---

## 9. Art and placeholders

Everything visible is a placeholder shape, meant to be replaced:

| Thing | Placeholder | Where to swap |
|---|---|---|
| Babu | Coloured disc (skin colour) | `drawWorld()`, `PLAYER_SKINS` |
| Jetpack | Grey box with flame triangle | `drawJetpack()`, `JETPACK_SKINS` |
| Pipes | Dark rectangles | `drawWorld()` |
| Coins | Gold disc | `drawWorld()` |
| Power-ups | Coloured disc with letter | `drawWorld()`, `PICKUPS` |
| Obstacles | Pipe, spinning disc, blinking bar, hanging block | `drawObstacle()`, `obstacleHits()`, `OBSTACLE_WEIGHTS` |
| Thumbnail | Generated 1280x720 PNG | `RocketBabu2/thumbnail.png` |

Swap-in notes: the draw helpers are separate functions, so real sprites can replace them without touching logic. The skin tables are data-only, so new skins need one new object each.

---

## 10. Screens

- **Title.** Logo, two-line pitch, pulsing start prompt, SHOP button, best and coins footer.
- **HUD (in run).** Metres top-left. Coins top-right. Fuel bar under the metres. Active effects listed below with remaining seconds.
- **Crash.** Distance and coins this run. Banked total and best. Retry prompt after 0.6 s. SHOP and MENU buttons.
- **Shop.** Coins total. PLAYERS / JETPACKS tabs. 2x2 card grid with swatch, name and action button. BACK.

---

## 11. Known limitations (prototype)

- No sound, no particles, no death animation.
- Player skins are cosmetic. No per-skin perks yet.
- Pickups are not yet on a schedule. Spawn is random per column.
- Only one shield at a time. Timed effects can overlap, but there is no pickup stacking.
- Shop layout assumes a reasonable viewport height. Very short windows may overlap the card grid.
- The dev FPS readout is on. Turn off `SHOW_STATS` for release.
- Save is local to the browser.
- The folder and id are `RocketBabu2` / `rocket-babu-2`. The save key is still `babu-arcade.jetpack-babu.v1`, so progress from the earlier build is kept. `arcade/RocketBabu/` already exists as a separate game and was not touched.
- Bosses have no health. They are beaten by surviving their arena.

---

## 12. Open questions for the team

1. **Holding vs. tapping.** Is continuous hold the right feel, or should taps give a short burst?
2. **Fuel vs. no fuel.** Is the fuel bar the right limit, or should it be unlimited with a heat/cooldown?
3. **Coin rate.** How many coins per run should feel good? This sets the shop prices.
4. **Skin perks.** Should player skins ever do something, or stay purely cosmetic?
5. **Save scope.** Per-browser is fine for a prototype. Should it move to the arcade's account system later?
6. **Difficulty.** Should the scroll ramp and gap size tighten over time, or stay flat?

---

## 13. Next steps

1. Playtest the hold feel and fuel pacing. Adjust the jetpack table.
2. Balance coin income against shop prices.
3. Replace placeholder art with real sprites and a real thumbnail.
4. Add sound and a death effect.
5. Decide on the open questions above, then promote from prototype to a real arcade entry.
