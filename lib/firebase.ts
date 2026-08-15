import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB9OHRa7p_WJICxG_gCu6dnBbwDZhiEHUs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shonpai-ecommerce.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shonpai-ecommerce",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shonpai-ecommerce.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "877170705519",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:877170705519:web:83dea969031ff40ac6799a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RSJ8LXJG7Z",
};

// Initialize Firebase (Singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");
facebookProvider.setCustomParameters({
  display: "popup",
});

// Admin emails list & check helper
export const ADMIN_EMAILS: string[] = [
  "rohan26ir@gmail.com",
  "admin@shobpai.com",
  "admin@gmail.com",
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
].filter(Boolean);

export const checkIsAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase().trim() === lower) ||
    lower.includes("admin")
  );
};

// Helper: Setup ReCAPTCHA for Phone Auth
export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if (typeof window === "undefined") {
    throw new Error("Recaptcha can only be initialized on the client");
  }

  // Clear any existing verifier instance on window
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Recaptcha verifier clear warning:", e);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - will proceed with submit
    },
    "expired-callback": () => {
      console.warn("Recaptcha expired, please retry.");
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

// Auth Functions

// 1. Email / Password Login
export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email.trim(), password);
};

// 2. Email / Password Registration
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName?: string,
  phoneNumber?: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

// 3. Google Sign-In
export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

// 4. Facebook Sign-In
export const loginWithFacebook = async () => {
  return await signInWithPopup(auth, facebookProvider);
};

// 5. Phone Authentication (SMS OTP)
export const sendPhoneOtp = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber.trim(), appVerifier);
};

export const verifyPhoneOtp = async (
  confirmationResult: ConfirmationResult,
  otpCode: string
) => {
  return await confirmationResult.confirm(otpCode.trim());
};

// 6. Password Reset Flows
export const resetPasswordEmail = async (email: string) => {
  return await sendPasswordResetEmail(auth, email.trim());
};

export const resetPasswordConfirm = async (oobCode: string, newPassword: string) => {
  return await confirmPasswordReset(auth, oobCode.trim(), newPassword);
};

// 7. Logout
export const logoutFirebase = async () => {
  return await signOut(auth);
};

export default app;
