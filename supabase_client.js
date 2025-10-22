// supabase_client.js

const SUPABASE_URL = 'https://yxxladzheqoeecopdduv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxhZHpoZXFvZWVjb3BkZHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTU1ODgsImV4cCI6MjA3NjU3MTU4OH0.zw6oBV_9CFkUPSduforms1oeDuXd66P8wWWF27M7Mio';

// We assume the Supabase JS library is available globally (e.g., via a build step).
if (typeof createClient !== 'undefined') {
    window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error("Supabase client library (createClient) is not available.");
}