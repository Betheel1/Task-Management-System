import React, { createContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from the decoded token
  useEffect(() => {
    const decodedUser = decodeToken();
    if (decodedUser) {
      setUser(decodedUser);
      console.log("User", user);
    }
  }, []);

  // Login function (store token and decode user info)
  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decodedUser = decodeToken();
    setUser(decodedUser);
  };

  // Logout function (remove token and reset user state)
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
