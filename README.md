# BLACKLINE — The Meridian Leak

A first-person mystery set inside a connected intelligence directorate. Walk the building, climb to the upper galleries, question people, inspect records, connect evidence, and choose what reaches the public.

The main case retains its eight original findings, investigation puzzles, three evidence links, suspect dialogue, and six dispositions. The world adds seven supporting records, six physical people to interact with, scoring, and saved exploration.

## Play

Open `index.html` in a WebGL-capable desktop browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. No installation, API key, downloaded game engine, or DOOM assets are needed. A local server is recommended for consistent texture loading; if a file URL blocks portrait uploads, the renderer uses its procedural people sprites.

Every load starts at the home screen. Starting or continuing first shows a mission briefing: what to find, what objects to look for, and the controls. The live world has **no HUD, floating prompts, navigation buttons, or permanent overlays**. Keys open opaque full-screen panels and pause movement.

| Key | Action |
| --- | --- |
| WASD | Move / strafe |
| Left / right arrows | Turn |
| Mouse / drag | Look; click the world to capture the mouse |
| Shift | Move faster |
| E | Face a nearby object/person to inspect, talk, open a door, or climb a ladder |
| H or ? | Full-screen field manual |
| M or Tab | Building map, explored cells, walked trail, and planned route |
| B | Evidence board |
| J | Private field notes |
| I | Objectives, score, and final assessment |
| T | Toggle the planned route’s floor guidance lights |
| F | Browser fullscreen, when supported |
| N | Interaction sounds |
| Escape | Close a panel, return from a workspace, or pause/release mouse capture |

In the map, **1–8** select a room and calculate a route; they do not teleport the player. In inspection and conversation panels, numbered choices, Tab, Enter, and the mouse work. Text entry keeps its own keyboard input. Keyboard controls are required for exploration.

## Building and investigation

The 56 × 44 layout has eight connected areas: Arrival hall, Central atrium, Crisis room, Security office, Document archive, Press liaison wing, Observation gallery, and Service workshop. Upper rooms sit 1.4 world units above the ground floor.

Three actual stairways connect the elevations. Walking changes the player’s floor height, with a smoothed eye position. A maintenance ladder below the west archive supports an animated climb in both directions. Closed doors block movement and visibility until opened. Structural islands create collision geometry inside rooms.

Vale, Imani, and Kade retain their original conversations. Officer Marin, Archivist Sato, and Technician Ortega offer directions and context. Records and terminals open the original document comparison, hidden text-layer, device log, CCTV timeline, upload fingerprint, and message recovery puzzles.

The automap stores the actual walked trail and explored cells separately from a calculated route. Faint areas show the building blueprint; visited areas are brighter. Optional gold guidance studs are rendered on the world floor, with wall and floor depth, rather than as a screen overlay.

## Points and saves

| Discovery | Points |
| --- | ---: |
| Main evidence finding | 100 each × 8 |
| Supporting record | 40 each × 7 |
| First contact with a person | 25 each × 6 |
| Valid evidence connection | 75 each × 3 |
| Fully supported, source-safe resolution | 300 |
| Maximum | **1,755** |

Points derive from unique recorded discoveries. Reopening a document, repeating a conversation, or reversing an existing link never farms points. Scores are shown in case panels, not over the live world.

Case progress and notes use the existing `blackline-case-v2` localStorage save; older case saves migrate without losing their evidence or notes. The world’s pose, opened doors, explored cells, walked trail, and planned destination use `blackline-playground-v1`. Movement and panels do not spend story time. Correct main findings retain the original action-clock behavior.

## Engine approach

The design was informed by the original id Software [BSP/sector renderer](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/r_bsp.c), [player movement and collision](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_map.c), and [floor movement code](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_floor.c). This project implements its own renderer and geometry; it does not run the DOOM engine or copy its code or WAD assets.

This implementation uses a height-field sector layout with WebGL textured triangles, floor/ceiling surfaces, vertical stair risers, billboard people/props, fog, and depth-tested sprites. It uses discrete substeps and elevation checks for collision, breadth-first routing through connected cells, and a timed climb for the ladder. World materials and signs are generated locally in canvas; suspect portraits come from the project’s existing custom artwork.

## Validate and package

```sh
npm test
npm run build
```

The active test suite covers the original endings and save rules; collision and walkable routes; three stairways and ladder landings; scoring and migration; WebGL API/geometry and camera transforms; the home/briefing/help/map flow; and a simulated complete winning investigation. DOM/WebGL doubles do not substitute for live visual/browser verification.

The vertex and fragment shaders can also be checked with `glslangValidator --glsl-version 100` after extracting them from `mystery-renderer.js`.

`dist/` contains the static game for the existing hosting configuration. Building does not publish it. Earlier presentation modules remain in source as prior versions but are not loaded or copied into this build.

- `mystery-world.js`: height-field building, stairs, doors, people, records, collision, targeting, routing, and world save recovery.
- `mystery-renderer.js`: WebGL geometry, textures, billboards, camera, movement, ladder animation, input, and world persistence.
- `playground-ui.js`: home, preflight, conversations, automap, case panels, keyboard navigation, and play/pause state.
- `game-engine.js`: original evidence/outcomes plus unique discoveries, contacts, and scoring.
- `app.js`: original case content, inspection puzzles, dialogue, journal, evidence connections, and assessment.
- `playground.css`: full-screen world, home, and opaque panels.
- `assets/`: original SVGs and custom generated room/portraits; generation prompts are in `assets/ART-DIRECTION.txt`.

People, places, and events are fictional.
