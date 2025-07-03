// Login Page JavaScript

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('auth-tab--active'));
            authForms.forEach(f => f.classList.remove('auth-form--active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('auth-tab--active');
            document.getElementById(targetTab + '-form').classList.add('auth-form--active');
        });
    });

    // Password confirmation validation
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    
    if (signupConfirmPassword) {
        signupConfirmPassword.addEventListener('input', function() {
            if (this.value !== signupPassword.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});

// Sign In form handler
function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate authentication (replace with actual backend call)
    console.log('Signing in with:', { email, password, rememberMe });
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, always succeed
        showMessage('Successfully signed in!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Redirect to dashboard or home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 1500);
}

// Sign Up form handler
function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, always succeed
        showMessage('Account created successfully!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Switch to sign in tab
        setTimeout(() => {
            document.querySelector('[data-tab="signin"]').click();
            // Clear sign up form
            event.target.reset();
        }, 1000);
    }, 1500);
}

// Social authentication handlers
function handleGoogleAuth() {
    console.log('Google authentication clicked');
    showMessage('Google authentication coming soon!', 'info');
}

function handleGitHubAuth() {
    console.log('GitHub authentication clicked');
    showMessage('GitHub authentication coming soon!', 'info');
}

// Message display function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message--${type}`;
    messageEl.textContent = message;
    
    // Insert message at the top of the auth container
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(messageEl, authContainer.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Forgot password handler
function handleForgotPassword(event) {
    event.preventDefault();
    const email = prompt('Enter your email address to reset your password:');
    if (email) {
        showMessage('Password reset link sent to your email!', 'success');
    }
}

// Add event listeners for social buttons and forgot password
document.addEventListener('DOMContentLoaded', function() {
    // Social authentication buttons
    const googleBtns = document.querySelectorAll('.social-btn--google');
    const githubBtns = document.querySelectorAll('.social-btn--github');
    
    googleBtns.forEach(btn => {
        btn.addEventListener('click', handleGoogleAuth);
    });
    
    githubBtns.forEach(btn => {
        btn.addEventListener('click', handleGitHubAuth);
    });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
}); 