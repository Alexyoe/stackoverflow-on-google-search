// ==UserScript==
// @name         Stack Overflow on Google Search
// @version      2.1.0
// @description  Adds a button to search stackoverflow via Google Search
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/stackoverflow-search-on-google.git
// @license MIT
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/453125/Stack%20Overflow%20on%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/453125/Stack%20Overflow%20on%20Google%20Search.meta.js
// ==/UserScript==

// Default settings
const settings = {
  displayMode: GM_getValue("displayMode", "icon"),
  btnPosition: GM_getValue("btnPosition", "start"),
  fixSize: GM_getValue("fixSize", "false"),
};

// Save helper
function save() {
  GM_setValue("displayMode", settings.displayMode);
  GM_setValue("btnPosition", settings.btnPosition);
  GM_setValue("fixSize", settings.fixSize);
}

// Configure command that prompts for each setting
GM_registerMenuCommand("⚙️ Configure Stack Overflow Button…", () => {
  const dm = prompt("displayMode? (icon or label)", settings.displayMode);
  if (dm === "icon" || dm === "label") {
    settings.displayMode = dm;
  }
  const bp = prompt("btnPosition? (start, end, afterai)", settings.btnPosition);
  if (["start", "end", "afterai"].includes(bp)) {
    settings.btnPosition = bp;
  }
  const fs = prompt("Prevent wrapping? (true, false)", settings.fixSize);
  if (["true", "false"].includes(bp)) {
    settings.fixSize = fs;
  }
  save();
  location.reload();
});

// Start Code
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const stackoverflowUrl = "+site%3Astackoverflow.com";
let stackoverflowIcon =
  '<svg class="DCxYpf" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 384 512"><path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

// Trusted Types for CSP
if (typeof trustedTypes !== "undefined") {
  const p = trustedTypes.createPolicy("html", { createHTML: (x) => x });
  stackoverflowIcon = p.createHTML(stackoverflowIcon);
}

// Main function to run on load
(function waitForNav() {
  const nav = Array.from(
    document.querySelectorAll('div[role="navigation"]')
  ).find((n) => n.querySelector('div[role="listitem"] a'));
  if (!nav) return setTimeout(waitForNav, 200);

  // Grab the first wrapper <div role="listitem"> that isn't selected or "AI Mode"
  const sampleItem = Array.from(
    document.querySelectorAll('div[role="listitem"]')
  ).find((item) => {
    const isSelected = item.querySelector('[selected], [aria-current="page"]');
    const text = item.textContent.trim();
    return !isSelected && text !== "AI Mode";
  });

  if (!sampleItem) return; // bail if nothing there

  // Clone the entire wrapper
  const newItem = sampleItem.cloneNode(true);

  // Inside that clone, find the <a>
  const btn = newItem.querySelector("a");
  btn.href = window.location.href.replace(queryRegex, (r) => {
    // if site:reddit.com is already present, strip it out
    if (siteRegex.test(r)) {
      return r.replace(siteRegex, "");
    }
    // otherwise append it
    return r + stackoverflowUrl;
  });

  // Find the inner div (jsname) or fallback to the <a>
  const inner = btn.querySelector("div[jsname]") || btn;

  // Clear inner
  inner.innerHTML = "";

  if (settings.displayMode === "label") {
    const textWrapper = document.createElement("span");
    textWrapper.textContent = "Stack Overflow";
    textWrapper.className = "R1QWuf";
    inner.appendChild(textWrapper);
  } else {
    const iconWrapper = document.createElement("span");
    iconWrapper.className = "R1QWuf";
    iconWrapper.style.lineHeight = "15px";
    iconWrapper.innerHTML = stackoverflowIcon;
    inner.appendChild(iconWrapper);
  }

  // Insert the wrapper at the selected position
  const first = nav.querySelector(':scope div[role="listitem"]');
  if (settings.btnPosition === "start") {
    first ? first.before(newItem) : nav.prepend(newItem);
  } else if (settings.btnPosition === "end") {
    nav.append(newItem);
  } else {
    first ? first.after(newItem) : nav.append(newItem);
  }

  // optional: prevent wrapping
  if (settings.fixSize == "true") {
    nav.style.maxWidth = "inherit";
    nav.style.overflowX = "auto";
    nav.style.whiteSpace = "nowrap";
  }
})();
