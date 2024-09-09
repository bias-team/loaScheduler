import React, { useState, useEffect } from "react";
import CharacterCreate from "./CharacterCreate";
import CharacterDetail from "./CharacterDetail";
import { Character } from "../types";
// 플로팅으로 바꿔야함

interface CharacterListProps {
  onCharacterChange: (characters: Character[]) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterChange }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

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
    setTimeout(() => setUpdateMessage(null), 2000); // 2초 후 메시지 제거
  };
  const handleDeleteCharacter = (charId: number) => {
    setCharacters(characters.filter(char => char.charId !== charId));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    charId: number
  ) => {
    e.dataTransfer.setData("text/plain", charId.toString());
  };

  return (
    <div>
      <h2>Character List</h2>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Cancel" : "Create Character"}
      </button>
      {showCreateForm && (
        <CharacterCreate onAddCharacter={handleAddCharacter} />
      )}
      <ul>
        {characters.map(char => (
          <li
            key={char.charId}
            draggable
            onDragStart={e => handleDragStart(e, char.charId)}
            onClick={() => setSelectedCharacter(char.charId)}
          >
            {char.charName} - {char.charJob} - Level {char.charLevel}
            <button onClick={() => handleDeleteCharacter(char.charId)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {updateMessage && <div className="update-message">{updateMessage}</div>}
      {selectedCharacter !== null && (
        <CharacterDetail
          character={
            characters.find(char => char.charId === selectedCharacter)!
          }
          onClose={() => setSelectedCharacter(null)}
          onUpdate={handleUpdateCharacter}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default CharacterList;
