const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');

// ── TOGGLE PANELS ───────────────────────────────────────────
registerTrigger.addEventListener('click', (e) => {
  e.preventDefault();
  authWrapper.classList.add('toggled');
});

loginTrigger.addEventListener('click', (e) => {
  e.preventDefault();
  authWrapper.classList.remove('toggled');
});

/* 
  Supabase Authentication Setup
  Note: Make sure to link this file in your HTML at the very bottom of the body tag using:
  <script type="module" src="auth.js"></script>
*/

// 1. Import Supabase securely from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Add your project URL and Anon Key here later
const SUPABASE_URL = ''; // <-- Paste your Supabase URL here later
const SUPABASE_KEY = ''; // <-- Paste your Supabase Anon Key here later

// 3. Initialize the Supabase Connection
let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.warn("Supabase URL or Key is missing. Update them in auth.js");
}

/* ============================================================== 
                     SIGN UP FORM LOGIC 
   ============================================================== */
const signupForm = document.querySelector('.credentials-panel.signup form');

if (signupForm) {
  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!supabase) {
      alert("Please update your Supabase URL and Key in auth.js first!");
      return;
    }

    // Get input elements by ID
    const firstName = document.getElementById('signupFirst').value;
    const lastName = document.getElementById('signupLast').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirm').value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    // Simple Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Indicate loading
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    // 4. Send the new user data to Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;

    if (error) {
      alert("Signup Error: " + error.message);
    } else {
      alert("Registration successful! Please check your email inbox to confirm your address.");
      signupForm.reset();
    }
  });
}

/* ============================================================== 
                      LOGIN FORM LOGIC 
   ============================================================== */
const loginForm = document.querySelector('.credentials-panel.signin form');

if (loginForm) {
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!supabase) {
      alert("Please update your Supabase URL and Key in auth.js first!");
      return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    // Call Supabase's signIn function
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    submitBtn.textContent = 'Login';
    submitBtn.disabled = false;

    if (error) {
      alert("Login Error: " + error.message);
    } else {
      alert("Login Complete! Welcome back.");
      // Optional: window.location.href = "dashboard.html"; 
      loginForm.reset();
    }
  });
}
