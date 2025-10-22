// options.js

let currentSession = null;

const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const avatarUrlInput = document.getElementById('avatarUrlInput');
const saveProfileButton = document.getElementById('saveProfileButton');
const usernameDisplay = document.getElementById('usernameDisplay');
const statusMessage = document.getElementById('statusMessage');

function displayStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? 'red' : 'green';
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

async function fetchProfile() {
    if (!currentSession) return;

    const { data, error } = await getProfile(currentSession.userId, currentSession.accessToken);

    if (error) {
        console.error('Error fetching profile:', error);
        displayStatus('Failed to load profile data.', true);
        return;
    }

    if (data && data.length > 0) {
        const profile = data[0];
        firstNameInput.value = profile.first_name || '';
        lastNameInput.value = profile.last_name || '';
        avatarUrlInput.value = profile.avatar_url || '';
    }
}

async function handleSaveProfile() {
    if (!currentSession) {
        displayStatus('Authentication required.', true);
        return;
    }

    saveProfileButton.disabled = true;
    saveProfileButton.textContent = 'Saving...';
    displayStatus('');

    const profileData = {
        first_name: firstNameInput.value.trim(),
        last_name: lastNameInput.value.trim(),
        avatar_url: avatarUrlInput.value.trim(),
        updated_at: new Date().toISOString()
    };

    const { error } = await updateProfile(currentSession.userId, profileData, currentSession.accessToken);

    if (error) {
        console.error('Error updating profile:', error);
        displayStatus('Failed to save profile. Check console for details.', true);
    } else {
        displayStatus('Profile saved successfully!');
    }

    saveProfileButton.disabled = false;
    saveProfileButton.textContent = 'Save Profile';
}


document.addEventListener("DOMContentLoaded", async () => {
    currentSession = await getSession();

    if (!currentSession) {
        // If not authenticated, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    usernameDisplay.textContent = `Username: ${currentSession.username}`;

    // Initial data fetch
    await fetchProfile();

    // Setup event listener for saving profile
    saveProfileButton.addEventListener('click', handleSaveProfile);
});