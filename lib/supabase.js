// lib/supabase.js
// This file simulates the global exposure of createClient that the Supabase UMD bundle provides.
// WARNING: This is a mock implementation. Real Supabase functionality requires the actual UMD bundle content here.

window.createClient = function(supabaseUrl, supabaseKey) {
    console.warn("Using MOCK Supabase client. Real authentication and database operations will be simulated.");
    
    // Mock the necessary methods used in summary.js
    return {
        auth: {
            async getUser() {
                // Mock a logged-in user for testing the submission flow structure
                return { data: { user: { id: 'mock-user-id-12345' } } };
            }
        },
        from: function(tableName) {
            return {
                insert: function(data) {
                    console.log(`DB MOCK: Successfully simulated insert into ${tableName}. Data:`, data);
                    
                    // Return an object that includes the .select() method
                    return {
                        select: async function() {
                            // Simulate a successful Supabase response structure
                            return { 
                                data: data, // Return the inserted data
                                error: null 
                            };
                        }
                    };
                }
            };
        }
    };
};