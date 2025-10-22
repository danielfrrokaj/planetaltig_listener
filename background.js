// background.js
// Listens for messages or extension events

const STORAGE_KEY = 'searchLinkClicks';
const PICKUP_NOTES_KEY = 'pickupNotes';

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and ready.");
  // Initialize storage if not present
  chrome.storage.local.get([STORAGE_KEY, PICKUP_NOTES_KEY], (data) => {
    if (!data[STORAGE_KEY]) {
      chrome.storage.local.set({ [STORAGE_KEY]: [] });
    }
    if (!data[PICKUP_NOTES_KEY]) {
      chrome.storage.local.set({ [PICKUP_NOTES_KEY]: [] });
    }
  });
});

// Helper function to filter clicks by time
function filterClicks(clicks, hours) {
  const now = Date.now();
  const cutoff = now - (hours * 60 * 60 * 1000); // hours in milliseconds
  return clicks.filter(timestamp => timestamp >= cutoff).length;
}

// Helper function to calculate productivity rates
function calculateProductivity(clicks, pickups) {
    const totalClicks = clicks.length;
    const totalPickups = pickups.length;
    const appointmentPickups = pickups.filter(p => p.is_appointment).length;

    // Calculate rates: total unaswered_clicks / pickups
    // Assuming 'total unaswered_clicks' refers to the total clicks stored (last 6 hours)
    const pickupRate = totalPickups > 0 ? (totalClicks / totalPickups).toFixed(2) : 'N/A';
    
    // Calculate rates: total unaswered_clicks / is_appointmet_true
    const appointmentRate = appointmentPickups > 0 ? (totalClicks / appointmentPickups).toFixed(2) : 'N/A';

    return {
        totalPickups,
        appointmentPickups,
        pickupRate,
        appointmentRate
    };
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
  } else if (msg.action === "save_pickup_note") {
    chrome.storage.local.get(PICKUP_NOTES_KEY, (data) => {
        const notes = data[PICKUP_NOTES_KEY] || [];
        const newNote = {
            id: Date.now(), // Simple unique ID
            note: msg.note,
            is_appointment: msg.is_appointment,
            timestamp: Date.now()
        };
        notes.unshift(newNote); // Add to the beginning
        chrome.storage.local.set({ [PICKUP_NOTES_KEY]: notes }, () => {
            sendResponse({ success: true, note: newNote });
        });
    });
    return true;
  } else if (msg.action === "delete_pickup_note") {
    chrome.storage.local.get(PICKUP_NOTES_KEY, (data) => {
        let notes = data[PICKUP_NOTES_KEY] || [];
        notes = notes.filter(note => note.id !== msg.id);
        chrome.storage.local.set({ [PICKUP_NOTES_KEY]: notes }, () => {
            sendResponse({ success: true });
        });
    });
    return true;
  } else if (msg.action === "get_stats") {
    // This replaces the old "get_click_stats" action
    chrome.storage.local.get([STORAGE_KEY, PICKUP_NOTES_KEY], (data) => {
      const clicks = data[STORAGE_KEY] || [];
      const pickups = data[PICKUP_NOTES_KEY] || [];

      const clickStats = {
        lastHour: filterClicks(clicks, 1),
        last3Hours: filterClicks(clicks, 3),
        last6Hours: filterClicks(clicks, 6),
        totalClicks: clicks.length
      };

      const productivityStats = calculateProductivity(clicks, pickups);

      sendResponse({
          clickStats: clickStats,
          productivityStats: productivityStats,
          pickupNotes: pickups
      });
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
});