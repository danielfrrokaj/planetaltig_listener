# Version History

## v1.0.0 – 2025-08-24
- @ToneDice created manifest.json with basic permissions and action popup
- Added background.js with minimal event listener
- Added content.js placeholder
- Added popup.html and popup.js with simple ping functionality
- Added styles.css for minimal popup styling

## v1.1.0 – 2025-08-26
- Updated manifest.json to target content scripts to `https://m.planetaltig.com/*`.
- Modified content.js to listen for clicks on `<a>` tags with `name="search"` and send timestamps to background.
- Updated background.js to store click timestamps in `chrome.storage.local` and provide filtered counts for the last 1, 3, and 6 hours.
- Modified popup.html and popup.js to display these click statistics.

## v1.2.0 – 2025-08-27
- Improved the user interface of the popup.html and styles.css to present click statistics in a dashboard-like format with distinct cards for each timeframe.
- Updated popup.js to correctly target the new elements for displaying statistics.

## v1.3.0 – 2025-08-27
- Renamed the extension from "Dyad Chrome Extension Template" to "Website listener" in manifest.json and popup.html.

## v1.4.0 – 2025-08-28
- Added functionality to track and manage 'pickup notes' including a boolean 'is_appointment' flag.
- Updated background.js to store pickup notes, handle saving and deletion, and calculate productivity rates (Total Clicks / Total Pickups and Total Clicks / Appointments).
- Updated popup.html, popup.js, and styles.css to include a form for adding notes, display productivity metrics, and list recent notes with a delete button.

## v1.5.0 – 2025-08-28
- Corrected the productivity calculation in background.js to calculate success rates as a percentage: (Pickups / Total Clicks) * 100.
- Updated labels in popup.html to reflect 'Success Rate'.

## v1.6.0 – 2025-08-28
- Added 'Shift Summary' section to popup.html with inputs for working hours and total calls.
- Created shift_summary.js utility to format and generate the shift summary text based on stored clicks and pickup notes.
- Updated popup.js and styles.css to integrate the new summary generation feature.