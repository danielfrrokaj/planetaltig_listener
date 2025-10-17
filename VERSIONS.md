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