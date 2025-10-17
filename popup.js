// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const clicksLastHourEl = document.getElementById("clicksLastHour");
  const clicksLast3HoursEl = document.getElementById("clicksLast3Hours");
  const clicksLast6HoursEl = document.getElementById("clicksLast6Hours");

  // Request click statistics from the background script
  chrome.runtime.sendMessage({ action: "get_click_stats" }, (response) => {
    if (response) {
      clicksLastHourEl.textContent = `Last 1 hour: ${response.lastHour}`;
      clicksLast3HoursEl.textContent = `Last 3 hours: ${response.last3Hours}`;
      clicksLast6HoursEl.textContent = `Last 6 hours: ${response.last6Hours}`;
    } else {
      console.error("Failed to get click stats.");
      clicksLastHourEl.textContent = `Last 1 hour: Error`;
      clicksLast3HoursEl.textContent = `Last 3 hours: Error`;
      clicksLast6HoursEl.textContent = `Last 6 hours: Error`;
    }
  });
});