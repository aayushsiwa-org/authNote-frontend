import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  };

  return { token, logout };
}
