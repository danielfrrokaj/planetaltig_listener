// summary.js

// Global variables to store fetched data for summary generation
let currentClicks = 0;
let currentNotes = [];
let currentSummaryText = '';

// Function to fetch data and render all sections
function fetchAndPrepareData() {
    // Request all stats and notes from the background script
    chrome.runtime.sendMessage({ action: "get_stats" }, (response) => {
        if (response) {
            // Store data globally for summary generation
            currentClicks = response.clickStats.last6Hours; 
            currentNotes = response.pickupNotes;
            
            // Automatically set Total Calls input to the number of search clicks
            document.getElementById('callCountInput').value = currentClicks;
        } else {
            console.error("Failed to get stats.");
        }
    });
}

// Function to handle shift summary generation
function handleEndShift() {
    const workingHours = document.getElementById('workingHoursInput').value.trim() || 'N/A';
    // Use the value from the input field, which is now pre-populated with currentClicks
    const callCount = parseInt(document.getElementById('callCountInput').value) || 0; 
    const summaryOutput = document.getElementById('summaryOutput');

    // Note: currentClicks is passed as the first argument (totalSearches) for summary generation
    currentSummaryText = generateShiftSummary(currentClicks, currentNotes, workingHours, callCount);
    
    summaryOutput.value = currentSummaryText;
}

// Function to submit the report to Supabase
async function handleSubmitReport() {
    if (!currentSummaryText) {
        alert("Please generate the shift summary first.");
        return;
    }

    const callerName = document.getElementById('callerNameInput').value;
    const workingHours = document.getElementById('workingHoursInput').value.trim() || 'N/A';
    // Get the value from the input field (which holds the search count)
    const callCount = parseInt(document.getElementById('callCountInput').value) || 0; 
    
    const totalPickups = currentNotes.length;
    const totalAppointments = currentNotes.filter(note => note.is_appointment).length;

    const reportData = {
        caller_name: callerName,
        working_hours: workingHours,
        total_calls: callCount, // This now stores the search count
        total_pickups: totalPickups,
        total_appointments: totalAppointments,
        report_notes: currentSummaryText,
        // user_id is null as we are not authenticated
        user_id: null, 
    };

    
    // Use the native fetch utility function (no token needed)
    const { data, error } = await submitShiftReport(reportData);

    if (error) {
        // Log the full error object for debugging
        console.error('Supabase Submission Error:', error);
        alert(`Failed to submit report: ${error.message}`);
    } else {
        alert("Shift report submitted successfully!");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Initial data fetch
    fetchAndPrepareData();

    // Setup event listener for generating shift summary
    document.getElementById("endShiftButton").addEventListener('click', handleEndShift);
    
    // Setup event listener for submitting the report
    document.getElementById("submitReportButton").addEventListener('click', handleSubmitReport);
    
    // Remove sign out listener as authentication is removed
});