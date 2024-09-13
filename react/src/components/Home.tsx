// src/components/Home.tsx
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const backend = isMobile ? TouchBackend : HTML5Backend;

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
      <header style={{padding: '0.2em'}}>
        <h1>Welcome to Raid Party Organizer</h1>
        <p>Logged in as: {currentUser?.key}</p>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>
      <DndProvider backend={backend}>
        <main style={{ display: 'flex', padding: '20px', position: 'relative' }}>
          <div style={{ flex: 1, width: '100%' }}>
            <RaidList characters={characters} />
          </div>
          <CharacterList onCharacterChange={handleCharacterChange} />
        </main>
      </DndProvider>
    </div>
  );
};

export default Home;