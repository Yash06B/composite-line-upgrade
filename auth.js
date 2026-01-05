// Firebase Authentication Logic

// Initialize Firebase
if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error("Firebase SDK not loaded or config missing.");
}

const auth = firebase.auth();

// Sign Up Function
async function signUp(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login Function
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout Function
async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

// Auth State Observer
auth.onAuthStateChanged((user) => {
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
    const authBtn = document.getElementById('auth-btn');

    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);

        if (authBtn) {
            authBtn.textContent = 'Logout';
            authBtn.onclick = logout;
        }

        if (isLoginPage) {
            window.location.href = 'index.html'; // Redirect to dashboard
        }
    } else {
        // User is signed out
        console.log("User is signed out");

        if (authBtn) {
            authBtn.textContent = 'Login';
            authBtn.onclick = () => window.location.href = 'login.html';
        }

        if (!isLoginPage) {
            // Uncomment next line to Force Login (Protect Dashboard)
            // window.location.href = 'login.html'; 
        }
    }
});

// Global function for HTML onclick
window.handleAuthAction = function () {
    const user = firebase.auth().currentUser;
    if (user) {
        logout();
    } else {
        window.location.href = 'login.html';
    }
};
