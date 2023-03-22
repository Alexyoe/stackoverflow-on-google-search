// ==UserScript==
// @name         Stack Overflow on Google Search
// @version      2.0.0
// @description  Adds a button to search stackoverflow via Google Search
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/stackoverflow-search-on-google.git
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @license MIT
// ==/UserScript==

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const stackoverflowUrl = "+site%3Astackoverflow.com";
let stackoverflowIcon =
  '<svg class="DCxYpf" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512"><path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);
console.log(isImageSearch);

if (typeof trustedTypes !== "undefined") {
  const policy = trustedTypes.createPolicy("html", {
    createHTML: (input) => input,
  });
  stackoverflowIcon = policy.createHTML(stackoverflowIcon);
}

(function () {
  // Create the link element
  const el = document.createElement("a");
  el.className = isImageSearch ? "NZmxZe" : "zItAnd FOU1zf GMT2kb";

  // Add icon to the link
  const span = document.createElement("span");
  span.className = isImageSearch ? "m3kSL" : "mUKzod";
  span.style.cssText = "height:16px;width:16px";
  span.innerHTML = stackoverflowIcon;
  el.appendChild(span);

  // Create the div element for the text
  const link = document.createElement("div");
  link.textContent = "Stack Overflow";
  el.appendChild(link);

  // Add site:stackoverflow.com to the query
  el.href = window.location.href.replace(queryRegex, (match) =>
    match.search(siteRegex) >= 0
      ? match.replace(siteRegex, stackoverflowUrl)
      : match + stackoverflowUrl
  );

  // Insert the link into Google search
  const menuBar = document.querySelector(isImageSearch ? ".T47uwc" : ".nfdoRb");
  if (isImageSearch) {
    menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
  } else {
    menuBar.appendChild(el);
  }

  // Fix Sizing
  const buttonBox = document.querySelector(".TrmO7");
  buttonBox.classList.add("size-fix");
  const buttonBoxCSS = document.createElement("style");
  buttonBoxCSS.innerHTML = ".size-fix { width: 100% !important; }";
  document.head.appendChild(buttonBoxCSS);
})();
