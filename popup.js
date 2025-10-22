// popup.js

// Utility function to render the list of pickup notes
function renderPickupNotes(notes) {
    const listEl = document.getElementById("pickupNotesList");
    listEl.innerHTML = ''; // Clear existing list

    if (notes.length === 0) {
        listEl.innerHTML = '<p class="no-notes">No pickups recorded yet.</p>';
        return;
    }

    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.dataset.id = note.id;

        const date = new Date(note.timestamp).toLocaleTimeString();

        noteItem.innerHTML = `
            <div class="note-header">
                <span>${date} ${note.is_appointment ? '<span class="appointment-tag">APPOINTMENT</span>' : ''}</span>
                <div>
                    <button class="delete-button" data-id="${note.id}">Delete</button>
                </div>
            </div>
            <div class="note-content">${note.note}</div>
        `;
        listEl.appendChild(noteItem);
    });

    // Attach event listeners for delete buttons
    listEl.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = parseInt(event.target.dataset.id);
            deleteNote(noteId);
        });
    });
}

// Function to delete a note
function deleteNote(id) {
    chrome.runtime.sendMessage({ action: "delete_pickup_note", id: id }, (response) => {
        if (response && response.success) {
            // Refresh stats and notes after deletion
            fetchAndRenderStats();
        } else {
            console.error("Failed to delete note.");
        }
    });
}

// Function to save a new note
function handleSaveNote() {
    const noteInput = document.getElementById("pickupNoteInput");
    const appointmentCheckbox = document.getElementById("isAppointmentCheckbox");
    const note = noteInput.value.trim();
    
    if (note === "") {
        alert("Please enter pickup notes.");
        return;
    }

    const isAppointment = appointmentCheckbox.checked;

    chrome.runtime.sendMessage({ 
        action: "save_pickup_note", 
        note: note, 
        is_appointment: isAppointment 
    }, (response) => {
        if (response && response.success) {
            noteInput.value = ''; // Clear input
            appointmentCheckbox.checked = false;
            // Refresh stats and notes after saving
            fetchAndRenderStats();
        } else {
            console.error("Failed to save note.");
        }
    });
}

// Global variables to store fetched data for summary generation
let currentClicks = [];
let currentNotes = [];

// Function to fetch data and render all sections
function fetchAndRenderStats() {
    // Request all stats and notes from the background script
    chrome.runtime.sendMessage({ action: "get_stats" }, (response) => {
        if (response) {
            // Store data globally for summary generation
            currentClicks = response.clickStats.totalClicks;
            currentNotes = response.pickupNotes;

            // 1. Render Click Stats
            document.getElementById("clicksLastHour").querySelector('.stat-value').textContent = response.clickStats.lastHour;
            document.getElementById("clicksLast3Hours").querySelector('.stat-value').textContent = response.clickStats.last3Hours;
            document.getElementById("clicksLast6Hours").querySelector('.stat-value').textContent = response.clickStats.last6Hours;

            // 2. Render Productivity Stats
            document.getElementById("pickupRate").querySelector('.stat-value').textContent = response.productivityStats.pickupRate;
            document.getElementById("appointmentRate").querySelector('.stat-value').textContent = response.productivityStats.appointmentRate;

            // 3. Render Pickup Notes List
            renderPickupNotes(response.pickupNotes);

        } else {
            console.error("Failed to get stats.");
            // Handle error display if necessary
        }
    });
}

// Function to handle shift summary generation
function handleEndShift() {
    const workingHours = document.getElementById('workingHoursInput').value.trim() || 'N/A';
    const callCount = parseInt(document.getElementById('callCountInput').value) || 0;
    const summaryOutput = document.getElementById('summaryOutput');

    // Use the globally stored data (updated by fetchAndRenderStats)
    const summaryText = generateShiftSummary(currentClicks, currentNotes, workingHours, callCount);
    
    summaryOutput.value = summaryText;
}


document.addEventListener("DOMContentLoaded", () => {
    // Initial data fetch and render
    fetchAndRenderStats();

    // Setup event listener for saving notes
    document.getElementById("saveNoteButton").addEventListener('click', handleSaveNote);

    // Setup event listener for generating shift summary
    document.getElementById("endShiftButton").addEventListener('click', handleEndShift);
});