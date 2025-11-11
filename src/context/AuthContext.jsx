import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database/firebase";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to check auth status

  useEffect(() => {
    // This is the Firebase listener for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // The value to be passed to consumers
  const value = {
    currentUser,
    loading,
  };

  // Show a loading spinner (or just nothing) while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};