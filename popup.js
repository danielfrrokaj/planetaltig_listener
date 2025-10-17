// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const clicksLastHourEl = document.getElementById("clicksLastHour").querySelector('span:last-child');
  const clicksLast3HoursEl = document.getElementById("clicksLast3Hours").querySelector('span:last-child');
  const clicksLast6HoursEl = document.getElementById("clicksLast6Hours").querySelector('span:last-child');

  // Request click statistics from the background script
  chrome.runtime.sendMessage({ action: "get_click_stats" }, (response) => {
    if (response) {
      clicksLastHourEl.textContent = response.lastHour;
      clicksLast3HoursEl.textContent = response.last3Hours;
      clicksLast6HoursEl.textContent = response.last6Hours;
    } else {
      console.error("Failed to get click stats.");
      clicksLastHourEl.textContent = `Error`;
      clicksLast3HoursEl.textContent = `Error`;
      clicksLast6HoursEl.textContent = `Error`;
    }
  });
});