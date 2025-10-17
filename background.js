// background.js
// Listens for messages or extension events

const STORAGE_KEY = 'searchLinkClicks';

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and ready.");
  // Initialize storage if not present
  chrome.storage.local.get(STORAGE_KEY, (data) => {
    if (!data[STORAGE_KEY]) {
      chrome.storage.local.set({ [STORAGE_KEY]: [] });
    }
  });
});

// Helper function to filter clicks by time
function filterClicks(clicks, hours) {
  const now = Date.now();
  const cutoff = now - (hours * 60 * 60 * 1000); // hours in milliseconds
  return clicks.filter(timestamp => timestamp >= cutoff).length;
}

// Message listener for content scripts and popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "search_link_clicked") {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      const clicks = data[STORAGE_KEY] || [];
      clicks.push(msg.timestamp);
      // Keep only clicks from the last 6 hours to prevent storage bloat
      const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
      const filteredClicks = clicks.filter(timestamp => timestamp >= sixHoursAgo);
      chrome.storage.local.set({ [STORAGE_KEY]: filteredClicks }, () => {
        console.log('Search link click recorded:', msg.timestamp);
      });
    });
  } else if (msg.action === "get_click_stats") {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      const clicks = data[STORAGE_KEY] || [];
      const stats = {
        lastHour: filterClicks(clicks, 1),
        last3Hours: filterClicks(clicks, 3),
        last6Hours: filterClicks(clicks, 6),
      };
      sendResponse(stats);
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
});