// content.js
// This script runs in the context of web pages on https://m.planetaltig.com/

console.log("Content script loaded for https://m.planetaltig.com/");

document.addEventListener('click', (event) => {
  let target = event.target;
  // Traverse up the DOM tree to find if an ancestor is an anchor with name="search"
  while (target && target !== document.body) {
    if (target.tagName === 'A' && target.name === 'search') {
      console.log('Search anchor link clicked:', target);
      // Send a message to the background script with the current timestamp
      chrome.runtime.sendMessage({ action: 'search_link_clicked', timestamp: Date.now() });
      break; // Stop after finding the first matching ancestor
    }
    target = target.parentElement;
  }
});