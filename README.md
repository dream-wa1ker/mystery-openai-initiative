# The Ninth Record

A complete solo browser ARG set in a small 3D conservation room. Investigate the fictional Aster Foundation through dossiers, Morse, word deduction, Sudoku, basic ciphers, source verification, image alignment, and connected websites. Verified findings automatically form evidence-board connections when pinned.

## Run

```sh
npm start
```

Open **http://localhost:5173**. JavaScript modules and 3D models require HTTP; opening `index.html` as a file displays the server instructions. The checked-in runtime includes its Three.js dependency, models, textures, images, and audio, so play requires no API key, account, or CDN connection.

For development on a fresh checkout, run `npm install` to install the locked build/test dependency.

## What is included

- Ten complete core puzzle stages and two optional technical branches.
- Twenty-four authored dossier pages and three correspondents with ten progress-gated letters.
- Seventeen original GLB models in a real Three.js 3D room, with shadows, materials, camera navigation and picking.
- A generated fictional observatory photograph, three generated portraits, eleven deterministic SVG graphics, and six locally synthesized audio assets.
- A standalone fictional foundation catalogue and conservator’s journal, with downloadable content samples and matching SHA-256 digests.
- Historical source notes, bundled facts, three-level hints, cipher tools, audio transcripts, keyboard navigation, print views and a flat-archive fallback.
- Local save/resume, private notes, draggable board arrangement, save-file import/export, rank progression and an honest personal scoreboard.
- A complete conclusion that separates established editorial backdating, the retained original IX record, and the still-unexplained ECHO marker. There is no hidden publication-choice failure.

## Controls and progression

Click props or use the visible navigation. Drag the room to orbit and scroll to zoom. Keyboard shortcuts are **1** for records, **2** for the board, **3** for the terminal, **4** for reference tools, **H** for help, **L** for the ledger, **N** for notes, **F** for fullscreen, and **Escape** to return. Typing retains its normal keys.

Read a record, solve its task, verify the answer, then pin the finding. Connections appear automatically when both endpoint records are solved and pinned. Pin-all recovers any findings you left unpinned. The final dossier opens after the nine earlier core records have been solved and pinned. Optional technical tasks never block completion and remain available afterward.

Incorrect guesses cost no points. A completed finding is credited once; revisits cannot farm credit. Two core findings promote Visitor to Research Assistant, three to Investigator, seven to Analyst, and completing the case to Archivist. Main findings earn 100 points, the synthesis 200, technical extras 75 each, pins 15, and verified links 25. A +150 mastery bonus requires the complete case, both optional findings, and no full-solution hint. The maximum is **1,930 points**.

Progress is stored under `ninth-record-case-v1` in this browser. Export from the ledger to transfer it. Imported files have a checksum for accidental corruption detection, not authentication. Browser-only verification is a gameplay gate, not anti-cheat; the ledger is personal rather than a claimed secure multiplayer leaderboard.

## Author materials — contain spoilers

- [Story bible](authoring/story-bible.md): truth, characters, source policy, narrative structure and ending.
- [Puzzle dependency graph](authoring/puzzle-dependencies.mmd).
- [Detailed puzzle definitions](authoring/puzzle-design.json).
- [Solution and hint guide](authoring/solution-guide.md).

Author solutions are excluded from `dist/`. Earlier prototype source files remain in the repository but are not loaded or shipped by the new entry point.

## Validate and build

```sh
npm test
npm run build
```

The tests exercise full main and optional solution paths, automatic board links, ranks, score deduplication, hint behavior, Sudoku uniqueness, repeated-letter word feedback, both ciphers, alignment tolerances, save recovery and import integrity. Interface flow tests use a deterministic DOM double, including a complete ending, no-WebGL operation, blocked storage, notes, hints, tools and imports. Models are loaded by the actual Three.js GLTFLoader to verify their geometry and named surfaces. Static-handler tests check MIME types, linked files, websites, audio and model delivery.

These checks do not establish visual quality or frame rate in a live browser. A human playtest with technical and nontechnical players is still a separate verification step.

`dist/` is a self-contained static build of about 10 MB. Deploy that folder to an HTTPS static host. No server-side application or API is required for the published game. Building does not publish it.

## Asset and content regeneration

```sh
npm run assets
```

This regenerates the original SVGs, seventeen GLB model assemblies, local WAV audio, dependency graph and author solution data. It requires Node, the locked Three.js dependency, and Python 3. The generated photograph and portraits are retained assets; generation prompts and provenance are in [ART-DIRECTION.txt](assets/ninth/ART-DIRECTION.txt). Three.js is licensed under MIT, included in `vendor/THREE-LICENSE.txt`.

## Source layout

- `arg/content.mjs`: authored case, document pages, reference facts, correspondence, puzzle prerequisites and edge explanations.
- `arg/engine.mjs`: verification, scoring, role progression, pins, automatic connections, normalization and save integrity.
- `arg/room.mjs`: the 3D conservation room, model loading, textures, camera, picking and live physical board.
- `arg/views.mjs`: readable documents and puzzle interfaces, the board, ledger, tools, correspondence and conclusion.
- `arg/app.mjs`: navigation, interactions, audio, persistence and accessible fallback.
- `arg/style.css`: room presentation, responsive reading panels and print styles.
- `websites/`: authored external-style foundation and journal surfaces.
- `assets/ninth/`: game-specific models, images, graphics and audio.
- `server.mjs`: local development server; `build.js`: static packaging.

Aster, its people, its building and its conspiracy are fictional. Historical reference facts are identified with primary-source links and bundled fallbacks. The weapons-related context concerns history, institutions and consequences, not operational instruction.
