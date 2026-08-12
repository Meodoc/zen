// ==UserScript==
// @name         Page Suggest Vim Nav
// @namespace    local
// @version      1.0.0
// @description  Vim-style Alt+J / Alt+K navigation for a website's own search-box autocomplete. Runs in PAGE content (Violentmonkey/Tampermonkey). Does NOT affect Zen's own URL bar — that needs the chrome script instead.
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const MODIFIER = "alt";   // "alt" or "ctrl"
  const DOWN_KEY = "KeyJ";
  const UP_KEY   = "KeyK";

  // Selectors for the suggestion popup / listbox on the sites you care about.
  // Add site-specific selectors here. These generic ARIA ones cover many sites.
  const SUGGEST_SELECTORS = [
    '[role="listbox"]',
    '[role="combobox"][aria-expanded="true"]',
    ".suggestions", ".autocomplete", ".search-suggestions",
  ];

  const modOK = (e) => {
    if (MODIFIER === "alt")  return e.altKey  && !e.ctrlKey && !e.metaKey && !e.shiftKey;
    if (MODIFIER === "ctrl") return e.ctrlKey && !e.altKey  && !e.metaKey && !e.shiftKey;
    return false;
  };

  const suggestOpen = () =>
    SUGGEST_SELECTORS.some((sel) => {
      const el = document.querySelector(sel);
      return el && el.offsetParent !== null;
    });

  const fireArrow = (key) => {
    const isDown = key === "ArrowDown";
    const target = document.activeElement || document;
    target.dispatchEvent(new KeyboardEvent("keydown", {
      key, code: key,
      keyCode: isDown ? 40 : 38,
      which:   isDown ? 40 : 38,
      bubbles: true, cancelable: true,
    }));
  };

  document.addEventListener("keydown", (e) => {
    if (!modOK(e)) return;
    if (e.code !== DOWN_KEY && e.code !== UP_KEY) return;
    if (!suggestOpen()) return;
    e.preventDefault();
    e.stopPropagation();
    fireArrow(e.code === DOWN_KEY ? "ArrowDown" : "ArrowUp");
  }, true);
})();
