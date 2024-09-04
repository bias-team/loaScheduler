// src/components/CharacterList.tsx
import React, { useState } from 'react';
import CharacterCreate from './CharacterCreate';
import CharacterDetail from './CharacterDetail';
import { Character } from '../types';

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const handleAddCharacter = (character: Character) => {
    setCharacters([...characters, character]);
    setShowCreateForm(false);
  };

  const handleDeleteCharacter = (charId: number) => {
    setCharacters(characters.filter(char => char.charId !== charId));
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, charId: number) => {
    e.dataTransfer.setData('text/plain', charId.toString());
  };

  return (
    <div>
      <h2>Character List</h2>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create Character'}
      </button>
      {showCreateForm && <CharacterCreate onAddCharacter={handleAddCharacter} />}
      <ul>
        {characters.map(char => (
          <li
            key={char.charId}
            draggable
            onDragStart={(e) => handleDragStart(e, char.charId)}
            onClick={() => setSelectedCharacter(char.charId)}
          >
            {char.charName} - {char.charJob} - Level {char.charLevel}
            <button onClick={() => handleDeleteCharacter(char.charId)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedCharacter !== null && (
        <CharacterDetail
          charId={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default CharacterList;