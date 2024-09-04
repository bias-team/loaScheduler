// src\components\CharacterDetail.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Character } from '../store/characterSlice';

interface Props {
  charId: number;
  onClose: () => void;
}

const CharacterDetail: React.FC<Props> = ({ charId, onClose }) => {
  const character = useSelector((state: RootState) => 
    state.character.characters.find((char: Character) => char.charId === charId)
  );

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div>
      <h2>Character Details</h2>
      <p>Name: {character.charName}</p>
      <p>Job: {character.charJob}</p>
      <p>Class: {character.charClass}</p>
      <p>Level: {character.charLevel}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CharacterDetail;