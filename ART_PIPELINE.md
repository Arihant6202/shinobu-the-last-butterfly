# Shinobu v1.6 — Art Pipeline

This build retains the v1.5 playable prototype and parallax treatment, and adds the current approved art-direction references under `assets/art_reference/`.

## Visual target
- 16:9 landscape 2D anime side-scroller.
- Shinobu: dark purple hair, violet eyes, butterfly ornament, white/lavender butterfly haori, dark uniform, sword.
- Shadow Scout, Brute, Archer and Tsukiko boss silhouettes.
- Moonlit Japanese mansion, wisteria garden, waterfall, red bridges and lanterns.
- Multi-speed parallax: distant scenery, mansion/trees, canopy, drifting petals and foreground.

## Asset status (honest)
`shinobu_sprite_sheet_reference.png` is a combined reference sheet with multiple panels. It is NOT a clean production sprite atlas: panel labels, borders and background are baked into the image, and it does not provide verified individual transparent PNG frames. It is included as art direction only; the running game still uses its existing canvas-drawn character/enemies.

## Next production stage
Create isolated, consistent-canvas transparent PNGs for Shinobu and each enemy; validate alpha edges; export separate idle/walk/run/jump/attack frame sequences; then replace the canvas-drawn renderers and test on a real phone in landscape.


## v1.7 frame extraction progress
Approximate isolated frame candidates are now included in `assets/sprite_candidates/`:
- 8 idle PNG candidates
- 8 walk PNG candidates
- 7 run PNG candidates

These are cropped from the combined generated sheet and had pale connected background removed. Because the source sheet is a compact concept sheet, inspect edges and consistency before production use. They are candidate art assets, not final polished animation frames. They have not yet replaced the in-game canvas character renderer.


## v1.8 UI visual target
Added `assets/art_reference/reference_ui_target_v1.png`, a new visual target for the menu/gameplay presentation: landscape 16:9, purple wisteria palette, moonlit mansion, bottom menu/dialogue/chapter panels and right-side mobile action controls.
This is a generated concept reference only; it has not been sliced into UI assets or integrated into the live HTML interface.


## v1.9 — Shinobu sprite animation integration
- Added normalized transparent PNG candidate frames for idle (8), walk (8), and run (7).
- The game renderer now loads these frames and switches animation based on movement input; it falls back to the previous vector-drawn character if images fail to load.
- Frames are normalized to a common 180×220 canvas and share a bottom baseline.
- These are extracted/cleaned candidates from the generated contact sheet, not hand-drawn professional animation frames. Inspect for edge artifacts and visual jitter on-device.
- Jump, landing, hurt, attack and skill still use the existing vector effects/renderer and are not yet sprite-frame animated.


## v2.0 combat polish
Distinct 3-step sword slash visuals, combo indicator, finisher butterfly sparks and enemy hit flash added. Dedicated transparent attack/skill sprite frames remain pending; contaminated contact-sheet crops were deliberately not used in the game.


## v2.1 — Movement state polish
- Jump, dash, attack, magic and hurt states now use the detailed vector pose/effects instead of showing a walking/idle PNG while performing the action.
- Hurt feedback adds a brief pale-violet flash.
- Dash adds three trailing afterimages.
- Existing idle/walk/run PNG animation remains active during locomotion.
- Added `assets/art_reference/v2_1_combat_movement_concept.png` as a visual target. This is generated concept art, not a screenshot captured from the running game.
- Jump/hurt/attack/skill are still procedural vector animations, not dedicated transparent PNG frame sequences.


## v2.2 — Shadow Archer ranged AI
- Shadow Archer now fires visible violet bolts when Shinobu is within a grounded ranged distance.
- Bolts travel toward Shinobu and can hit for 42 damage.
- The player can avoid them by moving or using Butterfly Step; the existing invulnerability window protects during a successful dash.
- Projectile lifetime and collision cleanup added.
- Other enemy and Tsukiko boss logic retained.
- This is a gameplay/AI improvement; final transparent enemy PNG animation sets remain pending.


## v2.3 — Scout and Brute combat AI
- Shadow Scout performs a short lunge when close to Shinobu, with a cooldown and a clear motion tell.
- Shadow Brute charges a ground slam with a visible expanding violet warning ring before impact.
- Both attacks check player invulnerability, so a well-timed Butterfly Step can evade damage.
- Enemy attack timers are stored per enemy; existing Archer projectile and Tsukiko phase logic remain.
- These are gameplay AI improvements using the existing stylized enemy renderer; dedicated enemy transparent PNG animation sets are still pending.


## v2.8 — Chapter 1 graphics direction samples
- Added `chapter1_forgotten_village_combat_concept.png`: a new visual target for Chapter 1 combat composition, village environment, Shinobu and enemy presentation.
- Added `chapter1_forgotten_village_hud_concept.png`: a new visual target for the mobile HUD and battlefield composition.
- Both files are concept references only. They are not sliced production sprites, not runtime backgrounds, and not proof of an in-game screenshot.
- Existing gameplay code and controls are unchanged in this graphics-reference update.


## Character rendering polish — in progress
- Added cleaner butterfly motifs and dotted hem detailing to Shinobu's procedural vector render.
- Kept one consistent vector-rendered character for all states while the current extracted PNG frame candidates remain rough; this avoids visibly inconsistent low-quality crops in gameplay.
- Verified JavaScript syntax and checked static local asset references.
- This is not final frame-by-frame character animation; clean production sprite frames and device testing remain outstanding.


## Enemy visual differentiation — in progress
- Added distinct shoulder plates and spikes to Brute silhouettes.
- Added an archer mantle and visible quiver/arrow fletching.
- Added scout wrap detail, chest insignia and armour rivets.
- Retained existing enemy movement/AI and health bars.
- JavaScript syntax check passed; no device rendering test has been performed.


## Tsukiko boss visual polish — in progress
- Added flowing phantom-hair strands with violet highlights.
- Added layered ceremonial sleeves and mantle piping.
- Added crown gem and ornamental side pins.
- Added orbiting butterfly particles and a pulsing aura ring.
- Boss AI, combat values and health-bar logic were not changed.
- JavaScript syntax check passed; visual device testing remains pending.


## Tsukiko phase-two visual pass — in progress
- Phase two now has brighter magenta-violet butterfly particles and expanded layered aura rings.
- Boss title changes to `PHANTOM ASCENDANT` in phase two.
- Telegraph state displays the incoming attack label above the boss bar.
- No boss damage, cooldown, projectile count, or phase threshold values changed.
- JavaScript syntax check passed; Android visual test remains pending.


## Background depth and boss projectile readability — in progress
- Added a subtle mid-distance ridge/roof silhouette plane with a slower camera factor for additional parallax depth.
- Added faint distant lantern glows to the mid-distance layer.
- Improved shadow projectile trails with tapered motion direction, pulsing cores and extra motes on Tsukiko bolts.
- No projectile speed, damage, hitbox, enemy AI or camera gameplay values changed.
- JavaScript syntax check passed; in-device visual testing remains pending.


## HUD visual feedback polish — in progress
- Added a soft animated pulse to the boss health bar and a phase-two magenta treatment.
- Added restrained glow feedback to available action buttons, disabled during cooldown.
- Added reduced-motion handling for users who prefer less animation.
- Updated boss HUD phase class from the existing phase state only; no combat values changed.
- JavaScript syntax check passed; device/browser visual verification remains pending.

### v2.10 — combat telegraph readability pass
- Added animated ground-ring and directional-line telegraphs while Tsukiko charges a Wisteria Bolt / Shadow Fan, with a stronger magenta treatment in phase two.
- Added expanding ground warning rings during the brute's slam wind-up.
- Refined boss shadow bolts with orbiting diamond motes and a pulsing ring around the projectile core.
- These are canvas-rendered effects, not separate sprite-sheet assets. JavaScript syntax was checked; visual timing and alignment still need browser/device testing.

## v2.10 test handoff
- Packaged the current Chapter 1 graphics-polish working tree for user testing.
- `node --check game.js` passes and static `src`/`href` references in the HTML were checked.
- This is a test handoff, not a claim of completed production art: Shinobu and enemies still use canvas/vector drawing in places, and the game has not been tested on a physical Android device in this session.
