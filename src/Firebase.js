// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZNyA_WLDQIYo0m3K0XfpGKdCgTzKDglk",
  authDomain: "todo-5a28c.firebaseapp.com",
  databaseURL: "https://todo-5a28c-default-rtdb.firebaseio.com",
  projectId: "todo-5a28c",
  storageBucket: "todo-5a28c.appspot.com",
  messagingSenderId: "735266617793",
  appId: "1:735266617793:web:b2e95b9fa76e69beec5740",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initialize Firebase
export default db;
