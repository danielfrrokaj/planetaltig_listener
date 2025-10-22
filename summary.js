// summary.js

// Global variables to store fetched data for summary generation
let currentClicks = 0;
let currentNotes = [];

// Function to fetch data and render all sections
function fetchAndPrepareData() {
    // Request all stats and notes from the background script
    chrome.runtime.sendMessage({ action: "get_stats" }, (response) => {
        if (response) {
            // Store data globally for summary generation
            // Note: response.clickStats.totalClicks is the count of clicks in the last 6 hours
            currentClicks = response.clickStats.last6Hours; 
            currentNotes = response.pickupNotes;
        } else {
            console.error("Failed to get stats.");
        }
    });
}

// Function to handle shift summary generation
function handleEndShift() {
    const workingHours = document.getElementById('workingHoursInput').value.trim() || 'N/A';
    const callCount = parseInt(document.getElementById('callCountInput').value) || 0;
    const summaryOutput = document.getElementById('summaryOutput');

    // Use the globally stored data
    const summaryText = generateShiftSummary(currentClicks, currentNotes, workingHours, callCount);
    
    summaryOutput.value = summaryText;
}


document.addEventListener("DOMContentLoaded", () => {
    // Initial data fetch
    fetchAndPrepareData();

    // Setup event listener for generating shift summary
    document.getElementById("endShiftButton").addEventListener('click', handleEndShift);
});