// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import supabase from "../services/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserInfo(session.user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSession(data);
      setUserInfo(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error: ", error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut(); // Logout via Supabase
      setSession(null); // Clear session on logout
      return { success: true };
    } catch (error) {
      console.error("Logout error: ", error.message);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (session) {
      router.replace("(app)/HomeScreen"); // Redirect to HomeScreen if session is available
    } else {
      router.replace("LoginScreen"); // Redirect to LoginScreen if session is not available
    }
  }, [session, router]);

  return (
    <AuthContext.Provider value={{ session, login, logout, userInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
