// src/components/Home.tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Login from './Login';
import CharacterList from './CharacterList';
import RaidList from './RaidList';

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentMember, setCurrentMember] = useState<{ id: number; username: string } | null>(null);
  const { toggleTheme } = useTheme();

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentMember({ id: 1, username });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentMember(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <header>
        <h1>Welcome to Raid Party Organizer</h1>
        <p>Logged in as: {currentMember?.username}</p>
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