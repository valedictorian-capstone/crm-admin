importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBgvcUE1_rdM6_dfStrYSdUQhIv8USNdy0",
    authDomain: "m-crm-company.firebaseapp.com",
    databaseURL: "https://m-crm-company.firebaseio.com",
    projectId: "m-crm-company",
    storageBucket: "m-crm-company.appspot.com",
    messagingSenderId: "827605403995",
    appId: "1:827605403995:web:d3693496db3d4ebf99727e",
    measurementId: "G-KB93V2FMWR"
});

const messaging = firebase.messaging();
