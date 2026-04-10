import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../database/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser]       = useState(null);
  const [profile, setProfile]               = useState(null);
  const [loading, setLoading]               = useState(true);   // auth session loading
  const [profileLoading, setProfileLoading] = useState(false);  // profile fetch loading
  const resolvedRef = useRef(false);

  const fetchProfile = async (userId) => {
    if (!userId) return null;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Profile fetch error:", err.message);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Supabase fires INITIAL_SESSION as the first event on every mount/refresh.
    // Using only onAuthStateChange avoids the getSession() race condition that
    // caused the infinite spinner.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);

        if (user) {
          const p = await fetchProfile(user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }

        // Mark auth as resolved on first event only
        if (!resolvedRef.current) {
          resolvedRef.current = true;
          setLoading(false);
        }
      }
    );

    // Safety timeout — unblock UI if Supabase never fires (offline/slow)
    const timeout = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setLoading(false);
      }
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value = { currentUser, profile, loading, profileLoading };

  // Show spinner only while waiting for the auth session (not profile)
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-orange-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
          <p className="text-sm text-orange-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);