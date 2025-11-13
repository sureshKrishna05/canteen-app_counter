import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification, // <-- IMPORT THIS
} from "firebase/auth";
import { auth } from "./firebase"; // Import auth from your firebase.js

/**
 * Signs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs up a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export const logout = () => {
  return signOut(auth);
};

/**
 * Sends a verification email to the currently signed-in user.
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = () => {
  // We send it to the auth.currentUser, which is set
  // immediately after a successful signup.
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser);
  }
  throw new Error("No user is currently signed in to send verification.");
};