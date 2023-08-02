// ==UserScript==
// @name         Stack Overflow on Google Search
// @version      2.0.5
// @description  Adds a button to search stackoverflow via Google Search
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/stackoverflow-search-on-google.git
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @license MIT
// ==/UserScript==

// Settings
const iconVisible = true; // Toggle icon visibility
const nameVisible = true; // Toggle name visibility
const btnPosition = "end"; // Start or End
const fixSize = false; // Expands the search buttons bar

// Start Code
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const stackoverflowUrl = "+site%3Astackoverflow.com";
let stackoverflowIcon =
  '<svg class="DCxYpf" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512"><path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

// Allow importing SVGs
if (typeof trustedTypes !== "undefined") {
  const policy = trustedTypes.createPolicy("html", {
    createHTML: (input) => input,
  });
  stackoverflowIcon = policy.createHTML(stackoverflowIcon);
}

// Main Function: Runs on load
(function () {
  // Create the main link element
  const el = document.createElement("a");
  el.className = isImageSearch ? "NZmxZe" : "nPDzT T3FoJb";

  // Create the div element for the text
  const mainDiv = document.createElement("div");
  mainDiv.className = "GKS7s";

  // Create the span to wrap the icon and title
  const span = document.createElement("span");
  span.style.cssText = "display:inline-flex;gap:5px;";
  span.className = isImageSearch ? "m3kSL" : "FMKtTb UqcIvb";

  // create the div to hold our SVG
  const iconDiv = document.createElement("div");
  iconDiv.style.cssText = nameVisible
    ? "height:16px;width:16px;display:block;fill:white;"
    : "height:16px;width:16px;display:block;margin:auto;fill:white;";
  iconDiv.innerHTML = stackoverflowIcon;

  // Create the text node to hold the button title
  const textNode = document.createTextNode("Stack Overflow");
  // Add iconDiv to the span element
  if (iconVisible) {
    span.appendChild(iconDiv);
  }
  // Add textNode to the span element
  if (nameVisible) {
    if (!isImageSearch) {
      span.appendChild(textNode);
    }
  }

  // Add span to the mainDiv
  mainDiv.appendChild(span);
  // Add mainDiv to the main link element
  el.appendChild(isImageSearch ? span : mainDiv);
  // Add text node last if isImageSearch is true
  if (isImageSearch) {
    el.appendChild(textNode);
  }

  // Add site:stackoverflow.com to the query
  el.href = window.location.href.replace(queryRegex, (match) =>
    match.search(siteRegex) >= 0
      ? match.replace(siteRegex, stackoverflowUrl)
      : match + stackoverflowUrl
  );

  // Insert the link into Google search
  if (isImageSearch) {
    let menuBar = document.querySelector(".T47uwc");
    menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
  } else {
    let menuBar = document.querySelectorAll(".IUOThf")[0];
    switch (btnPosition) {
      case "start":
        menuBar.insertBefore(el, menuBar.children[0]);
        break;
      case "end":
        menuBar.appendChild(el);
        break;
      default:
        menuBar.appendChild(el);
        break;
    }
  }

  // Fix Sizing
  if (fixSize) {
    const buttonBox = document.querySelector(".xhjkHe");
    buttonBox.style.maxWidth = "inherit";
  }
})();
