// shift_summary.js

/**
 * Generates the final shift summary text.
 * @param {number} totalSearches - Total search clicks recorded (last 6 hours).
 * @param {Array<Object>} pickupNotes - List of recorded pickup notes.
 * @param {string} workingHours - User-provided working hours string.
 * @param {number} callCount - User-provided total calls count.
 * @returns {string} The formatted summary text.
 */
function generateShiftSummary(
  totalSearches,
  pickupNotes,
  workingHours,
  callCount,
) {
  const totalPickups = pickupNotes.length;

  const wrongNumberNotes = pickupNotes.filter((note) => !note.is_appointment);
  const appointmentNotes = pickupNotes.filter((note) => note.is_appointment);

  let summary = `Today’s feedback\n`;
  summary += `Working hours: ${workingHours}\n`;
  summary += `Calls Submitted: ${callCount}\n`; // Changed from Calls: ${callCount}
  summary += `Pick ups: ${totalPickups}\n\n`;
  summary += `Total Search Clicks (Last 6h): ${totalSearches}\n\n`; // Keeping this line for context, but changing the label below

  // 1. Wrong Number/General Pickups
  if (wrongNumberNotes.length > 0) {
    summary += `Pickups (${wrongNumberNotes.length})\n`;
    wrongNumberNotes.forEach((note) => {
      // Assuming the user enters Name and Phone in the note field
      summary += `${note.note}\n\n`;
    });
  } else {
    summary += `Pickups (0)\n\n`;
  }

  // 2. Appointments
  if (appointmentNotes.length > 0) {
    summary += `Appointment (${appointmentNotes.length})\n`;
    appointmentNotes.forEach((note) => {
      // Assuming the user enters Name and Phone in the note field
      summary += `${note.note}\n\n`;
    });
  } else {
    summary += `Appointment (0)\n\n`;
  }

  return summary.trim();
}
