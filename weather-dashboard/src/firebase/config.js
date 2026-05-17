import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCajAPi5c6ZmdOJgZAGAiGeaquGHzMscIk",
  authDomain: "weather-dashboard-2abf4.firebaseapp.com",
  projectId: "weather-dashboard-2abf4",
  storageBucket: "weather-dashboard-2abf4.firebasestorage.app",
  messagingSenderId: "1006734213219",
  appId: "1:1006734213219:web:e333bfc5bee134d56af856",
  measurementId: "G-CXEL23G8GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Email/Password authentication functions
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users.push({
      id: userCredential.user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export { auth, googleProvider };