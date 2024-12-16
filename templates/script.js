// Import Firebase configuration and initialize
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDbPH1f2-GvKgVF6A83d_ssbgR8c2da00A",
    authDomain: "health-chatbot-18438.firebaseapp.com",
    projectId: "health-chatbot-18438",
    storageBucket: "health-chatbot-18438.appspot.com",
    messagingSenderId: "192711634499",
    appId: "1:192711634499:web:1f01d5a179e1c6be1feef6",
    measurementId: "G-MT6LH1ZCYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle sign-up form submission
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        console.error('Error signing up:', error.code, error.message);
    }
});
























