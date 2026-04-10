import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../database/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // ONLY auth loading

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user ?? null;

      if (!mounted) return;

      setCurrentUser(user);

      // ✅ UNBLOCK UI IMMEDIATELY AFTER AUTH
      setLoading(false);

      // ✅ Fetch profile separately (non-blocking)
      if (user) {
        fetchProfile(user.id);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user ?? null;

        if (!mounted) return;

        setCurrentUser(user);

        if (user) {
          fetchProfile(user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, profile, loading }}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);