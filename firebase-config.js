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

// Initialize Firestore
const db = firebase.firestore();

// Helper function to log events to Firestore
function logEvent(eventName, eventData = {}) {
    const event = {
        event_name: eventName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        url: window.location.href,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        ...eventData
    };

    db.collection('events').add(event)
        .then(() => console.log(`Event logged: ${eventName}`))
        .catch((error) => console.error("Error logging event: ", error));
}

// Generate or retrieve simplified session ID
function getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

console.log('Firebase Analytics & Firestore initialized successfully');
