// zen-split-focus-follows-mouse.uc.mjs
// -------------------------------------------------------------
// Focus follows mouse for Zen's split view: hovering a pane makes it
// the active tab, as if you had clicked it.
//
// Privileged chrome script, loaded by fx-autoconfig from
//   <profile>/chrome/JS/
// -------------------------------------------------------------

(function () {
  const DWELL_MS = 0;  // how long the pointer must rest on a pane before it gets focus
  const DEBUG = false;   // set true to log events in the Browser Console (Ctrl+Shift+J)

  let timer = null;
  let pending = null;

  const log = (...a) => DEBUG && console.log("[split-ffm]", ...a);

  const isVisible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // Situations where switching panes would be disruptive.
  const blocked = (e) =>
    e.buttons !== 0 ||                                   // dragging or selecting text
    !document.hasFocus() ||                              // Zen window isn't the active window
    window.gURLBar?.focused ||                           // typing in the URL bar
    gBrowser.selectedTab?.hasAttribute("zen-glance-tab") || // a Glance preview is open
    document.querySelector('panel[panelopen="true"], menupopup[open="true"]'); // menu/popup open

  const activate = (browser) => {
    const tab = gBrowser.getTabForBrowser(browser);
    if (!tab || tab === gBrowser.selectedTab) return;
    // Only switch if the current pane is ALSO on screen, i.e. both panes
    // belong to the same split. Outside split view this never triggers.
    if (!isVisible(gBrowser.selectedBrowser) || !isVisible(browser)) return;
    log("focus ->", tab.label);
    gBrowser.selectedTab = tab;
    browser.focus();
  };

  const cancel = () => {
    clearTimeout(timer);
    timer = null;
    pending = null;
  };

  const onPointer = (e) => {
    const browser = e.target?.closest?.("browser");
    if (!browser) return cancel();
    if (browser === pending) return;  // already waiting on this pane
    cancel();
    if (blocked(e)) return;
    if (browser === gBrowser.selectedBrowser) return;
    pending = browser;
    timer = setTimeout(() => {
      const b = pending;
      cancel();
      activate(b);
    }, DWELL_MS);
  };

  window.addEventListener("mouseover", onPointer, true);
  window.addEventListener("mousemove", onPointer, true);

  console.log("[zen-split-focus-follows-mouse] active");
})();
