// zen-urlbar-vim-nav.uc.mjs
// -------------------------------------------------------------
// Vim-style Alt+J / Alt+K navigation inside Zen's URL/search bar
// suggestion dropdown.
//
// This is a PRIVILEGED CHROME script. It cannot be loaded as a normal
// extension or userscript. Load it with a userChrome.js loader:
//   - fx-autoconfig  (https://github.com/MrOtherGuy/fx-autoconfig), or
//   - Sine           (Zen's mod manager, which can load .uc.mjs scripts).
// Drop this file in your profile's  chrome/JS/  directory, then restart
// Zen. You may need to clear the startup cache from about:support.
//
// To use Ctrl instead of Alt, change MODIFIER to "ctrl".
// (Firefox binds Ctrl+K to "focus search" and Ctrl+J to downloads, so if
//  you go Ctrl, this stopPropagation will suppress those WHILE the urlbar
//  results are open — which is usually fine, but Alt is the safer default.)
// -------------------------------------------------------------

(function () {
  const MODIFIER = "alt";   // "alt" or "ctrl"
  const DOWN_KEY = "KeyJ";
  const UP_KEY   = "KeyK";

  const modOK = (e) => {
    if (MODIFIER === "alt")  return e.altKey  && !e.ctrlKey && !e.metaKey && !e.shiftKey;
    if (MODIFIER === "ctrl") return e.ctrlKey && !e.altKey  && !e.metaKey && !e.shiftKey;
    return false;
  };

  const fireArrow = (target, key) => {
    const isDown = key === "ArrowDown";
    target.dispatchEvent(new KeyboardEvent("keydown", {
      key, code: key,
      keyCode: isDown ? 40 : 38,
      which:   isDown ? 40 : 38,
      bubbles: true, cancelable: true,
    }));
  };

  // Capture phase on the chrome window, so we beat Firefox's own key handling.
  window.addEventListener("keydown", (e) => {
    // gURLBar is the browser's urlbar controller; .view.isOpen is true only
    // when the suggestion dropdown is actually showing. This is a much more
    // reliable check than guessing DOM class names.
    const urlbar = window.gURLBar;
    if (!urlbar || !urlbar.view || !urlbar.view.isOpen) return;
    if (!modOK(e)) return;
    if (e.code !== DOWN_KEY && e.code !== UP_KEY) return;

    e.preventDefault();
    e.stopPropagation();
    const input = urlbar.inputField || document;
    fireArrow(input, e.code === DOWN_KEY ? "ArrowDown" : "ArrowUp");
  }, true);

  console.log("[zen-urlbar-vim-nav] active:", MODIFIER, "+ J / K");
})();
