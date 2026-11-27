# BLACKLINE — The Meridian Leak

A browser investigation with illustrated locations, suspect interviews, document analysis, a CCTV timeline puzzle, device and upload forensics, and an evidence board. Eight findings, three evidence links, and six dispositions tell the story of an altered intelligence briefing.

## Play locally

Open `index.html` in a modern browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. No installation or API key is needed. Fonts have system fallbacks; game assets are bundled locally.

Click the room hotspots and question the suspects. Record findings, then select pairs of cards on the evidence board to reconstruct the leak. New discoveries advance the story clock; revisiting a finding is free. The clock drives the news feed, rather than imposing a real-time failure condition. Hints are available, and sound effects are opt-in.

Progress and private notes save in this browser using localStorage. Restart asks before clearing the case. Reopen a completed investigation to improve your assessment without losing discoveries.

## Cinematic and first-person views

The story, dialogue, eight findings, puzzles, six dispositions, and existing save format are preserved.

The default cinematic view adds a skippable title shot, layered mouse parallax, rain, dust, lamp glow, letterboxing, grain, animated inspections, portrait close-ups, and evidence-card depth. Enable **Sound on** for synthesized rain and low ambient tones. No audio is downloaded or autoplayed.

Select **Walk the station** in the room to enter a textured Canvas 2D ray-cast environment. All four rooms are connected and their stations open the original inspection panels. Use **WASD** to move, **left/right arrows** or **drag** to turn, and **E** or the inspection button to interact. Touch controls are included. You can also travel directly using the location buttons or reset your position. Return to **Cinematic view** to use the illustrated hotspots.

Movement does not advance the story clock. Discovery rules remain the same. View preferences are stored separately from case progress. Motion can be disabled and respects the operating system’s reduced-motion setting; first-person movement remains under your control. Fullscreen is optional and depends on browser support.

## Full-screen navigation

The illustrated or first-person scene fills the viewport by default, with a bottom navigation dock, a room travel rail, a current-lead card, a live news ticker, and a camera heading display. Supporting content opens in overlays; evidence and notes have their own full-screen workspaces.

- **0**: Scene; **B**: Evidence; **J**: Notes.
- **1–4**: Travel directly to Crisis room, Document archive, Security office, or Press liaison desk.
- **G**: Location navigator, floor plan, room progress, and quick inspection links.
- **P**: Interview directory; **I**: Mission briefing and assessment.
- **H** or **?**: Field manual with controls, an investigation guide, and presentation settings.
- **V**: Switch camera views; **F**: Browser fullscreen; **M**: Sound.
- **U**: Clean frame / restore controls. A visible restore button is always available.
- **Escape**: Close a panel, restore hidden controls, return from a workspace, or open the pause menu.

Navigation shortcuts do not interrupt typing or an open inspection. The original WASD/arrow/drag/E movement controls still apply in first-person view. The help screen and dock offer clickable alternatives to shortcuts.

## Validate and package

```sh
npm test
npm run build
```

`dist/` contains the complete static game for the existing hosting configuration. Building does not publish it.

- `game-engine.js`: evidence, connections, outcomes, and save recovery.
- `app.js`: interactive scenes, interviews, puzzles, journal, and audio.
- `cinema.js` / `cinema.css`: layered presentation, atmosphere, ray-cast rendering, controls, opening sequence, and ambient sound.
- `station-world.js`: room geometry, ray intersections, collision, and inspection targeting.
- `navigation.js` / `immersive.css`: full-screen HUD, view routing, travel and interview directories, briefing drawer, pause menu, and help screen.
- `navigation-shortcuts.js`: keyboard action mapping and input guards.
- `style.css`: responsive game layout, keyboard focus styles, reduced-motion support.
- `assets/`: generated WebP room/portraits and original SVG map/insignia. Full generation prompts and provenance are in `assets/ART-DIRECTION.txt`.
- `tests/game.test.js`: solution path, alternative dispositions, incomplete evidence, invalid links, duplicate actions, and save recovery.
- `tests/station-world.test.js`: ray distances, collisions, connected rooms, reachability, and occlusion.
- `tests/cinema.test.js`: renderer API/lifecycle smoke checks using simulated canvas and DOM objects. These do not verify browser layout or pixels.
- `tests/navigation.test.js`: documented shortcut mappings, typing/modal guards, travel destinations, help routing, and clean-frame recovery.

The people, places, and events are fictional.
