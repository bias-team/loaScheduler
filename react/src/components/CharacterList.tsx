// src/components/CharacterList.tsx
import React, { useState, useEffect } from "react";
import { useDrag } from 'react-dnd'; // 추가: react-dnd import
import CharacterCreate from "./CharacterCreate";
import CharacterDetail from "./CharacterDetail";
import { Character } from "../types";
import { useTheme } from "../contexts/ThemeContext";

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

  // 변경: HTML5 Drag and Drop API 대신 react-dnd 사용
  const DraggableCharacter: React.FC<{ character: Character }> = ({ character }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'CHARACTER',
      item: { id: character.charId },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          ...styles.characterItem,
        }}
        onClick={() => setSelectedCharacter(character.charId)}
      >
        <span>
          {character.charName} - {character.charJob} - Level {character.charLevel}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCharacter(character.charId);
          }}
          style={{
            float: "right",
            border: "none",
            borderRadius: "3px",
            padding: "2px 5px",
            cursor: "pointer",
            ...styles.deleteButton,
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getThemeStyles = () => ({
    container: {
      backgroundColor:
        theme === "dark" ? "rgba(32, 32, 32, 0.8)" : "rgba(240, 240, 240, 0.8)",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    characterItem: {
      backgroundColor:
        theme === "dark" ? "rgba(48, 48, 48, 0.8)" : "rgba(255, 255, 255, 0.8)",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    button: {
      backgroundColor:
        theme === "dark" ? "rgba(76, 175, 80, 0.4)" : "rgba(33, 150, 243, 0.4)",
      color: "#ffffff",
    },
    deleteButton: {
      backgroundColor:
        theme === "dark" ? "rgba(244, 67, 54, 0.4)" : "rgba(255, 87, 34, 0.4)",
      color: "#ffffff",
    },
  });

  const styles = getThemeStyles();

  return (
    <div
      style={{
        position: "fixed",
        top: "80px", // header의 높이에 따라 조정
        right: "20px",
        width: isCollapsed ? "50px" : "250px", // 접혔을 때와 펼쳤을 때의 너비 조정
        maxHeight: "calc(100vh - 100px)", // viewport 높이에서 상단 여백을 뺀 값
        overflowY: "auto",
        borderRadius: "10px",
        padding: isCollapsed ? "10px" : "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-out",
        zIndex: 1000, // 다른 요소들 위에 표시되도록 함
        ...styles.container,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {!isCollapsed && <h2 style={{ margin: 0 }}>Character List</h2>}
        <button
          onClick={toggleCollapse}
          style={{
            background: "none",
            border: "none",
            color: styles.container.color,
            cursor: "pointer",
          }}
        >
          {isCollapsed ? "캐릭터" : "◀"}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              marginBottom: "10px",
              padding: "5px 10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              ...styles.button,
            }}
          >
            {showCreateForm ? "Cancel" : "Create Character"}
          </button>
          {showCreateForm && (
            <CharacterCreate onAddCharacter={handleAddCharacter} />
          )}
          <div>
            {characters.map(char => (
              <DraggableCharacter key={char.charId} character={char} />
            ))}
          </div>
          {updateMessage && (
            <div
              className="update-message"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              {updateMessage}
            </div>
          )}
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
        </>
      )}
    </div>
  );
};

export default CharacterList;