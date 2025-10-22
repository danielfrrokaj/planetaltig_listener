// supabase_api.js

// Supabase Project Configuration
const SUPABASE_URL = 'https://yxxladzheqoeecopdduv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxhZHpoZXFvZWVjb3BkZHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTU1ODgsImV4cCI6MjA3NjU3MTU4OH0.zw6oBV_9CFkUPSduforms1oeDuXd66P8wWWF27M7Mio';

/**
 * Submits a shift report directly to the Supabase PostgREST API using fetch.
 * This method uses the anonymous key for public insertion.
 * 
 * @param {Object} reportData - The data object to insert into 'shift_reports'.
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
async function submitShiftReport(reportData) {
    const url = `${SUPABASE_URL}/rest/v1/shift_reports`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, // Use ANON key for public access
                'Prefer': 'return=representation' // Ensures the inserted data is returned
            },
            body: JSON.stringify(reportData)
        });

        if (!response.ok) {
            // Attempt to parse error body for detailed message
            let errorBody = {};
            try {
                errorBody = await response.json();
            } catch (e) {
                // If JSON parsing fails, use raw text
                errorBody = await response.text();
            }
            
            return { 
                data: null, 
                error: { 
                    message: `HTTP Error ${response.status}: ${response.statusText}`,
                    details: errorBody 
                } 
            };
        }

        const data = await response.json();
        return { data, error: null };

    } catch (e) {
        console.error("Network or unexpected error during fetch:", e);
        return { 
            data: null, 
            error: { 
                message: 'A network or unexpected error occurred.', 
                details: e.message 
            } 
        };
    }
}