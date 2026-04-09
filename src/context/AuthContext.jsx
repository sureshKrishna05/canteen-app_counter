import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../database/supabaseClient";
import { getMyProfile } from "../database/supabaseService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);   // role, canteen_id, college_id
  const [loading, setLoading] = useState(true);

  const loadProfile = async (user) => {
    if (!user) { setProfile(null); return; }
    try {
      const p = await getMyProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      await loadProfile(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setCurrentUser(session?.user ?? null);
        await loadProfile(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = { currentUser, profile, loading };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-orange-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);