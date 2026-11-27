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

## Validate and package

```sh
npm test
npm run build
```

`dist/` contains the complete static game for the existing hosting configuration. Building does not publish it.

- `game-engine.js`: evidence, connections, outcomes, and save recovery.
- `app.js`: interactive scenes, interviews, puzzles, journal, and audio.
- `style.css`: responsive game layout, keyboard focus styles, reduced-motion support.
- `assets/`: generated WebP room/portraits and original SVG map/insignia. Full generation prompts and provenance are in `assets/ART-DIRECTION.txt`.
- `tests/game.test.js`: solution path, alternative dispositions, incomplete evidence, invalid links, duplicate actions, and save recovery.

The people, places, and events are fictional.
