// Firebase Configuration and Initialization
// Firebase SDK v9+ modular approach adapted for browser CDN

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEtaqvlQzO5YjgqiwieXgB3xwXX8GOhFQ",
    authDomain: "vestidos-moldes.firebaseapp.com",
    projectId: "vestidos-moldes",
    storageBucket: "vestidos-moldes.firebasestorage.app",
    messagingSenderId: "808428771223",
    appId: "1:808428771223:web:c6e0af3cbf7fa7154156d2",
    measurementId: "G-3W3KZRE5ZT"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = firebase.analytics();

console.log('Firebase Analytics initialized successfully');
