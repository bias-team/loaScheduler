// src/components/Home.tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Login from './Login';
import CharacterList from './CharacterList';
import RaidList from './RaidList';
import { logout } from '../api';

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; key: string } | null>(null);
  const { toggleTheme } = useTheme();

  const handleLogin = (userId: number) => {
    setIsAuthenticated(true);
    setCurrentUser({ id: userId, key: 'User' }); // 실제 사용자 키를 가져오는 로직이 필요할 수 있습니다
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      alert('An error occurred during logout. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <header>
        <h1>Welcome to Raid Party Organizer</h1>
        <p>Logged in as: {currentUser?.key}</p>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>
      <main style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <section className="raid-section" style={{ flex: 1, marginRight: '20px' }}>
          <RaidList />
        </section>
        <section className="character-section" style={{ flex: 1 }}>
          <CharacterList />
        </section>
      </main>
    </>
  );
};

export default Home;