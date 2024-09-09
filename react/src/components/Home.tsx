// src/components/Home.tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Login from './Login';
import RaidList from './RaidList';
import CharacterList from './CharacterList';
import { logout } from '../api';
import { Character } from '../types';

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; key: string } | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (userId: number, userKey: string) => {
    setIsAuthenticated(true);
    setCurrentUser({ id: userId, key: userKey });
  };

  const handleLogout = async () => {
    try {
      if (currentUser?.key !== 'tester') {
        await logout();
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCharacters([]);
    } catch (error) {
      alert('An error occurred during logout. Please try again.');
    }
  };

  const handleCharacterChange = (updatedCharacters: Character[]) => {
    setCharacters(updatedCharacters);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Welcome to Raid Party Organizer</h1>
        <p>Logged in as: {currentUser?.key}</p>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>
      <main style={{ display: 'flex', padding: '20px' }}>
        <div style={{ flex: 2, marginRight: '20px' }}>
          <RaidList characters={characters} />
        </div>
        <div style={{ flex: 1 }}>
          <CharacterList onCharacterChange={handleCharacterChange} />
        </div>
      </main>
    </div>
  );
};

export default Home;