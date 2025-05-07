import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("access_token", token);
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
