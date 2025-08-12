import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const uid = localStorage.getItem('uid');
    
    if (userRole && userName && uid) {
      const userData = {
        role: userRole,
        name: userName,
        uid: uid
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('uid', userData.uid);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('uid');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};