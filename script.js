document.addEventListener('DOMContentLoaded', () => {
    const scopesContainer = document.getElementById('scopes-container');

    // Simplified and representative scope data
    const scopeData = {
        "User Information": {
            "View your email address": "email",
            "View your basic profile info": "profile",
            "OpenID Connect": "openid"
        },
        "Gmail API": {
            "Read, compose, send, and permanently delete all your email from Gmail": "https://www.googleapis.com/auth/gmail.modify",
            "View your email messages and settings": "https://www.googleapis.com/auth/gmail.readonly",
            "Manage drafts and send emails": "https://www.googleapis.com/auth/gmail.compose",
            "Insert mail into your Gmail mailbox": "https://www.googleapis.com/auth/gmail.insert",
            "View and manage your mail labels": "https://www.googleapis.com/auth/gmail.labels"
            // Not adding all Gmail scopes for brevity, user requested subcategories for large sets
        },
        "Google Drive API": {
            "See, edit, create, and delete all of your Google Drive files": "https://www.googleapis.com/auth/drive",
            "View and manage metadata of files in your Google Drive": "https://www.googleapis.com/auth/drive.metadata",
            "View and download all your Google Drive files": "https://www.googleapis.com/auth/drive.readonly"
        },
        "Google Calendar API": {
            "See, edit, share, and permanently delete all the calendars you can access": "https://www.googleapis.com/auth/calendar",
            "View events on all your calendars": "https://www.googleapis.com/auth/calendar.events",
            "View your calendars": "https://www.googleapis.com/auth/calendar.readonly"
        },
        // Example of a more granular Google Cloud category (as requested for large scope sets)
        "Google Cloud - Storage": {
            "Manage your data and permissions in Google Cloud Storage": "https://www.googleapis.com/auth/devstorage.full_control",
            "View your data in Google Cloud Storage": "https://www.googleapis.com/auth/devstorage.read_only",
            "Manage your data in Cloud Storage": "https://www.googleapis.com/auth/devstorage.read_write"
        }
    };

    function generateScopeUI() {
        for (const category in scopeData) {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('scope-category');

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            for (const description in scopeData[category]) {
                const scope = scopeData[category][description];
                const button = document.createElement('button');
                button.classList.add('scope-button');
                button.textContent = description; // Show description on button
                button.dataset.scope = scope; // Store actual scope value in data attribute
                categoryDiv.appendChild(button);
            }
            scopesContainer.appendChild(categoryDiv);
        }
    }

    generateScopeUI();

    // --- Start of code to append ---

    const clientIdInput = document.getElementById('client_id');
    const redirectUriInput = document.getElementById('redirect_uri');
    const responseTypeInput = document.getElementById('response_type');
    const accessTypeInput = document.getElementById('access_type');
    const stateInput = document.getElementById('state');
    const includeGrantedScopesInput = document.getElementById('include_granted_scopes');
    const loginHintInput = document.getElementById('login_hint');
    const promptInput = document.getElementById('prompt');
    const oauthLinkTextarea = document.getElementById('oauth_link');

    function generateOAuthLink() {
        const clientId = clientIdInput.value.trim();
        const redirectUri = redirectUriInput.value.trim();
        const responseType = responseTypeInput.value.trim();
        const accessType = accessTypeInput.value.trim();
        const state = stateInput.value.trim();
        const includeGrantedScopes = includeGrantedScopesInput.value.trim();
        const loginHint = loginHintInput.value.trim();
        const promptValue = promptInput.value.trim();

        if (!clientId || !redirectUri) {
            oauthLinkTextarea.value = "Client ID and Redirect URI are required.";
            return;
        }

        let scopes = [];
        document.querySelectorAll('.scope-button.selected').forEach(button => {
            scopes.push(button.dataset.scope);
        });

        let link = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}`;
        link += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
        link += `&response_type=${encodeURIComponent(responseType)}`;
        link += `&scope=${encodeURIComponent(scopes.join(' '))}`; // Scopes are space-separated

        if (accessType) {
            link += `&access_type=${encodeURIComponent(accessType)}`;
        }
        if (state) {
            link += `&state=${encodeURIComponent(state)}`;
        }
        if (includeGrantedScopes) {
            link += `&include_granted_scopes=${encodeURIComponent(includeGrantedScopes)}`;
        }
        if (loginHint) {
            link += `&login_hint=${encodeURIComponent(loginHint)}`;
        }
        if (promptValue) {
            link += `&prompt=${encodeURIComponent(promptValue)}`;
        }

        oauthLinkTextarea.value = link;
    }

    // Initial call to generate link based on default values (if any)
    // generateOAuthLink(); // We'll call this once event listeners are set up

    // --- End of code to append ---

    // --- Start of code to append ---

    // Event listeners for text input fields
    const allInputs = [
        clientIdInput, redirectUriInput, responseTypeInput, accessTypeInput,
        stateInput, includeGrantedScopesInput, loginHintInput, promptInput
    ];

    allInputs.forEach(input => {
        if (input) { // Check if element exists
            input.addEventListener('input', generateOAuthLink);
        }
    });

    // Event listeners for scope buttons (needs to be attached after UI generation)
    // We need to re-select them here as they are dynamically generated.
    document.querySelectorAll('.scope-button').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            generateOAuthLink(); // Regenerate link when a scope is selected/deselected
        });
    });

    // Event listener for the copy button
    const copyButton = document.getElementById('copy_button');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            oauthLinkTextarea.select();
            try {
                document.execCommand('copy');
                // Optional: Add some visual feedback, like changing button text
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 1500);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Optional: Inform user copying failed
                alert('Failed to copy link. Please copy it manually.');
            }
        });
    }

    // Initial call to generate the link when the page loads and all elements are ready
    generateOAuthLink();

    // --- End of code to append ---
});
