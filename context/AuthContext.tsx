"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";
import {
  auth,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  loginWithGoogle as fbLoginWithGoogle,
  loginWithFacebook as fbLoginWithFacebook,
  sendPhoneOtp as fbSendPhoneOtp,
  verifyPhoneOtp as fbVerifyPhoneOtp,
  resetPasswordEmail as fbResetPasswordEmail,
  resetPasswordConfirm as fbResetPasswordConfirm,
  logoutFirebase,
  setupRecaptcha,
  checkIsAdmin,
  ADMIN_EMAILS,
} from "@/lib/firebase";
import { api } from "@/lib/api";

export type Role = "USER" | "ADMIN" | "GUEST";

export interface AppUser {
  id?: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: Role;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  role: Role;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  adminEmails: string[];
  loginWithEmail: (email: string, pass: string) => Promise<any>;
  registerWithEmail: (email: string, pass: string, name?: string, phone?: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  loginWithFacebook: () => Promise<any>;
  setupRecaptchaVerifier: (elementId: string) => RecaptchaVerifier;
  sendPhoneOtp: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, otpCode: string) => Promise<any>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  setManualRole: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("GUEST");
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state when Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);

          // Determine role: checks if email is in admin list (rohan26ir@gmail.com, etc.)
          const isAdminUser = checkIsAdmin(fbUser.email);
          const initialRole: Role = isAdminUser ? "ADMIN" : "USER";

          // Try syncing with backend API if available
          try {
            const dbUser = await api.syncUser(
              {
                firebaseUid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL,
                phoneNumber: fbUser.phoneNumber,
                role: initialRole as "USER" | "ADMIN",
              },
              idToken
            );

            const userRole: Role = isAdminUser ? "ADMIN" : ((dbUser?.role as Role) || initialRole);
            setRole(userRole);
            setUser({
              id: dbUser?.id,
              firebaseUid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || dbUser?.displayName || fbUser.email?.split("@")[0] || "User",
              phoneNumber: fbUser.phoneNumber || dbUser?.phoneNumber,
              photoURL: fbUser.photoURL || dbUser?.photoURL,
              role: userRole,
            });
          } catch (syncErr) {
            // Fallback during local development if API is offline
            setRole(initialRole);
            setUser({
              firebaseUid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split("@")[0] || (fbUser.phoneNumber ? `User (${fbUser.phoneNumber})` : "User"),
              phoneNumber: fbUser.phoneNumber,
              photoURL: fbUser.photoURL,
              role: initialRole,
            });
          }

          localStorage.setItem("shobpai_logged_in", "true");
          if (fbUser.email) localStorage.setItem("shobpai_user_email", fbUser.email);
          localStorage.setItem("shobpai_role", initialRole);
        } catch (tokenErr) {
          console.error("Token error:", tokenErr);
        }
      } else {
        // Check for saved role or demo user session if offline
        const storedRole = (localStorage.getItem("shobpai_role") as Role) || null;
        const storedEmail = localStorage.getItem("shobpai_user_email") || null;
        const isLoggedIn = localStorage.getItem("shobpai_logged_in") === "true";

        if (isLoggedIn && storedEmail) {
          const isAdminUser = checkIsAdmin(storedEmail);
          const userRole: Role = isAdminUser ? "ADMIN" : (storedRole || "USER");
          setRole(userRole);
          setUser({
            firebaseUid: "local-session-uid",
            email: storedEmail,
            displayName: storedEmail.split("@")[0] || "User",
            phoneNumber: null,
            photoURL: null,
            role: userRole,
          });
        } else {
          setFirebaseUser(null);
          setUser(null);
          setToken(null);
          setRole("GUEST");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmailHandler = async (email: string, pass: string) => {
    try {
      const res = await fbLoginWithEmail(email, pass);
      const isAdminUser = checkIsAdmin(email);
      const userRole: Role = isAdminUser ? "ADMIN" : "USER";
      setRole(userRole);
      localStorage.setItem("shobpai_logged_in", "true");
      localStorage.setItem("shobpai_user_email", email);
      localStorage.setItem("shobpai_role", userRole);
      return res;
    } catch (e: any) {
      if (e?.code?.includes("invalid-api-key") || e?.message?.includes("API key")) {
        const isAdminUser = checkIsAdmin(email);
        const mockRole: Role = isAdminUser ? "ADMIN" : "USER";
        setRole(mockRole);
        setUser({
          firebaseUid: "dev-uid-" + Date.now(),
          email,
          displayName: email.split("@")[0],
          phoneNumber: null,
          photoURL: null,
          role: mockRole,
        });
        localStorage.setItem("shobpai_role", mockRole);
        localStorage.setItem("shobpai_user_email", email);
        localStorage.setItem("shobpai_logged_in", "true");
        return { user: { email, uid: "dev-mock-uid" } };
      }
      throw e;
    }
  };

  const registerWithEmailHandler = async (
    email: string,
    pass: string,
    name?: string,
    phone?: string
  ) => {
    try {
      const res = await fbRegisterWithEmail(email, pass, name, phone);
      const isAdminUser = checkIsAdmin(email);
      const userRole: Role = isAdminUser ? "ADMIN" : "USER";
      setRole(userRole);
      localStorage.setItem("shobpai_logged_in", "true");
      localStorage.setItem("shobpai_user_email", email);
      localStorage.setItem("shobpai_role", userRole);
      return res;
    } catch (e: any) {
      if (e?.code?.includes("invalid-api-key") || e?.message?.includes("API key")) {
        const isAdminUser = checkIsAdmin(email);
        const mockRole: Role = isAdminUser ? "ADMIN" : "USER";
        setRole(mockRole);
        setUser({
          firebaseUid: "dev-uid-" + Date.now(),
          email,
          displayName: name || email.split("@")[0],
          phoneNumber: phone || null,
          photoURL: null,
          role: mockRole,
        });
        localStorage.setItem("shobpai_role", mockRole);
        localStorage.setItem("shobpai_user_email", email);
        localStorage.setItem("shobpai_logged_in", "true");
        return { user: { email, uid: "dev-mock-uid" } };
      }
      throw e;
    }
  };

  const loginWithGoogleHandler = async () => {
    try {
      const res = await fbLoginWithGoogle();
      const email = res.user.email;
      const isAdminUser = checkIsAdmin(email);
      const userRole: Role = isAdminUser ? "ADMIN" : "USER";
      setRole(userRole);
      if (email) {
        localStorage.setItem("shobpai_user_email", email);
      }
      localStorage.setItem("shobpai_role", userRole);
      localStorage.setItem("shobpai_logged_in", "true");
      return res;
    } catch (e: any) {
      if (e?.code?.includes("invalid-api-key") || e?.message?.includes("API key")) {
        const mockRole: Role = "USER";
        setRole(mockRole);
        setUser({
          firebaseUid: "google-dev-uid",
          email: "google.user@example.com",
          displayName: "Google User",
          phoneNumber: null,
          photoURL: null,
          role: mockRole,
        });
        localStorage.setItem("shobpai_role", mockRole);
        localStorage.setItem("shobpai_user_email", "google.user@example.com");
        localStorage.setItem("shobpai_logged_in", "true");
        return { user: { email: "google.user@example.com" } };
      }
      throw e;
    }
  };

  const loginWithFacebookHandler = async () => {
    try {
      const res = await fbLoginWithFacebook();
      const email = res.user.email;
      const isAdminUser = checkIsAdmin(email);
      const userRole: Role = isAdminUser ? "ADMIN" : "USER";
      setRole(userRole);
      if (email) {
        localStorage.setItem("shobpai_user_email", email);
      }
      localStorage.setItem("shobpai_role", userRole);
      localStorage.setItem("shobpai_logged_in", "true");
      return res;
    } catch (e: any) {
      if (e?.code?.includes("invalid-api-key") || e?.message?.includes("API key")) {
        const mockRole: Role = "USER";
        setRole(mockRole);
        setUser({
          firebaseUid: "fb-dev-uid",
          email: "facebook.user@example.com",
          displayName: "Facebook User",
          phoneNumber: null,
          photoURL: null,
          role: mockRole,
        });
        localStorage.setItem("shobpai_role", mockRole);
        localStorage.setItem("shobpai_user_email", "facebook.user@example.com");
        localStorage.setItem("shobpai_logged_in", "true");
        return { user: { email: "facebook.user@example.com" } };
      }
      throw e;
    }
  };

  const setupRecaptchaVerifier = (elementId: string) => {
    return setupRecaptcha(elementId);
  };

  const sendPhoneOtpHandler = async (phoneNumber: string, verifier: RecaptchaVerifier) => {
    return await fbSendPhoneOtp(phoneNumber, verifier);
  };

  const verifyPhoneOtpHandler = async (confirmationResult: ConfirmationResult, otpCode: string) => {
    const res = await fbVerifyPhoneOtp(confirmationResult, otpCode);
    const email = res.user.email;
    const isAdminUser = checkIsAdmin(email);
    const userRole: Role = isAdminUser ? "ADMIN" : "USER";
    setRole(userRole);
    localStorage.setItem("shobpai_logged_in", "true");
    localStorage.setItem("shobpai_role", userRole);
    return res;
  };

  const sendPasswordResetHandler = async (email: string) => {
    await fbResetPasswordEmail(email);
  };

  const confirmPasswordResetHandler = async (oobCode: string, newPass: string) => {
    await fbResetPasswordConfirm(oobCode, newPass);
  };

  const logoutHandler = async () => {
    try {
      await logoutFirebase();
    } catch (err) {
      console.warn("Firebase logout error:", err);
    }
    setFirebaseUser(null);
    setUser(null);
    setToken(null);
    setRole("GUEST");
    localStorage.removeItem("shobpai_logged_in");
    localStorage.removeItem("shobpai_user_email");
    localStorage.removeItem("shobpai_role");
  };

  const setManualRole = (newRole: Role) => {
    setRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
    localStorage.setItem("shobpai_role", newRole);
  };

  const isAdmin = role === "ADMIN" || checkIsAdmin(user?.email) || checkIsAdmin(firebaseUser?.email);

  console.log("user", user);
  console.log("firebaseUser", firebaseUser);
  console.log("role", role);
  console.log("isAdmin", isAdmin);
  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role,
        token,
        loading,
        isAdmin,
        adminEmails: ADMIN_EMAILS,
        loginWithEmail: loginWithEmailHandler,
        registerWithEmail: registerWithEmailHandler,
        loginWithGoogle: loginWithGoogleHandler,
        loginWithFacebook: loginWithFacebookHandler,
        setupRecaptchaVerifier,
        sendPhoneOtp: sendPhoneOtpHandler,
        verifyPhoneOtp: verifyPhoneOtpHandler,
        sendPasswordReset: sendPasswordResetHandler,
        confirmPasswordReset: confirmPasswordResetHandler,
        logout: logoutHandler,
        setManualRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
