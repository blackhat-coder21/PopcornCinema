import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';
import { ProfilePage } from './pages/ProfilePage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { useThemeStore } from './store/theme-store';
import { useMovieStore } from './store/movie-store';
import { useUserStore } from './store/user-store';
import { mockMovies, mockUsers } from './data/mock-data';

function App() {
  const { theme } = useThemeStore();
  const { loadMovies } = useMovieStore();
  const { login } = useUserStore();
  
  // Set up theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Load initial data
  useEffect(() => {
    // Load mock data
    loadMovies(mockMovies);
    
    // Auto-login with first user for demo purposes
    login(mockUsers[0]);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/rooms" element={<Layout><RoomPage /></Layout>} />
        <Route path="/rooms/:roomId" element={<Layout><RoomPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/library" element={<Layout><LibraryPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;