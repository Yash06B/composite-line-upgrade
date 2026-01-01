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

    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        if (isLoginPage) {
            window.location.href = 'index.html'; // Redirect to dashboard
        }
    } else {
        // User is signed out
        console.log("User is signed out");
        if (!isLoginPage) {
            window.location.href = 'login.html'; // Redirect to login
        }
    }
});
