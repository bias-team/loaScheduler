import React, { useState, useEffect } from "react";
import CharacterCreate from "./CharacterCreate";
import CharacterDetail from "./CharacterDetail";
import { Character } from "../types";
import { useTheme } from '../contexts/ThemeContext';

interface CharacterListProps {
  onCharacterChange: (characters: Character[]) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterChange }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCharacterChange(characters);
  }, [characters, onCharacterChange]);

  const handleAddCharacter = (character: Character) => {
    const newCharacter = { ...character, charId: Date.now() };
    setCharacters([...characters, newCharacter]);
    setShowCreateForm(false);
  };

  const handleUpdateCharacter = (updatedCharacter: Character) => {
    setCharacters(
      characters.map(char =>
        char.charId === updatedCharacter.charId ? updatedCharacter : char
      )
    );
  };

  const handleUpdateSuccess = () => {
    setUpdateMessage("Character updated successfully!");
    setTimeout(() => setUpdateMessage(null), 2000);
  };

  const handleDeleteCharacter = (charId: number) => {
    setCharacters(characters.filter(char => char.charId !== charId));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, charId: number) => {
    e.dataTransfer.setData("text/plain", charId.toString());
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getThemeStyles = () => ({
    container: {
      backgroundColor: theme === 'dark' ? 'rgba(32, 32, 32, 0.8)' : 'rgba(240, 240, 240, 0.8)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    characterItem: {
      backgroundColor: theme === 'dark' ? 'rgba(48, 48, 48, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    button: {
      backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(33, 150, 243, 0.4)',
      color: '#ffffff',
    },
    deleteButton: {
      backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.4)' : 'rgba(255, 87, 34, 0.4)',
      color: '#ffffff',
    },
  });

  const styles = getThemeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: isCollapsed ? '50px' : '300px',
      maxHeight: '80vh',
      overflowY: 'auto',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'width 0.3s ease-in-out',
      ...styles.container
    }}>
      <h2 style={{ marginTop: 0 }}>Character List</h2>
      <button 
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          marginBottom: '10px',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          ...styles.button
        }}
      >
        {showCreateForm ? "Cancel" : "Create Character"}
      </button>
      {showCreateForm && (
        <CharacterCreate onAddCharacter={handleAddCharacter} />
      )}
      <div>
        {characters.map(char => (
          <div
            key={char.charId}
            draggable
            onDragStart={e => handleDragStart(e, char.charId)}
            onClick={() => setSelectedCharacter(char.charId)}
            style={{
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              ...styles.characterItem
            }}
          >
            <span>{char.charName} - {char.charJob} - Level {char.charLevel}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCharacter(char.charId);
              }}
              style={{
                float: 'right',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 5px',
                cursor: 'pointer',
                ...styles.deleteButton
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {updateMessage && (
        <div 
          className="update-message"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          {updateMessage}
        </div>
      )}
      {selectedCharacter !== null && (
        <CharacterDetail
          character={characters.find(char => char.charId === selectedCharacter)!}
          onClose={() => setSelectedCharacter(null)}
          onUpdate={handleUpdateCharacter}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default CharacterList;