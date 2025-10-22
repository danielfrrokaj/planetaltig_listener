// login.js

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const signInButton = document.getElementById('signInButton');
    const errorMessage = document.getElementById('errorMessage');

    // Check if already logged in
    getSession().then(session => {
        if (session) {
            // Redirect to the main popup if already authenticated
            window.location.href = 'popup.html';
        }
    });

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    async function handleSignIn() {
        errorMessage.style.display = 'none';
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            displayError("Please enter both email and password.");
            return;
        }

        signInButton.disabled = true;
        signInButton.textContent = 'Signing In...';

        const { user, error } = await signIn(email, password);

        if (error) {
            console.error('Sign In Error:', error);
            displayError(error.message || 'Sign in failed. Check your credentials.');
            signInButton.disabled = false;
            signInButton.textContent = 'Sign In';
        } else if (user) {
            // Successful sign-in, redirect to main dashboard
            window.location.href = 'popup.html';
        }
    }

    signInButton.addEventListener('click', handleSignIn);
    
    // Allow pressing Enter to sign in
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSignIn();
        }
    });
});