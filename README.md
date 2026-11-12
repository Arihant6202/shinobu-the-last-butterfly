# SHINOBU: THE LAST BUTTERFLY — Chapter 1 QA build (v2.6)

## Changes in this build
- Reworked the in-game canvas enemy drawing for distinct Scout, Brute, Archer and Tsukiko silhouettes.
- Added animated bob/foot movement, layered robes, belts, shoulder shapes, masks/hoods, glowing eyes, weapon silhouettes and a distinct boss crown/aura.
- Improved enemy and boss health-bar contrast.
- Kept the current player movement, attacks, skills, save/load, fullscreen landscape layout and parallax background.

## Test
- `node --check game.js` passes.
- Confirm `assets/chapter1_wisteria_background.svg` remains beside the game files.

## Honest art status
Enemy and boss visuals are still canvas-rendered vector-style game art, not final transparent anime PNG sprite animations. The game is playable as a prototype; final sprite replacement and real-device testing are still required.

## Publish
Upload the complete folder contents to GitHub Pages. Do not upload only `index.html`; keep the `assets` folder.


v1.8 adds a consolidated menu/gameplay UI art-direction reference under `assets/art_reference/`. This image is not the running game screen.


## v1.9 — Shinobu sprite animation integration
- Added normalized transparent PNG candidate frames for idle (8), walk (8), and run (7).
- The game renderer now loads these frames and switches animation based on movement input; it falls back to the previous vector-drawn character if images fail to load.
- Frames are normalized to a common 180×220 canvas and share a bottom baseline.
- These are extracted/cleaned candidates from the generated contact sheet, not hand-drawn professional animation frames. Inspect for edge artifacts and visual jitter on-device.
- Jump, landing, hurt, attack and skill still use the existing vector effects/renderer and are not yet sprite-frame animated.


## v2.0 combat polish
- Sword combo now has three distinct slash-arc styles based on the combo count.
- Finisher adds butterfly spark trails and a combo label.
- Enemy hit reactions now include a clearer violet-white flash.
- Added `assets/art_reference/v2_combat_ui_visual_target.png` as a visual concept reference, not a captured running-game screenshot.
- The generated attack/skill contact-sheet crops were not integrated because they contain panel labels/borders and would reduce in-game quality. Current attack and skill remain vector-rendered effects pending clean dedicated animation assets.


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


## v2.4 — Tsukiko Boss Combat Update
- Tsukiko now uses a visible wind-up before firing aimed shadow volleys.
- Phase 1 fires a 3-bolt spread; Phase 2 fires a faster 5-bolt spread.
- Boss projectiles have distinct pink-violet visuals and separate damage values.
- Boss HUD displays the current phase.
- Existing movement, parallax, mobile controls, and local save flow are retained.

Validation: JavaScript syntax and ZIP integrity checked. This is not a live Android/browser playtest.

## v2.6 — Chapter 1 Visual Finish
- Added a dedicated ornate Chapter 1 completion screen with story epilogue text and reward display.
- Chapter completion now grants 150 coins and 3 butterfly tokens only once, then persists the reward-claimed state in the local save.
- Added Continue and Replay Chapter actions; replay resets the encounter while preserving already-earned completion rewards.
- Added a glowing Wisteria Gate landmark to the final world zone and refined the menu/HUD panel styling.
- Kept Chapter 2 locked/Coming Soon; this update is focused on finishing Chapter 1 first.

Validation: `node --check game.js` passed and ZIP integrity check passed. No live Android/browser playtest has been performed. Existing character/enemy art remains a mix of candidate PNG animation frames and canvas-rendered vector effects; this is not yet final hand-drawn production art.


## v2.6 QA notes
- Restored consistent project branding: The Last Butterfly.
- Corrected a Chapter 1 zone label that incorrectly said The Silent Village (Chapter 2).
- Checked JavaScript syntax, local DOM ID references, PNG integrity, SVG asset path, and ZIP integrity.
- Browser/device gameplay still requires user-side testing.


## v2.8 graphics reference update
Two Chapter 1 Forgotten Village visual concept references were added under `assets/art_reference/`. These are design targets for future production asset creation, not integrated game sprites or runtime screenshots. Gameplay code is unchanged.
