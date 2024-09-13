import React, { useState } from 'react';
import { Character, CharJob, getCharClassFromJob } from '../types';
import { useUserStore } from '../stores/userStore';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  character: Character;
  onClose: () => void;
  onUpdate: (updatedCharacter: Character) => void;
  onUpdateSuccess: () => void;
}

const CharacterDetail: React.FC<Props> = ({ character, onClose, onUpdate, onUpdateSuccess }) => {
  const { userId } = useUserStore();
  const [editedCharacter, setEditedCharacter] = useState<Character>({...character});
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'charJob') {
      setEditedCharacter(prev => ({
        ...prev,
        [name]: value as CharJob,
      }));
    } else {
      setEditedCharacter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedCharacter);
    onUpdateSuccess();
    onClose();
  };

  const canEdit = character.userId === userId;

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
      backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(33, 150, 243, 0.4)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    closeButton: {
      backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.4)' : 'rgba(255, 87, 34, 0.4)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  const styles = getThemeStyles();

  return (
    <div style={{
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
      ...styles.container
    }}>
      <h2 style={{ marginTop: 0 }}>Character Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="charName" style={{ display: 'block', marginBottom: '5px' }}>Name: </label>
          <input
            id="charName"
            type="text"
            name="charName"
            value={editedCharacter.charName}
            onChange={handleChange}
            disabled={!canEdit}
            style={{ width: '100%', padding: '5px', ...styles.input }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="charJob" style={{ display: 'block', marginBottom: '5px' }}>Job: </label>
          <select
            id="charJob"
            name="charJob"
            value={editedCharacter.charJob}
            onChange={handleChange}
            disabled={!canEdit}
            style={{ width: '100%', padding: '5px', ...styles.input }}
          >
            {Object.values(CharJob).map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Class: </label>
          <span>{getCharClassFromJob(editedCharacter.charJob)}</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="charLevel" style={{ display: 'block', marginBottom: '5px' }}>Level: </label>
          <input
            id="charLevel"
            type="number"
            name="charLevel"
            value={editedCharacter.charLevel}
            onChange={handleChange}
            disabled={!canEdit}
            style={{ width: '100%', padding: '5px', ...styles.input }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {canEdit && <button type="submit" style={{ padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', ...styles.button }}>Update Character</button>}
          <button type="button" onClick={onClose} style={{ padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', ...styles.closeButton }}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default CharacterDetail;