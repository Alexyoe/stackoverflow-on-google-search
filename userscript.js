// ==UserScript==
// @name         Stack Overflow search on Google
// @version      1.0.0
// @description  Adds a button to search stackoverflow.com with Google
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/stackoverflow-search-on-google.git
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// ==/UserScript==

// Change this to false if you don't want an icon
const useIcon = true;
// Change this to true if you want to add the button to the right of the 'Tools' button
const appendRight = false;

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const stackoverflowUrl = '+site%3Astackoverflow.com';
let stackoverflowIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><path d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

if (typeof trustedTypes !== 'undefined') {
    const policy = trustedTypes.createPolicy('html', { createHTML: input => input });
    stackoverflowIcon = policy.createHTML(stackoverflowIcon);
}

(function () {
    // Creating the element
    let el = document.createElement('div');
    el.className = 'hdtb-mitem';
    const link = document.createElement('a');

    // Adding the svg icon
    if (useIcon) {
        const span = document.createElement('span');
        span.className = isImageSearch ? 'm3kSL' : 'bmaJhd iJddsb';
        span.style.cssText = 'height:16px;width:16px';
        span.innerHTML = stackoverflowIcon;
        link.appendChild(span);
    }

    // Hyperlink to add 'site:stackoverflow.com' to the query
    link.appendChild(document.createTextNode('Stack Overflow'));
    link.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, stackoverflowUrl) : match + stackoverflowUrl;
    });
    if (isImageSearch) {
        link.classList.add('NZmxZe');
        el = link;
    } else {
        el.appendChild(link);
    }

    // Inserting the element into Google search
    if (appendRight) {
        const toolsBtn = document.querySelector(isImageSearch ? '.ssfWCe' : '.t2vtad');
        toolsBtn.parentNode.insertBefore(el, toolsBtn.nextSibling);
    } else {
        const menuBar = document.querySelector(isImageSearch ? '.T47uwc' : '.MUFPAc');
        if (isImageSearch) {
            menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
        } else {
            menuBar.appendChild(el);
        }
    }
})();
