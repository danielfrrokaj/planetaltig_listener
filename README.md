# Website Listener for planetaltig

A Chrome extension that tracks search link clicks on https://m.planetaltig.com/, records pickup notes, and generates shift summaries.

## Installation Instructions

Follow these steps to install the extension in Chrome:

### Step 1: Download the Extension Files
1. Download all extension files to a folder on your computer.
2. Make sure the folder contains:
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `popup.html`
   - `popup.js`
   - `summary.html`
   - `summary.js`
   - `options.html`
   - `options.js`
   - `supabase_auth.js`
   - `supabase_api.js`
   - `shift_summary.js`
   - `styles.css`
   - `login.html`
   - `login.js`
   - Icon files (`icon16.png`, `icon48.png`, `icon128.png`)

### Step 2: Open Chrome Extensions Page
1. Open Google Chrome.
2. In the address bar, type `chrome://extensions` and press Enter.

### Step 3: Enable Developer Mode
1. In the top right corner of the Extensions page, toggle the **Developer mode** switch to the ON position.

### Step 4: Load the Extension
1. Click the **Load unpacked** button that appears after enabling Developer mode.
2. In the file dialog, select the folder where you saved the extension files.
3. Click **Select Folder** (or **Open** on some systems).

### Step 5: Verify Installation
1. The extension should now appear in the list of installed extensions.
2. You can pin it to the toolbar by clicking the puzzle piece icon in the Chrome toolbar, then clicking the pin icon next to "Website Listener for planetaltig".

### Step 6: Start Using the Extension
1. Navigate to https://m.planetaltig.com/
2. Click the extension icon in the toolbar to open the popup and start tracking your shift data.

## Features
- Tracks search link clicks on planetaltig
- Records pickup notes with appointment tagging
- Generates shift summaries
- Submits reports to Supabase database
- User authentication and profile management

## Version History
See [VERSIONS.md](VERSIONS.md) for detailed change history.