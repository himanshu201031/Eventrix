import React from 'react';
export const AuthContext = React.createContext({
  isAuthenticated: false,
  user: null,
});


export const AuthProvider = ({ children }) => {

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }
   const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

    return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};