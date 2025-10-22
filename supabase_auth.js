// supabase_auth.js

const AUTH_STORAGE_KEY = 'supabaseSession';

// Supabase Project Configuration (same as supabase_api.js)
const SUPABASE_URL = 'https://yxxladzheqoeecopdduv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxhZHpoZXFvZWVjb3BkZHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTU1ODgsImV4cCI6MjA3NjU3MTU4OH0.zw6oBV_9CFkUPSduforms1oeDuXd66P8wWWF27M7Mio';

/**
 * Retrieves the current session data from storage.
 * @returns {Promise<{accessToken: string, userId: string, username: string}|null>}
 */
function getSession() {
    return new Promise(resolve => {
        chrome.storage.local.get(AUTH_STORAGE_KEY, (data) => {
            resolve(data[AUTH_STORAGE_KEY] || null);
        });
    });
}

/**
 * Saves the session data to storage.
 * @param {Object} session - The session object containing access_token, user_id, and username.
 * @returns {Promise<void>}
 */
function saveSession(session) {
    return new Promise(resolve => {
        chrome.storage.local.set({ [AUTH_STORAGE_KEY]: session }, resolve);
    });
}

/**
 * Clears the session data from storage.
 * @returns {Promise<void>}
 */
function clearSession() {
    return new Promise(resolve => {
        chrome.storage.local.remove(AUTH_STORAGE_KEY, resolve);
    });
}

/**
 * Handles user sign-in via email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
async function signIn(email, password) {
    const url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { user: null, error: data };
        }

        // Extract necessary data
        const sessionData = {
            accessToken: data.access_token,
            userId: data.user.id,
            username: data.user.email // Using email as username based on trigger logic
        };
        
        await saveSession(sessionData);
        return { user: sessionData, error: null };

    } catch (e) {
        console.error("Sign-in network error:", e);
        return { user: null, error: { message: 'Network error during sign-in.' } };
    }
}

/**
 * Handles user sign-out.
 * @returns {Promise<{error: Object|null}>}
 */
async function signOut() {
    const session = await getSession();
    if (!session) {
        await clearSession();
        return { error: null };
    }

    const url = `${SUPABASE_URL}/auth/v1/logout`;
    
    try {
        // We use the access token to invalidate the session on the server side
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.accessToken}`
            }
        });
        
        // Clear local storage regardless of server response
        await clearSession();
        return { error: null };

    } catch (e) {
        console.error("Sign-out network error:", e);
        await clearSession(); // Ensure local state is cleared even if network fails
        return { error: null };
    }
}