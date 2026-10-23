// ============================================================
// ROCKET BABU SPACE — SPRITE MANIFEST
// ============================================================
// Every image the game draws is listed here. To replace a sprite,
// drop a new file in this folder and point its entry at it
// (PNG, SVG, WebP all work). Keep the same key.
//
//   key: { file, w, h }
//     file  file name inside sprites/
//     w, h  size the game draws it at, in screen pixels. Art can
//           be any resolution (2x is good for crisp screens); it is
//           scaled to this box.
//
// Pieces marked STRETCH are scaled to fit a changing length
// (pipe height, beam width), so they should be plain, repeatable
// art that still looks right when stretched.
//
// Skins and bosses are looked up by id, so keys follow a pattern:
//   babu-<player skin id>, jetpack-<jetpack id>, flame-<jetpack id>,
//   boss-<boss id>. A new skin needs a new entry here plus a row in
//   the skin table in game.js.
//
// If a file is missing or fails to load, the game draws a magenta
// box with the key in it, so broken swaps are easy to spot.
// ============================================================
window.RBS_SPRITES = {
  // Player skins (cosmetic). Collision is a 14 px radius circle at the centre.
  "babu-default":  { file: "babu-default.svg", w: 40, h: 40 },
  "babu-gold":     { file: "babu-gold.svg",    w: 40, h: 40 },
  "babu-neon":     { file: "babu-neon.svg",    w: 40, h: 40 },
  "babu-shadow":   { file: "babu-shadow.svg",  w: 40, h: 40 },

  // Jetpacks (drawn behind Babu) and their flames (drawn under the jetpack while thrusting).
  "jetpack-standard": { file: "jetpack-standard.svg", w: 16, h: 28 },
  "jetpack-turbo":    { file: "jetpack-turbo.svg",    w: 16, h: 28 },
  "jetpack-eco":      { file: "jetpack-eco.svg",      w: 16, h: 28 },
  "jetpack-rocket":   { file: "jetpack-rocket.svg",   w: 16, h: 28 },
  "flame-standard":   { file: "flame-standard.svg",   w: 12, h: 24 },
  "flame-turbo":      { file: "flame-turbo.svg",      w: 12, h: 24 },
  "flame-eco":        { file: "flame-eco.svg",        w: 12, h: 24 },
  "flame-rocket":     { file: "flame-rocket.svg",     w: 12, h: 24 },

  // Collectables
  "coin":             { file: "coin.svg",             w: 20, h: 20 },
  "pickup-shield":    { file: "pickup-shield.svg",    w: 32, h: 32 },
  "pickup-slowmo":    { file: "pickup-slowmo.svg",    w: 32, h: 32 },
  "pickup-overdrive": { file: "pickup-overdrive.svg", w: 32, h: 32 },
  "pickup-fuel":      { file: "pickup-fuel.svg",      w: 32, h: 32 },
  "shield-bubble":    { file: "shield-bubble.svg",    w: 48, h: 48 },

  // Obstacles
  "pipe-body":     { file: "pipe-body.svg",     w: 56, h: 64 },  // STRETCH vertically
  "pipe-cap":      { file: "pipe-cap.svg",      w: 64, h: 18 },  // lip at the gap edge
  "saw":           { file: "saw.svg",           w: 56, h: 56 },  // spins
  "laser-emitter": { file: "laser-emitter.svg", w: 16, h: 24 },  // one at each end
  "laser-beam":    { file: "laser-beam.svg",    w: 64, h: 12 },  // STRETCH horizontally
  "crusher-arm":   { file: "crusher-arm.svg",   w: 20, h: 64 },  // STRETCH vertically
  "crusher-head":  { file: "crusher-head.svg",  w: 56, h: 40 },

  // Bosses (sit on the right edge) and their attacks
  "boss-sentinel": { file: "boss-sentinel.svg", w: 96, h: 160 },
  "boss-warden":   { file: "boss-warden.svg",   w: 96, h: 160 },
  "boss-hornet":   { file: "boss-hornet.svg",   w: 96, h: 160 },
  "boss-titan":    { file: "boss-titan.svg",    w: 96, h: 160 },
  "boss-beam":     { file: "boss-beam.svg",     w: 64, h: 26 },  // Sentinel lane laser, STRETCH horizontally
  "boss-orb":      { file: "boss-orb.svg",      w: 24, h: 24 },  // Warden homing orb
  "boss-drone":    { file: "boss-drone.svg",    w: 22, h: 22 },  // Hornet swarm drone
  "boss-wall":     { file: "boss-wall.svg",     w: 56, h: 64 }   // Titan sweeping wall, STRETCH vertically
};
