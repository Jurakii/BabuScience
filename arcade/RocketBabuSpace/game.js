// ============================================================
// ROCKET BABU SPACE — V1 PROTOTYPE
// ============================================================
// Flappy-style, but hold to burn the jetpack instead of tapping
// to flap. Fly through gaps, collect coins, grab power-ups that
// change how the run plays, survive a boss every 2000 m, then
// spend coins in the shop on player skins and jetpack skins.
//
// Built from arcade/_template/index.html: same fixed-step loop,
// canvas sizing and input plumbing.
//
// All art comes from sprites/ via sprites/manifest.js. Collision
// uses simple circles and boxes, so sprites can change freely
// without touching gameplay.
//
// Progress is saved to localStorage under SAVE_KEY. It is per
// browser, so it resets on another device — fine for a prototype.
// ============================================================
(function () {
  "use strict";

  // ----------------------------------------------------------
  // CONFIG
  // ----------------------------------------------------------
  var UPS = 60;                 // fixed simulation rate (updates per second)
  var STEP = 1 / UPS;           // seconds per update
  var MAX_FRAME_TIME = 0.25;    // clamp huge gaps (tab backgrounded, breakpoint, etc.)
  var SHOW_STATS = true;        // dev FPS readout in the corner

  // Physics and balance. Tune these first.
  var GRAVITY = 1000;           // px/s^2 pulling Babu down
  var THRUST = 2100;            // px/s^2 jetpack push while held (before skin multiplier)
  var MAX_VY = 600;             // terminal speed either way
  var FUEL_MAX = 160;
  var FUEL_DRAIN = 38;          // fuel per second while thrusting (before skin multiplier)
  var FUEL_REGEN = 30;          // fuel per second while not thrusting
  var FUEL_BOOST_MULT = 3;      // regen multiplier while the Fuel power-up is active
  var SCROLL_BASE = 170;        // px/s the world scrolls at the start
  var SCROLL_RAMP = 0.00015;    // speed-up per px travelled
  var SCROLL_MAX = 1.6;         // cap on the speed-up multiplier
  var PLAYER_R = 14;            // collision radius; the sprite can be bigger
  var PLAYER_X_FRAC = 0.25;     // Babu's x position as a fraction of screen width
  var PIPE_W = 56;
  var GAP = 180;                // vertical opening in each pipe column
  var PIPE_SPACING = 300;       // px between columns
  var COIN_R = 9;
  var PICKUP_R = 16;
  var PICKUP_CHANCE = 0.4;      // chance a column also spawns a power-up
  var EFFECT_TIME = 5;          // seconds for Slow-mo / Overdrive
  var FUEL_EFFECT_TIME = 4;     // seconds for Fuel boost
  var INVULN_TIME = 1.2;        // seconds of safety after a shield breaks
  var RETRY_DELAY = 0.6;        // seconds before a game-over screen accepts a restart

  // Boss encounters. Distances are in metres; 1 m = M_TO_PX px of travel.
  var M_TO_PX = 10;
  var BOSS_EVERY = 2000;        // metres of normal flying between boss fights
  var BOSS_LENGTH = 1000;       // metres a boss fight lasts
  var LANE_COUNT = 3;
  var BEAM_H = 26;
  // Each boss has its own attack for the whole fight. Sprite key is "boss-" + id.
  //   lane:    picks a lane, shows it (aim), fires a laser along it (fire), then rests. Times in seconds.
  //   homing:  launches orbs every `interval` seconds that slowly steer toward Babu.
  //   swarm:   sends a wave of drones every `interval` seconds that weave across the screen.
  //   wall:    sweeps a wall with one gap across the screen every `interval` seconds.
  var BOSSES = [
    { id: "sentinel", name: "Sentinel", color: "#ff6b6b", attack: "lane",   aim: 1.0, fire: 0.6, rest: 0.8 },
    { id: "warden",   name: "Warden",   color: "#b58cff", attack: "homing", interval: 1.4 },
    { id: "hornet",   name: "Hornet",   color: "#ffd54a", attack: "swarm",  interval: 2.5 },
    { id: "titan",    name: "Titan",    color: "#40ffd0", attack: "wall",   interval: 3.2 }
  ];

  var SAVE_KEY = "babu-arcade.rocket-babu-space.v1";

  // ----------------------------------------------------------
  // SKINS — sprite key is "babu-" / "jetpack-" / "flame-" + id
  // ----------------------------------------------------------
  // Player skins are cosmetic only. Perks belong to jetpacks.
  var PLAYER_SKINS = [
    { id: "default", name: "Babu",      price: 0 },
    { id: "gold",    name: "Gold Babu", price: 150 },
    { id: "neon",    name: "Neon",      price: 300 },
    { id: "shadow",  name: "Shadow",    price: 500 }
  ];

  // thrust = acceleration multiplier, drain = fuel-use multiplier,
  // magnet = coin pull radius in px, durationMult = power-up duration multiplier.
  // color tints the fuel bar.
  var JETPACK_SKINS = [
    { id: "standard", name: "Standard", price: 0,   thrust: 1.0,  drain: 1.0,  magnet: 0,  durationMult: 1.0, perk: "No perk",             color: "#ff8a00" },
    { id: "turbo",    name: "Turbo",    price: 200, thrust: 1.15, drain: 1.0,  magnet: 60, durationMult: 1.0, perk: "Coin magnet",         color: "#ff3b3b" },
    { id: "eco",      name: "Eco",      price: 250, thrust: 1.0,  drain: 0.7,  magnet: 0,  durationMult: 1.0, perk: "Fuel use -30%",       color: "#3bd1ff" },
    { id: "rocket",   name: "Rocket",   price: 600, thrust: 1.3,  drain: 1.25, magnet: 0,  durationMult: 1.5, perk: "Power-ups +50% time", color: "#ffe14d" }
  ];

  // Power-ups. Sprite key is "pickup-" + type. weight = spawn likelihood.
  var PICKUPS = {
    shield:    { name: "SHIELD",     color: "#4dd2ff", weight: 2 },
    slowmo:    { name: "SLOW-MO",    color: "#b58cff", weight: 3 },
    overdrive: { name: "OVERDRIVE",  color: "#ff6b6b", weight: 3 },
    fuel:      { name: "FUEL BOOST", color: "#7dff7a", weight: 2 }
  };

  // Obstacle mix. Each spawned column picks one of these by weight.
  var OBSTACLE_WEIGHTS = { pipe: 5, saw: 2, laser: 2, crusher: 2 };

  // ----------------------------------------------------------
  // SPRITES — loaded from sprites/manifest.js
  // ----------------------------------------------------------
  var SPRITE_DIR = "sprites/";
  var MANIFEST = window.RBS_SPRITES || {};
  var sprites = Object.create(null);

  Object.keys(MANIFEST).forEach(function (key) {
    var entry = MANIFEST[key];
    var s = { img: new Image(), w: entry.w, h: entry.h, ready: false };
    s.img.onload = function () { s.ready = true; };
    s.img.onerror = function () { console.warn("Rocket Babu Space: sprite failed to load:", key, entry.file); };
    s.img.src = SPRITE_DIR + entry.file;
    sprites[key] = s;
  });

  // Draws a sprite centred on (cx, cy). w/h default to the manifest size.
  function drawSprite(key, cx, cy, w, h, rot) {
    var s = sprites[key];
    w = w || (s ? s.w : 24);
    h = h || (s ? s.h : 24);
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    if (s && s.ready) {
      ctx.drawImage(s.img, -w / 2, -h / 2, w, h);
    } else {
      drawMissing(key, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // Draws a sprite stretched to fill a box (x, y is the top-left).
  function drawSpriteBox(key, x, y, w, h) {
    if (w <= 0 || h <= 0) return;
    var s = sprites[key];
    if (s && s.ready) {
      ctx.drawImage(s.img, x, y, w, h);
    } else {
      drawMissing(key, x, y, w, h);
    }
  }

  // Magenta box so a missing or broken sprite file is obvious.
  function drawMissing(key, x, y, w, h) {
    ctx.fillStyle = "rgba(255,0,255,0.35)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    if (w > 30) {
      ctx.fillStyle = "#fff";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(key, x + w / 2, y + h / 2);
    }
  }

  // ----------------------------------------------------------
  // SAVE — coins, best score, owned + equipped skins
  // ----------------------------------------------------------
  var DEFAULT_SAVE = {
    coins: 0,
    best: 0,
    owned: { player: ["default"], jetpack: ["standard"] },
    equipped: { player: "default", jetpack: "standard" }
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function findSkin(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0];
  }

  function loadSave() {
    try {
      var raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return clone(DEFAULT_SAVE);

      var data = JSON.parse(raw);
      var s = clone(DEFAULT_SAVE);
      if (typeof data.coins === "number") s.coins = data.coins;
      if (typeof data.best === "number") s.best = data.best;

      if (data.owned) {
        s.owned.player = filterOwned(data.owned.player, PLAYER_SKINS);
        s.owned.jetpack = filterOwned(data.owned.jetpack, JETPACK_SKINS);
      }
      if (data.equipped) {
        if (s.owned.player.indexOf(data.equipped.player) >= 0) s.equipped.player = data.equipped.player;
        if (s.owned.jetpack.indexOf(data.equipped.jetpack) >= 0) s.equipped.jetpack = data.equipped.jetpack;
      }
      return s;
    } catch (e) {
      return clone(DEFAULT_SAVE);
    }
  }

  // Keep only ids that still exist in the skin table; always keep the free default.
  function filterOwned(ids, skins) {
    var out = [];
    if (Array.isArray(ids)) {
      ids.forEach(function (id) {
        if (findSkin(skins, id).id === id && out.indexOf(id) < 0) out.push(id);
      });
    }
    if (out.indexOf(skins[0].id) < 0) out.unshift(skins[0].id);
    return out;
  }

  function persist() {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
      // storage blocked or full — the game still plays, progress just won't stick
    }
  }

  var save = loadSave();

  function purchase(kind, skin) {
    if (save.coins < skin.price) return;
    save.coins -= skin.price;
    save.owned[kind].push(skin.id);
    save.equipped[kind] = skin.id;
    persist();
  }

  function equip(kind, id) {
    save.equipped[kind] = id;
    persist();
  }

  // ----------------------------------------------------------
  // CANVAS + DPR-AWARE SIZING
  // ----------------------------------------------------------
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");

  var width = 0;   // logical (CSS) size, in pixels
  var height = 0;

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    // Backing store is scaled by devicePixelRatio for crisp rendering;
    // all drawing happens in logical (CSS) pixels via setTransform.
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);

  // ----------------------------------------------------------
  // INPUT — hold to thrust, tap/click for menus
  // ----------------------------------------------------------
  var keys = Object.create(null);

  var KEY_ALIASES = {
    ArrowUp: "action", w: "action", W: "action",
    " ": "action"
  };

  window.addEventListener("keydown", function (e) {
    var action = KEY_ALIASES[e.key];
    if (action) {
      keys[action] = true;
      e.preventDefault(); // stop arrow keys / space from scrolling the page
    }
    if (e.key === " " && !e.repeat) startIfReady();
  });

  window.addEventListener("keyup", function (e) {
    var action = KEY_ALIASES[e.key];
    if (action) keys[action] = false;
  });

  // The iframe needs focus for key events to fire.
  window.addEventListener("load", function () { canvas.focus(); });

  var pointer = { down: false, x: 0, y: 0 };

  function setPointerFromEvent(e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  }

  canvas.addEventListener("pointerdown", function (e) {
    canvas.focus();
    setPointerFromEvent(e);
    pointer.down = true;
    handleTap(pointer.x, pointer.y);
  });

  window.addEventListener("pointerup", function () { pointer.down = false; });
  window.addEventListener("pointercancel", function () { pointer.down = false; });

  // ----------------------------------------------------------
  // GAME STATE
  // ----------------------------------------------------------
  var state = "title";     // "title" | "play" | "over" | "shop"
  var stateTime = 0;       // seconds since the current state started
  var shopTab = "player";  // "player" | "jetpack"
  var hits = [];           // clickable regions, rebuilt every render
  var run = null;          // the current run, null on the title screen
  var lastRun = { meters: 0, coins: 0, bosses: 0 };

  var stars = [];
  for (var si = 0; si < 90; si++) {
    stars.push({ x: Math.random(), y: Math.random(), s: 0.2 + Math.random() * 0.8 });
  }

  function setState(next) {
    state = next;
    stateTime = 0;
  }

  function newRun() {
    return {
      y: height / 2,
      vy: 0,
      fuel: FUEL_MAX,
      thrusting: false,
      dist: 0,
      coins: 0,
      spawnDist: PIPE_SPACING,               // so the first column appears immediately
      obstacles: [],
      phase: "normal",                       // "normal" | "boss"
      nextBossDist: BOSS_EVERY * M_TO_PX,
      bossOrder: shuffle([0, 1, 2, 3]),      // picked once per run, repeats after the 4th
      bossKills: 0,
      boss: null,
      bossStartDist: 0,
      shots: [],                             // projectiles fired by non-laser bosses
      coinList: [],
      pickups: [],
      popups: [],
      effects: { shield: false, slowmo: 0, overdrive: 0, fuel: 0, invuln: 0 }
    };
  }

  function startGame() {
    run = newRun();
    setState("play");
  }

  function startIfReady() {
    if (state === "title" || (state === "over" && stateTime > RETRY_DELAY)) startGame();
  }

  function openShop() {
    setState("shop");
  }

  function endRun() {
    var meters = Math.floor(run.dist / M_TO_PX);
    lastRun = { meters: meters, coins: run.coins, bosses: run.bossKills };
    save.coins += run.coins;
    if (meters > save.best) save.best = meters;
    persist();
    setState("over");
  }

  function playerX() {
    return width * PLAYER_X_FRAC;
  }

  function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
  }

  function near(ax, ay, bx, by, r) {
    var dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy < r * r;
  }

  function circleHitsRect(cx, cy, r, rx, ry, rw, rh) {
    var nx = clamp(cx, rx, rx + rw);
    var ny = clamp(cy, ry, ry + rh);
    return near(cx, cy, nx, ny, r);
  }

  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function pickWeighted(names, weightOf) {
    var total = 0;
    names.forEach(function (n) { total += weightOf(n); });
    var r = Math.random() * total;
    for (var i = 0; i < names.length; i++) {
      r -= weightOf(names[i]);
      if (r < 0) return names[i];
    }
    return names[0];
  }

  // ----------------------------------------------------------
  // WORLD GENERATION
  // ----------------------------------------------------------
  function spawnColumn() {
    var x = width + 40;
    var margin = GAP / 2 + 40;
    var gapY = margin + Math.random() * Math.max(1, height - margin * 2);

    // No obstacles spawn during a boss fight; coins and power-ups still do.
    if (run.phase === "normal") run.obstacles.push(makeObstacle(pickObstacleType(), x, gapY));

    // A short row of coins floats in the open space between columns.
    var cx = x + PIPE_SPACING * 0.5;
    for (var i = 0; i < 3; i++) {
      run.coinList.push({ x: cx + i * 26, y: gapY, taken: false });
    }

    if (Math.random() < PICKUP_CHANCE) {
      run.pickups.push({
        x: cx,
        y: 60 + Math.random() * Math.max(1, height - 120),
        type: pickPickupType(),
        taken: false
      });
    }
  }

  function pickPickupType() {
    // Slow-mo and Overdrive are left out during boss fights.
    var names = Object.keys(PICKUPS).filter(function (n) {
      return !(run.phase === "boss" && (n === "slowmo" || n === "overdrive"));
    });
    return pickWeighted(names, function (n) { return PICKUPS[n].weight; });
  }

  function pickObstacleType() {
    return pickWeighted(Object.keys(OBSTACLE_WEIGHTS), function (n) { return OBSTACLE_WEIGHTS[n]; });
  }

  function makeObstacle(kind, x, gapY) {
    if (kind === "saw") return { type: "saw", x: x + PIPE_W / 2, baseY: gapY, y: gapY, r: 26, t: 0, gone: false };
    if (kind === "laser") return { type: "laser", x: x - 40, y: gapY, w: 160, h: 10, t: 0, gone: false };
    if (kind === "crusher") return { type: "crusher", x: x, gapY: gapY, bottom: gapY - GAP / 2, t: 0, gone: false };
    return { type: "pipe", x: x, gapY: gapY, t: 0, gone: false };
  }

  // Lasers blink: on for 1.4 s, off for 1.0 s.
  function isLaserOn(o) {
    return (o.t % 2.4) < 1.4;
  }

  function updateObstacle(o, dt) {
    o.t += dt;
    if (o.type === "saw") o.y = clamp(o.baseY + Math.sin(o.t * 1.8) * 90, 30, height - 30);
    if (o.type === "crusher") o.bottom = clamp(o.gapY - GAP / 2 + Math.sin(o.t * 1.6) * GAP * 0.6, 60, height - 60);
  }

  var CRUSHER_HEAD_H = 40;
  var CRUSHER_ARM_W = 20;

  function obstacleHits(o, px, py) {
    if (o.type === "pipe") {
      var top = o.gapY - GAP / 2;
      var bottom = o.gapY + GAP / 2;
      return circleHitsRect(px, py, PLAYER_R, o.x, -40, PIPE_W, top + 40) ||
        circleHitsRect(px, py, PLAYER_R, o.x, bottom, PIPE_W, height - bottom + 40);
    }
    if (o.type === "saw") return near(px, py, o.x, o.y, PLAYER_R + o.r - 4);
    if (o.type === "laser") return isLaserOn(o) && circleHitsRect(px, py, PLAYER_R, o.x, o.y - o.h / 2, o.w, o.h);
    if (o.type === "crusher") {
      var headTop = o.bottom - CRUSHER_HEAD_H;
      return circleHitsRect(px, py, PLAYER_R, o.x + (PIPE_W - CRUSHER_ARM_W) / 2, -40, CRUSHER_ARM_W, headTop + 40) ||
        circleHitsRect(px, py, PLAYER_R, o.x, headTop, PIPE_W, CRUSHER_HEAD_H);
    }
    return false;
  }

  // ----------------------------------------------------------
  // BOSSES
  // ----------------------------------------------------------
  function laneY(lane) {
    return height * (lane + 0.5) / LANE_COUNT;
  }

  function bossX() {
    return width - 110;
  }

  function startBoss() {
    var def = BOSSES[run.bossOrder[run.bossKills % BOSSES.length]];
    run.phase = "boss";
    run.bossStartDist = run.dist;
    run.obstacles = [];
    run.shots = [];
    // Slow-mo and Overdrive never appear in boss fights, so clear any still running.
    run.effects.slowmo = 0;
    run.effects.overdrive = 0;
    run.boss = { def: def, t: 0, lane: 1, cycle: -1, shotTimer: 0.8 };
    addPopup("WARNING: " + def.name.toUpperCase(), width / 2, height * 0.3, def.color);
  }

  function endBoss() {
    run.phase = "normal";
    run.boss = null;
    run.shots = [];
    run.bossKills++;
    run.nextBossDist = run.dist + BOSS_EVERY * M_TO_PX;
    addPopup("BOSS DEFEATED", width / 2, height * 0.3, "#7dff7a");
  }

  // Returns "aim", "fire" or "rest". A new cycle picks a new random lane.
  function bossState(b) {
    var cycle = b.def.aim + b.def.fire + b.def.rest;
    var idx = Math.floor(b.t / cycle);
    if (idx !== b.cycle) {
      b.cycle = idx;
      b.lane = Math.floor(Math.random() * LANE_COUNT);
    }
    var within = b.t - idx * cycle;
    if (within < b.def.aim) return "aim";
    if (within < b.def.aim + b.def.fire) return "fire";
    return "rest";
  }

  function bossBeamHits(px, py) {
    var b = run.boss;
    if (!b || b.def.attack !== "lane" || bossState(b) !== "fire") return false;
    return circleHitsRect(px, py, PLAYER_R, 0, laneY(b.lane) - BEAM_H / 2, bossX(), BEAM_H);
  }

  // Non-laser boss attacks. Each fires on a timer and moves its shots.
  function updateBossAttack(dt) {
    var b = run.boss;
    var def = b.def;

    if (def.attack !== "lane") {
      b.shotTimer -= dt;
      if (b.shotTimer <= 0) {
        b.shotTimer = def.interval;
        fireBossShot(def, bossX(), height / 2);
      }
    }

    run.shots.forEach(function (s) {
      s.t += dt;
      s.x += s.vx * dt;
      if (s.kind === "orb") {
        // steer gently toward Babu's height, capped so it stays dodgeable
        s.vy = clamp(s.vy + (run.y - s.y) * 1.2 * dt, -160, 160);
        s.y += s.vy * dt;
      } else if (s.kind === "drone") {
        s.y = s.baseY + Math.sin(s.t * 5) * 90;
      }
    });

    run.shots = run.shots.filter(function (s) {
      return !s.hit && s.x > -120 && s.x < width + 120 && s.t < 8;
    });
  }

  function fireBossShot(def, bx, by) {
    if (def.attack === "homing") {
      run.shots.push({ kind: "orb", x: bx - 10, y: by, vx: -230, vy: 0, r: 12, t: 0 });
    } else if (def.attack === "swarm") {
      var baseY = 40 + Math.random() * Math.max(1, height - 80);
      for (var i = 0; i < 5; i++) {
        run.shots.push({ kind: "drone", x: bx + i * 30, y: baseY, baseY: baseY, vx: -260, r: 10, t: i * 0.15 });
      }
    } else if (def.attack === "wall") {
      var margin = GAP / 2 + 40;
      var gapY = margin + Math.random() * Math.max(1, height - margin * 2);
      run.shots.push({ kind: "wall", x: width + 40, gapY: gapY, vx: -330, t: 0 });
    }
  }

  // Marks every shot touching Babu as hit and reports whether any did.
  function shotHits(px, py) {
    var hit = false;
    run.shots.forEach(function (s) {
      var touching;
      if (s.kind === "wall") {
        var gapTop = s.gapY - GAP / 2;
        var gapBottom = s.gapY + GAP / 2;
        touching = circleHitsRect(px, py, PLAYER_R, s.x, -40, PIPE_W, gapTop + 40) ||
          circleHitsRect(px, py, PLAYER_R, s.x, gapBottom, PIPE_W, height - gapBottom + 40);
      } else {
        touching = near(px, py, s.x, s.y, PLAYER_R + s.r);
      }
      if (touching) {
        s.hit = true;
        hit = true;
      }
    });
    return hit;
  }

  // ----------------------------------------------------------
  // RUN HELPERS
  // ----------------------------------------------------------
  function currentScroll() {
    var s = SCROLL_BASE * Math.min(SCROLL_MAX, 1 + run.dist * SCROLL_RAMP);
    if (run.effects.slowmo > 0) s *= 0.5;
    if (run.effects.overdrive > 0) s *= 1.5;
    return s;
  }

  function addPopup(text, x, y, color) {
    run.popups.push({ text: text, x: x, y: y, color: color, t: 0 });
  }

  // Shield absorbs one hit and grants a short grace period.
  function absorbHit() {
    if (!run.effects.shield) return false;
    run.effects.shield = false;
    run.effects.invuln = INVULN_TIME;
    addPopup("SHIELD BROKEN", playerX(), run.y - 30, PICKUPS.shield.color);
    return true;
  }

  function applyPickup(type) {
    var fx = run.effects;
    var jet = findSkin(JETPACK_SKINS, save.equipped.jetpack);
    if (type === "shield") fx.shield = true;
    if (type === "slowmo") fx.slowmo = EFFECT_TIME * jet.durationMult;
    if (type === "overdrive") fx.overdrive = EFFECT_TIME * jet.durationMult;
    if (type === "fuel") {
      run.fuel = FUEL_MAX;
      fx.fuel = FUEL_EFFECT_TIME * jet.durationMult;
    }
    addPopup(PICKUPS[type].name, playerX(), run.y - 30, PICKUPS[type].color);
  }

  // ----------------------------------------------------------
  // UPDATE — runs at a fixed UPS regardless of display refresh
  // rate, so gameplay speed never drifts between screens/devices.
  // `dt` is always exactly STEP seconds here.
  // ----------------------------------------------------------
  function update(dt) {
    stateTime += dt;
    if (state !== "play") return;

    var fx = run.effects;
    var jet = findSkin(JETPACK_SKINS, save.equipped.jetpack);

    fx.slowmo = Math.max(0, fx.slowmo - dt);
    fx.overdrive = Math.max(0, fx.overdrive - dt);
    fx.fuel = Math.max(0, fx.fuel - dt);
    fx.invuln = Math.max(0, fx.invuln - dt);

    // Jetpack: hold to burn fuel and climb, release to fall and recharge.
    run.thrusting = (keys.action || pointer.down) && run.fuel > 0;
    if (run.thrusting) {
      run.fuel = Math.max(0, run.fuel - FUEL_DRAIN * jet.drain * dt);
    } else {
      run.fuel = Math.min(FUEL_MAX, run.fuel + FUEL_REGEN * (fx.fuel > 0 ? FUEL_BOOST_MULT : 1) * dt);
    }
    var accel = GRAVITY - (run.thrusting ? THRUST * jet.thrust : 0);
    run.vy = clamp(run.vy + accel * dt, -MAX_VY, MAX_VY);
    run.y += run.vy * dt;

    // Ceiling is a soft stop.
    if (run.y < PLAYER_R) {
      run.y = PLAYER_R;
      run.vy = Math.max(run.vy, 0);
    }

    // Floor is a hard stop unless shielded.
    if (run.y > height - PLAYER_R) {
      run.y = height - PLAYER_R;
      run.vy = Math.min(run.vy, 0);
      if (fx.invuln <= 0) {
        if (!absorbHit()) return endRun();
        run.vy = -420;
      }
    }

    // Scroll the world and spawn new columns as distance builds.
    var dx = currentScroll() * dt;
    run.dist += dx;
    run.spawnDist += dx;
    if (run.spawnDist >= PIPE_SPACING) {
      run.spawnDist -= PIPE_SPACING;
      spawnColumn();
    }
    [run.obstacles, run.coinList, run.pickups].forEach(function (list) {
      list.forEach(function (o) { o.x -= dx; });
    });

    // Obstacles move on their own, then collide with Babu.
    var px = playerX();
    run.obstacles.forEach(function (o) { updateObstacle(o, dt); });
    for (var i = 0; i < run.obstacles.length; i++) {
      var o = run.obstacles[i];
      if (o.gone || fx.invuln > 0 || !obstacleHits(o, px, run.y)) continue;
      if (!absorbHit()) return endRun();
      o.gone = true;
    }

    // Boss arena: starts at the distance threshold, ends after BOSS_LENGTH metres.
    if (run.phase === "normal" && run.dist >= run.nextBossDist) startBoss();
    if (run.phase === "boss") {
      run.boss.t += dt;
      if (run.dist - run.bossStartDist >= BOSS_LENGTH * M_TO_PX) {
        endBoss();
      } else {
        updateBossAttack(dt);
        if (fx.invuln <= 0 && (bossBeamHits(px, run.y) || shotHits(px, run.y))) {
          if (!absorbHit()) return endRun();
        }
      }
    }

    // Collect coins and power-ups. Turbo jetpacks pull coins in.
    run.coinList.forEach(function (c) {
      if (!c.taken && jet.magnet > 0 && near(px, run.y, c.x, c.y, jet.magnet)) {
        c.x += (px - c.x) * Math.min(1, 6 * dt);
        c.y += (run.y - c.y) * Math.min(1, 6 * dt);
      }
      if (!c.taken && near(px, run.y, c.x, c.y, PLAYER_R + COIN_R)) {
        c.taken = true;
        var value = fx.overdrive > 0 ? 2 : 1;
        run.coins += value;
        addPopup("+" + value, c.x, c.y, "#ffd54a");
      }
    });
    run.pickups.forEach(function (k) {
      if (!k.taken && near(px, run.y, k.x, k.y, PLAYER_R + PICKUP_R)) {
        k.taken = true;
        applyPickup(k.type);
      }
    });

    // Tidy up finished objects and expire popups.
    run.obstacles = run.obstacles.filter(function (o) { return !o.gone && o.x > -PIPE_W - 200; });
    run.coinList = run.coinList.filter(function (c) { return !c.taken && c.x > -20; });
    run.pickups = run.pickups.filter(function (k) { return !k.taken && k.x > -20; });

    run.popups.forEach(function (t) {
      t.t += dt;
      t.y -= 40 * dt;
    });
    run.popups = run.popups.filter(function (t) { return t.t < 0.8; });
  }

  // ----------------------------------------------------------
  // RENDER — runs once per animation frame (not tied to UPS).
  // `alpha` (0..1) is how far between the last two fixed updates
  // we are, used here to smooth Babu's drawn position.
  // ----------------------------------------------------------
  function render(alpha) {
    hits = [];

    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, width, height);
    drawStars();

    if (state === "shop") {
      drawShop();
    } else {
      if (run) drawWorld(alpha);
      if (state === "title") drawTitle();
      if (state === "over") drawOver();
    }

    if (SHOW_STATS) drawStats();
  }

  function drawStars() {
    var scroll = state === "play" && run ? run.dist : stateTime * 60;
    stars.forEach(function (st) {
      var x = ((st.x * width - scroll * st.s * 0.5) % width + width) % width;
      ctx.fillStyle = "rgba(255,255,255," + (0.2 + st.s * 0.5) + ")";
      ctx.fillRect(x, st.y * height, st.s > 0.8 ? 3 : 2, st.s > 0.8 ? 3 : 2);
    });
  }

  // Babu with jetpack behind. Used in-run and on the title / shop screens.
  function drawBabu(x, y, skin, jet, thrusting, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt || 0);
    var jx = -PLAYER_R - 4;
    if (thrusting) {
      var flameH = 16 + Math.random() * 10;
      drawSprite("flame-" + jet.id, jx, 15 + flameH / 2, 12, flameH);  // hangs from the nozzle
    }
    drawSprite("jetpack-" + jet.id, jx, 2);
    drawSprite("babu-" + skin.id, 0, 0);
    ctx.restore();
  }

  function drawObstacle(o) {
    if (o.type === "pipe") {
      var top = o.gapY - GAP / 2;
      var bottom = o.gapY + GAP / 2;
      var cap = sprites["pipe-cap"] || { w: 64, h: 18 };
      drawSpriteBox("pipe-body", o.x, -10, PIPE_W, top + 10);
      drawSpriteBox("pipe-body", o.x, bottom, PIPE_W, height - bottom + 10);
      drawSprite("pipe-cap", o.x + PIPE_W / 2, top - cap.h / 2);
      drawSprite("pipe-cap", o.x + PIPE_W / 2, bottom + cap.h / 2);
    } else if (o.type === "saw") {
      drawSprite("saw", o.x, o.y, o.r * 2 + 4, o.r * 2 + 4, o.t * 6);
    } else if (o.type === "laser") {
      if (isLaserOn(o)) {
        drawSpriteBox("laser-beam", o.x, o.y - o.h / 2, o.w, o.h);
      } else {
        ctx.fillStyle = "rgba(255,77,109,0.3)";
        ctx.fillRect(o.x, o.y - 1, o.w, 2);
      }
      drawSprite("laser-emitter", o.x, o.y);
      drawSprite("laser-emitter", o.x + o.w, o.y);
    } else if (o.type === "crusher") {
      var headTop = o.bottom - CRUSHER_HEAD_H;
      drawSpriteBox("crusher-arm", o.x + (PIPE_W - CRUSHER_ARM_W) / 2, -10, CRUSHER_ARM_W, headTop + 10);
      drawSpriteBox("crusher-head", o.x, headTop, PIPE_W, CRUSHER_HEAD_H);
    }
  }

  function drawBoss() {
    var b = run.boss;
    var phase = b.def.attack === "lane" ? bossState(b) : "rest";
    var y = laneY(b.lane);
    var bx = bossX();

    // Sentinel lane warning, then the beam itself.
    if (phase === "aim") {
      ctx.fillStyle = "rgba(255,255,255," + (0.08 + 0.08 * Math.sin(b.t * 20)) + ")";
      ctx.fillRect(0, y - BEAM_H / 2, bx, BEAM_H);
    } else if (phase === "fire") {
      drawSpriteBox("boss-beam", 0, y - BEAM_H / 2, bx, BEAM_H);
    }

    var bob = Math.sin(b.t * 2) * 8;
    drawSprite("boss-" + b.def.id, bx + 45, height / 2 + bob);
    centerText(b.def.name.toUpperCase(), bx + 45, height / 2 - 92 + bob, "12px 'Roboto Mono', monospace", b.def.color);
  }

  function drawShots() {
    run.shots.forEach(function (s) {
      if (s.kind === "orb") {
        drawSprite("boss-orb", s.x, s.y, s.r * 2, s.r * 2);
      } else if (s.kind === "drone") {
        drawSprite("boss-drone", s.x, s.y, s.r * 2 + 2, s.r * 2 + 2);
      } else {
        var gapTop = s.gapY - GAP / 2;
        var gapBottom = s.gapY + GAP / 2;
        drawSpriteBox("boss-wall", s.x, -10, PIPE_W, gapTop + 10);
        drawSpriteBox("boss-wall", s.x, gapBottom, PIPE_W, height - gapBottom + 10);
      }
    });
  }

  function drawWorld(alpha) {
    var fx = run.effects;
    var px = playerX();
    var py = run.y + run.vy * alpha * STEP;
    var jet = findSkin(JETPACK_SKINS, save.equipped.jetpack);
    var skin = findSkin(PLAYER_SKINS, save.equipped.player);

    run.obstacles.forEach(drawObstacle);
    if (run.boss) {
      drawBoss();
      drawShots();
    }

    run.coinList.forEach(function (c) {
      drawSprite("coin", c.x, c.y);
    });

    run.pickups.forEach(function (k) {
      drawSprite("pickup-" + k.type, k.x, k.y + Math.sin(stateTime * 4 + k.x * 0.05) * 3);
    });

    // Babu tilts with vertical speed. Flashes during invuln.
    var flash = fx.invuln > 0 && Math.floor(stateTime * 12) % 2 === 0;
    if (!flash) {
      drawBabu(px, py, skin, jet, run.thrusting, run.vy / MAX_VY * 0.35);
      if (fx.shield) drawSprite("shield-bubble", px, py);
    }

    run.popups.forEach(function (t) {
      ctx.globalAlpha = 1 - t.t / 0.8;
      centerText(t.text, t.x, t.y, "bold 14px 'Roboto Mono', monospace", t.color);
      ctx.globalAlpha = 1;
    });

    if (state === "play") drawHud(jet);
  }

  function drawHud(jet) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.font = "16px 'Roboto Mono', monospace";
    ctx.fillText(Math.floor(run.dist / M_TO_PX) + " m", 16, 26);

    ctx.textAlign = "right";
    ctx.fillStyle = "#ffd54a";
    ctx.fillText(run.coins, width - 16, 26);
    var coinX = width - 26 - ctx.measureText(String(run.coins)).width;
    drawSprite("coin", coinX, 21, 16, 16);

    // Fuel bar
    var frac = run.fuel / FUEL_MAX;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(16, 38, 160, 8);
    ctx.fillStyle = run.fuel < 25 ? "#ff5252" : jet.color;
    ctx.fillRect(16, 38, 160 * frac, 8);

    // Boss countdown and active effects
    var fx = run.effects;
    var lines = [];
    if (run.phase === "boss") {
      var left = Math.ceil((run.bossStartDist + BOSS_LENGTH * M_TO_PX - run.dist) / M_TO_PX);
      lines.push(run.boss.def.name.toUpperCase() + "  " + left + " m left");
    } else {
      lines.push("NEXT BOSS IN " + Math.ceil((run.nextBossDist - run.dist) / M_TO_PX) + " m");
    }
    if (fx.shield) lines.push("SHIELD");
    if (fx.slowmo > 0) lines.push("SLOW-MO " + fx.slowmo.toFixed(1));
    if (fx.overdrive > 0) lines.push("OVERDRIVE " + fx.overdrive.toFixed(1));
    if (fx.fuel > 0) lines.push("FUEL BOOST " + fx.fuel.toFixed(1));
    ctx.textAlign = "left";
    ctx.font = "12px 'Roboto Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    lines.forEach(function (line, i) {
      ctx.fillText(line, 16, 66 + i * 16);
    });
  }

  // Clickable button. Registers a hit region when enabled.
  function button(x, y, w, h, label, fn, opts) {
    opts = opts || {};
    var enabled = opts.enabled !== false;

    ctx.fillStyle = opts.active ? "rgba(255,255,255,0.28)" : enabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = enabled ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.fillStyle = enabled ? "#fff" : "#666";
    ctx.font = "14px 'Roboto Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + 1);
    ctx.textBaseline = "alphabetic";

    if (enabled && fn) hits.push({ x: x, y: y, w: w, h: h, fn: fn });
  }

  function centerText(text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
  }

  function drawTitle() {
    var cx = width / 2;
    var ty = height * 0.24;
    centerText("ROCKET BABU", cx, ty, "bold 40px 'Roboto Mono', monospace", "#fff");
    centerText("S P A C E", cx, ty + 30, "bold 18px 'Roboto Mono', monospace", "#ff8a00");
    centerText("Hold to burn the jetpack. Release to fall.", cx, ty + 62, "14px 'Roboto Mono', monospace", "#aaa");
    centerText("Survive a boss every 2000 m. Spend coins in the shop.", cx, ty + 82, "14px 'Roboto Mono', monospace", "#aaa");

    // Idle Babu floating on the title screen.
    var skin = findSkin(PLAYER_SKINS, save.equipped.player);
    var jet = findSkin(JETPACK_SKINS, save.equipped.jetpack);
    drawBabu(cx, height * 0.5 + Math.sin(stateTime * 2) * 8, skin, jet, true, -0.1);

    var pulse = 0.5 + 0.5 * Math.sin(stateTime * 4);
    ctx.globalAlpha = 0.4 + 0.6 * pulse;
    centerText("TAP OR SPACE TO START", cx, height * 0.62, "16px 'Roboto Mono', monospace", "#fff");
    ctx.globalAlpha = 1;

    button(cx - 80, height * 0.68, 160, 40, "SHOP", openShop);
    centerText("Best " + save.best + " m   ·   Coins " + save.coins, cx, height - 36, "13px 'Roboto Mono', monospace", "#888");
  }

  function drawOver() {
    var cx = width / 2;
    var y = height * 0.25;
    ctx.fillStyle = "rgba(6,7,13,0.6)";
    ctx.fillRect(0, 0, width, height);
    centerText("CRASHED", cx, y, "bold 36px 'Roboto Mono', monospace", "#ff5252");
    centerText("Distance  " + lastRun.meters + " m", cx, y + 44, "16px 'Roboto Mono', monospace", "#fff");
    centerText("Coins this run  " + lastRun.coins + "   ·   Bosses  " + lastRun.bosses, cx, y + 68, "16px 'Roboto Mono', monospace", "#ffd54a");
    centerText("Banked  " + save.coins + "   ·   Best  " + save.best + " m", cx, y + 92, "13px 'Roboto Mono', monospace", "#888");

    if (stateTime > RETRY_DELAY) {
      centerText("TAP OR SPACE TO RETRY", cx, y + 140, "14px 'Roboto Mono', monospace", "#aaa");
    }

    button(cx - 170, y + 170, 160, 40, "SHOP", openShop);
    button(cx + 10, y + 170, 160, 40, "MENU", function () { setState("title"); });
  }

  function drawShop() {
    var cx = width / 2;
    centerText("SHOP", cx, 48, "bold 28px 'Roboto Mono', monospace", "#fff");
    centerText("Coins  " + save.coins, cx, 74, "14px 'Roboto Mono', monospace", "#ffd54a");

    button(cx - 150, 96, 140, 34, "PLAYERS", function () { shopTab = "player"; }, { active: shopTab === "player" });
    button(cx + 10, 96, 140, 34, "JETPACKS", function () { shopTab = "jetpack"; }, { active: shopTab === "jetpack" });

    var kind = shopTab;
    var skins = kind === "player" ? PLAYER_SKINS : JETPACK_SKINS;
    var cardW = Math.min(220, (width - 60) / 2);
    var cardH = Math.max(140, Math.min(160, (height - 260) / 2));
    var left = cx - cardW - 10;
    var right = cx + 10;
    var top = 150;

    skins.forEach(function (skin, i) {
      var x = i % 2 === 0 ? left : right;
      var y = top + Math.floor(i / 2) * (cardH + 16);
      var equipped = save.equipped[kind] === skin.id;
      var owned = save.owned[kind].indexOf(skin.id) >= 0;

      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(x, y, cardW, cardH);
      ctx.strokeStyle = equipped ? "#ffd54a" : "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cardW - 1, cardH - 1);

      // Preview: the skin on the default jetpack, or the jetpack with its flame.
      if (kind === "player") {
        drawSprite("babu-" + skin.id, x + cardW / 2, y + 32);
      } else {
        drawSprite("flame-" + skin.id, x + cardW / 2, y + 50);
        drawSprite("jetpack-" + skin.id, x + cardW / 2, y + 28);
      }

      centerText(skin.name, x + cardW / 2, y + cardH - 70, "14px 'Roboto Mono', monospace", "#fff");
      centerText(kind === "player" ? "Cosmetic" : skin.perk, x + cardW / 2, y + cardH - 52, "11px 'Roboto Mono', monospace", "#aaa");

      var label;
      var enabled = true;
      var fn = null;
      if (equipped) {
        label = "EQUIPPED";
        enabled = false;
      } else if (owned) {
        label = "EQUIP";
        fn = function () { equip(kind, skin.id); };
      } else if (save.coins >= skin.price) {
        label = "BUY " + skin.price;
        fn = function () { purchase(kind, skin); };
      } else {
        label = skin.price + " COINS";
        enabled = false;
      }
      button(x + 14, y + cardH - 38, cardW - 28, 28, label, fn, { enabled: enabled });
    });

    button(cx - 70, height - 56, 140, 36, "BACK", function () { setState("title"); });
  }

  // ----------------------------------------------------------
  // TAP ROUTING — UI buttons first, otherwise start / retry
  // ----------------------------------------------------------
  function handleTap(x, y) {
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
        h.fn();
        return;
      }
    }
    startIfReady();
  }

  // ----------------------------------------------------------
  // DEV STATS — quick FPS check. Turn off SHOW_STATS for release.
  // ----------------------------------------------------------
  var statsFps = 0;
  var statsFrames = 0;
  var statsTimer = 0;

  function drawStats() {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px 'Roboto Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("fps " + statsFps + " / target " + UPS, 10, height - 10);
  }

  // ----------------------------------------------------------
  // MAIN LOOP — fixed-timestep simulation, variable-rate render.
  // ----------------------------------------------------------
  var lastTime = null;
  var accumulator = 0;

  function frame(now) {
    requestAnimationFrame(frame);

    if (lastTime === null) lastTime = now;
    var frameTime = (now - lastTime) / 1000;
    lastTime = now;

    if (frameTime > MAX_FRAME_TIME) frameTime = MAX_FRAME_TIME;
    accumulator += frameTime;

    while (accumulator >= STEP) {
      update(STEP);
      accumulator -= STEP;
    }

    render(accumulator / STEP);

    statsFrames++;
    statsTimer += frameTime;
    if (statsTimer >= 1) {
      statsFps = statsFrames;
      statsFrames = 0;
      statsTimer = 0;
    }
  }

  // Reset the clock when the tab regains visibility so a long
  // background pause doesn't get treated as one giant frame.
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) lastTime = null;
  });

  // Dev hook for quick testing from the console, e.g. RBS.debug.skipTo(1990).
  window.RBS = {
    debug: {
      skipTo: function (meters) { if (run) { run.dist = meters * M_TO_PX; } },
      addCoins: function (n) { save.coins += n; persist(); }
    }
  };

  resize();
  requestAnimationFrame(frame);
})();
