// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeEx-B6UeKWyDWrxQbAqcR82xZRXiN1ko",
  authDomain: "meddonate-47326.firebaseapp.com",
  projectId: "meddonate-47326",
  storageBucket: "meddonate-47326.firebasestorage.app",
  messagingSenderId: "206299294102",
  appId: "1:206299294102:web:9786a0e26223833a1e55b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Initialize Auth
export const auth = getAuth(app);