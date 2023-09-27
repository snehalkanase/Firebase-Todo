// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBF_UIsOP1Py81pWwjJNdDFTHmoLU2ITlk",
    authDomain: "book-store-504e9.firebaseapp.com",
    projectId: "book-store-504e9",
    storageBucket: "book-store-504e9.appspot.com",
    messagingSenderId: "948021242648",
    appId: "1:948021242648:web:6a6354368ef2c6e50c8c6d"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/emoji.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });