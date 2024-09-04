// src/components/CharacterCreate.tsx
import React, { useState } from 'react';
import { Character } from '../types';

interface CharacterCreateProps {
  onAddCharacter: (character: Character) => void;
}

const CharacterCreate: React.FC<CharacterCreateProps> = ({ onAddCharacter }) => {
  const [character, setCharacter] = useState<Omit<Character, 'charId'>>({
    charName: '',
    charJob: '',
    charClass: '',
    charLevel: 1600,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCharacter({
      ...character,
      charId: Date.now(),
      charLevel: Number(character.charLevel),
    });
    setCharacter({ charName: '', charJob: '', charClass: '', charLevel: 1600 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="charName"
        value={character.charName}
        onChange={handleChange}
        placeholder="Character Name"
        required
      />
      <input
        type="text"
        name="charJob"
        value={character.charJob}
        onChange={handleChange}
        placeholder="Job"
        required
      />
      <input
        type="text"
        name="charClass"
        value={character.charClass}
        onChange={handleChange}
        placeholder="Class"
        required
      />
      <input
        type="number"
        name="charLevel"
        value={character.charLevel}
        onChange={handleChange}
        placeholder="Level"
        required
      />
      <button type="submit">Create Character</button>
    </form>
  );
};

export default CharacterCreate;