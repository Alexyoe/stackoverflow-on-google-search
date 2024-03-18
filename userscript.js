// ==UserScript==
// @name         Stack Overflow on Google Search
// @version      2.0.6
// @description  Adds a button to search stackoverflow via Google Search
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/stackoverflow-search-on-google.git
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @license MIT
// ==/UserScript==

// Settings
const settings = {
  iconVisible: true, // Toggle icon visibility
  nameVisible: true, // Toggle name visibility
  btnPosition: "default", // Options: "start", "end", "default"
  fixSize: true, // Expands the search buttons bar
};

// Start Code
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const stackoverflowUrl = "+site%3Astackoverflow.com";
let stackoverflowIcon =
  '<svg class="DCxYpf" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512"><path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

// Sanitize SVG if necessary
if (typeof trustedTypes !== "undefined") {
  const policy = trustedTypes.createPolicy("html", {
    createHTML: (input) => input,
  });
  stackoverflowIcon = policy.createHTML(stackoverflowIcon);
}

// Main function to run on load
(function () {
  const el = document.createElement("a");
  el.className = isImageSearch ? "NZmxZe" : "LatpMc nPDzT T3FoJb";

  const mainDiv = document.createElement("div");
  mainDiv.className = isImageSearch ? "m3kSL" : "";
  mainDiv.style.cssText = isImageSearch ? "display:inline-flex;gap:5px;" : "";

  // Create the span to wrap the icon and title
  const span = document.createElement("span");
  span.style.cssText = "display:inline-flex;gap:5px;align-items:center;"; // Ensuring vertical centering
  span.className = isImageSearch ? "m3kSL" : "YmvwI";

  if (settings.iconVisible) {
    const iconDiv = document.createElement("div");
    iconDiv.style.cssText = "height:16px;width:16px;fill:white;";
    iconDiv.innerHTML = stackoverflowIcon;
    span.appendChild(iconDiv);
  }

  if (settings.nameVisible && !isImageSearch) {
    span.appendChild(document.createTextNode("Stack Overflow"));
  }

  mainDiv.appendChild(span);
  el.appendChild(mainDiv);

  if (settings.nameVisible && isImageSearch) {
    el.appendChild(document.createTextNode("Stack Overflow"));
  }

  // Modify the URL to include the stack overflow site search
  el.href = window.location.href.replace(queryRegex, (match) =>
    match.search(siteRegex) >= 0
      ? match.replace(siteRegex, stackoverflowUrl)
      : match + stackoverflowUrl
  );

  // Determine where to insert the link element
  const insertLink = (menuBar, offset) => {
    const positionMap = {
      start: () => menuBar.insertBefore(el, menuBar.children[offset]),
      end: () => menuBar.appendChild(el),
      default: () => menuBar.appendChild(el),
    };
    (positionMap[settings.btnPosition] || positionMap["default"])();
  };

  if (isImageSearch) {
    const menuBar = document.querySelector(".T47uwc");
    insertLink(menuBar, 1);
  } else {
    const menuBar = document.querySelector(".crJ18e");
    insertLink(menuBar, 0);
  }

  // Fix Sizing
  if (settings.fixSize) {
    const buttonBox = document.querySelector(".xhjkHe");
    buttonBox.style.maxWidth = "inherit";
  }
})();
