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

## v1.7.0 – 2025-08-29
- Moved the Shift Summary feature to a dedicated page (summary.html and summary.js) accessible via a navigation link from the main popup.
- Updated popup.html and popup.js to remove summary elements and logic.

## v1.8.0 – 2025-08-29
- Integrated Supabase for shift report storage.
- Dropped old profiles table and created `shift_reports` table with RLS policies allowing authenticated users to read all reports.
- Added 'Submit Report' functionality to summary.js using Supabase client.
- Fixed Supabase client initialization issue in vanilla JS extension by loading the library via CDN and updating manifest.json CSP.

## v1.8.1 – 2025-08-29
- Fixed Manifest V3 CSP error by removing the insecure CDN source. Updated popup.html and summary.html to load the Supabase library from a local file (`lib/supabase.js`) to comply with the stricter CSP rules.

## v1.8.2 – 2025-08-29
- Implemented a mock Supabase client in `lib/supabase.js` to define `createClient` globally, resolving the "client not initialized" error and allowing the submission flow to be tested without the full UMD bundle.

## v1.9.0 – 2025-08-29
- Redefined the `shift_reports` database schema to remove the dependency on Supabase authentication (`user_id`).
- Replaced `user_id` with a `caller_name` column using a new ENUM type ('caller1', 'caller2', 'caller3').
- Updated RLS policies to allow anonymous inserts and public reads.
- Modified `summary.html` to include a caller name selection dropdown.
- Updated `summary.js` to use the selected caller name for report submission instead of fetching the authenticated user ID.

## v1.9.1 – 2025-08-29
- Clarified the distinction between automatically tracked search clicks and manually entered calls.
- Renamed the database column `total_clicks` to `total_searches` in the `shift_reports` table.
- Updated `shift_summary.js` and `summary.js` to use `totalSearches` for clarity when submitting data.

## v1.9.2 – 2025-08-29
- Disabled Row Level Security (RLS) on the `shift_reports` table and dropped all associated policies to ensure public insertion access for testing purposes.

## v1.9.3 – 2025-08-29
- Explicitly dropped and recreated the `caller_enum` type and the `shift_reports` table to guarantee schema integrity and resolve persistent insertion failures. RLS remains disabled.

## v1.9.4 – 2025-08-29
- Updated the Supabase insertion query in `summary.js` to include `.select()` after `.insert()` for improved compatibility and adherence to Supabase best practices.

## v1.9.5 – 2025-08-29
- Updated the mock Supabase client in `lib/supabase.js` to correctly simulate the asynchronous response structure expected by the `.insert().select()` chain, ensuring the success path in `summary.js` is correctly executed.

## v1.9.6 – 2025-08-29
- Enhanced error logging in `summary.js` to explicitly log the full Supabase error object to the console if submission fails, aiding in debugging.

## v2.0.0 – 2025-08-29
- Refactored Supabase integration to use native `fetch` API directly against the PostgREST endpoint, eliminating the need for the large `@supabase/supabase-js` library and resolving potential issues with the mock client and MV3 CSP.
- Created `supabase_api.js` to handle direct API calls for submitting shift reports.
- Removed deprecated files `lib/supabase.js` and `supabase_client.js`.
- Updated `summary.js`, `summary.html`, `popup.html`, and `manifest.json` to reflect the new API integration method and added necessary `host_permissions` to the manifest.

## v2.1.0 – 2025-08-30
- Implemented user authentication to resolve HTTP 401 errors caused by the new database schema requiring a non-null `user_id`.
- Applied new database schema requiring `user_id` NOT NULL and enabled RLS policies restricting inserts to authenticated users (who must provide their own `user_id`).
- Created `login.html` and `login.js` for user sign-in using direct Supabase Auth API calls.
- Created `supabase_auth.js` to manage session storage (`access_token`, `user_id`) in `chrome.storage.local`.
- Updated `popup.html`, `popup.js`, `summary.html`, and `summary.js` to enforce authentication checks, redirect unauthenticated users to `login.html`, and include sign-out functionality.
- Modified `supabase_api.js` and `summary.js` to use the authenticated user's JWT for authorization and include the required `user_id` in the report submission payload.

## v2.2.0 – 2025-08-30
- Reverted authentication requirements to allow public, unauthenticated data submission.
- Updated the `shift_reports` schema to remove the `user_id` column and its foreign key constraint.
- Updated RLS policies to allow anonymous users to INSERT and SELECT data (`TO public WITH CHECK (true)`).
- Deleted authentication files (`login.html`, `login.js`, `supabase_auth.js`).
- Reverted `supabase_api.js`, `summary.js`, `popup.html`, `popup.js`, `summary.html`, and `styles.css` to remove all authentication checks and logic.