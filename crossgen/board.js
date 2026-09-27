// CrossGen entry: the one file the Lessons studio loads (Lessons ADR 0020).
// Bundled with React by `bun tools/vendor-excalidraw.ts` in the Lessons repo.
// Our own additions to Excalidraw go on the `crossgen` branch; keep this file the only public surface.
import React from "react";
import { createRoot } from "react-dom/client";
// The built package (yarn build:packages), not the TypeScript source, so the bundle matches board.css.
import * as Excalidraw from "../packages/excalidraw/dist/prod/index.js";

// Fonts load from the folder this bundle is served from, so a room needs no network.
if (typeof window !== "undefined" && !window.EXCALIDRAW_ASSET_PATH) {
  window.EXCALIDRAW_ASSET_PATH = new URL("./", import.meta.url).href;
}

/** Mount a board into `el`. Returns { api: Promise<ExcalidrawImperativeAPI>, render(props), unmount() }. */
export function mountBoard(el, props = {}) {
  const root = createRoot(el);
  let resolveApi;
  const api = new Promise((r) => (resolveApi = r));
  let current = props;
  const render = (next = {}) => {
    current = { ...current, ...next };
    root.render(
      React.createElement(Excalidraw.Excalidraw, {
        ...current,
        // Resolves once the first scene has loaded, so updateScene is safe to call.
        onInitialize: (a) => { resolveApi(a); current.onInitialize?.(a); },
      }),
    );
  };
  render();
  return { api, render, unmount: () => root.unmount() };
}

export { React, Excalidraw };
export const version = "crossgen-0.18.0";
