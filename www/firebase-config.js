// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQg9XMSYE-m5biWvpggQnudcWukO4NpyI",
    authDomain: "portafoglio-1f1a0.firebaseapp.com",
    projectId: "portafoglio-1f1a0",
    storageBucket: "portafoglio-1f1a0.firebasestorage.app",
    messagingSenderId: "1066741719438",
    appId: "1:1066741719438:web:c490ec7cb6532cd0dcc4df",
    measurementId: "G-5H3ZDG8DG1"
};

// Initialize Firebase
// Note: We are using the compat libraries loaded via script tags in HTML
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
// const analytics = firebase.analytics(); // Optional, requires analytics script

// Export for use in other files
window.auth = auth;
window.db = db;

console.log('Firebase initialized successfully');
