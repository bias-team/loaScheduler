import React, { useState } from 'react';
import { Character, CharJob } from '../types';
import { useUserStore } from '../stores/userStore';
import { useTheme } from '../contexts/ThemeContext';

interface CharacterCreateProps {
  onAddCharacter: (character: Character) => void;
}

const CharacterCreate: React.FC<CharacterCreateProps> = ({ onAddCharacter }) => {
  const { userId } = useUserStore();
  const { theme } = useTheme();
  const [character, setCharacter] = useState<Omit<Character, 'charId'>>({
    charName: '',
    charJob: CharJob.DESTROYER,
    charLevel: 1600,
    userId: userId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCharacter({
      ...character,
      charId: Date.now(),
      charLevel: Number(character.charLevel),
      userId,
    });
    setCharacter({ 
      charName: '', 
      charJob: CharJob.DESTROYER,
      charLevel: 1600,
      userId: userId,
    });
  };

  const getThemeStyles = () => ({
    container: {
      backgroundColor: theme === 'dark' ? 'rgba(32, 32, 32, 0.8)' : 'rgba(240, 240, 240, 0.8)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    input: {
      backgroundColor: theme === 'dark' ? 'rgba(66, 66, 66, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
    },
    button: {
      backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(33, 150, 243, 0.6)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  const styles = getThemeStyles();

  return (
    <form onSubmit={handleSubmit} style={{
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      ...styles.container
    }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          name="charName"
          value={character.charName}
          onChange={handleChange}
          placeholder="Character Name"
          required
          style={{ width: '100%', padding: '5px', ...styles.input }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <select
          name="charJob"
          value={character.charJob}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '5px', ...styles.input }}
        >
          {Object.values(CharJob).map((job) => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          name="charLevel"
          value={character.charLevel}
          onChange={handleChange}
          placeholder="Level"
          required
          min="1"
          style={{ width: '100%', padding: '5px', ...styles.input }}
        />
      </div>
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          ...styles.button
        }}
      >
        Create Character
      </button>
    </form>
  );
};

export default CharacterCreate;