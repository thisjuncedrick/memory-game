// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCM0IVLLbzPA-Pmy8AHbJzO-esOUiAORbg",
    authDomain: "gv101-leaderboard-system.firebaseapp.com",
    projectId: "gv101-leaderboard-system",
    storageBucket: "gv101-leaderboard-system.appspot.com",
    messagingSenderId: "146360989462",
    appId: "1:146360989462:web:c109790cac782051304237",
    measurementId: "G-T0WPRWLNMJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
