// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyAFS5S02Woxx95KprewCIDTsiF8JO29-04",
    authDomain: "dts-tempo.firebaseapp.com",
    databaseURL: "https://dts-tempo-default-rtdb.firebaseio.com",
    projectId: "dts-tempo",
    storageBucket: "dts-tempo.appspot.com",
    messagingSenderId: "545746102823",
    appId: "1:545746102823:web:604ead1a02bc771ab8bc02",
    measurementId: "G-20YT1L9KFS"
    };


    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);


    var db = getDatabase(app);
export default db;

