# CrossGen fork of Excalidraw

The drawing board in the Lessons studio's present mode (Lessons ADR 0020).

## Branches

- `master` mirrors `excalidraw/excalidraw`. Never commit to it.
- `crossgen` is ours. Everything we add lives here, as small commits on top of upstream.

## Where our code goes

- `crossgen/board.js` is the only file Lessons loads. It exports `mountBoard(el, props)`, `React`,
  and the whole `Excalidraw` namespace. Keep new features behind this file where possible.
- Changes inside `packages/` are allowed when a prop cannot do the job. Keep each one small and
  in its own commit, so a merge from upstream stays readable.

## Build into Lessons

```bash
bun tools/vendor-excalidraw.ts        # from the Lessons repo root
```

That runs `yarn build:packages` here, bundles `crossgen/board.js` with React, and writes
`tools/studio/vendor/excalidraw/` in Lessons with a `VERSION.json` naming this commit.
Left out: the Xiaolai CJK font, non-English locales, and the Mermaid dialog.

## Taking upstream changes

```bash
git fetch upstream
git switch master && git merge --ff-only upstream/master && git push origin master
git switch crossgen && git merge master
yarn install && (cd ~/Lessons && bun tools/vendor-excalidraw.ts)
```

Then test a board in present mode before committing the new bundle in Lessons.

## Notes

- This tracks upstream `master`, which is ahead of the 0.18 npm release. The API callback is
  `onInitialize` / `onExcalidrawAPI`, not the older `excalidrawAPI` prop.
- Fonts load from the folder the bundle is served from (`EXCALIDRAW_ASSET_PATH`), so a room
  needs no network.
