// supabase_api.js

(function() {
    // Supabase Project Configuration
    const SUPABASE_URL = 'https://yxxladzheqoeecopdduv.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxhZHpoZXFvZWVjb3BkZHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTU1ODgsImV4cCI6MjA3NjU3MTU4OH0.zw6oBV_9CFkUPSduforms1oeDuXd66P8wWWF27M7Mio';

    /**
     * Generic fetch utility for Supabase PostgREST.
     * @param {string} endpoint - The table endpoint (e.g., 'shift_reports' or 'profiles').
     * @param {string} method - HTTP method (GET, POST, PATCH).
     * @param {string} jwtToken - JWT token for authorization.
     * @param {Object} [body] - Request body for POST/PATCH.
     * @param {string} [query] - Query parameters (e.g., '?select=*').
     * @returns {Promise<{data: Object|null, error: Object|null}>}
     */
    async function supabaseFetch(endpoint, method, jwtToken, body = null, query = '') {
        const url = `${SUPABASE_URL}/rest/v1/${endpoint}${query}`;
        
        const authorizationHeader = `Bearer ${jwtToken}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': authorizationHeader,
        };

        if (method === 'POST' || method === 'PATCH') {
            headers['Prefer'] = 'return=representation';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: body ? JSON.stringify(body) : null
            });

            if (!response.ok) {
                let errorBody = {};
                try {
                    errorBody = await response.json();
                } catch (e) {
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

    /**
     * Submits a shift report directly to the Supabase PostgREST API using fetch.
     */
    async function submitShiftReport(reportData, jwtToken) {
        return supabaseFetch('shift_reports', 'POST', jwtToken, reportData);
    }

    /**
     * Fetches the user's profile data.
     */
    async function getProfile(userId, jwtToken) {
        const query = `?id=eq.${userId}&select=first_name,last_name,avatar_url`;
        return supabaseFetch('profiles', 'GET', jwtToken, null, query);
    }

    /**
     * Updates the user's profile data.
     */
    async function updateProfile(userId, profileData, jwtToken) {
        const query = `?id=eq.${userId}`;
        return supabaseFetch('profiles', 'PATCH', jwtToken, profileData, query);
    }

    // Expose functions globally
    window.submitShiftReport = submitShiftReport;
    window.getProfile = getProfile;
    window.updateProfile = updateProfile;
})();