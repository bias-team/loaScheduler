import React, { useState } from 'react';
import { Character, CharJob } from '../types';
import { useUserStore } from '../stores/userStore';

interface CharacterCreateProps {
  onAddCharacter: (character: Character) => void;
}

const CharacterCreate: React.FC<CharacterCreateProps> = ({ onAddCharacter }) => {
  const { userKey } = useUserStore();
  const [character, setCharacter] = useState<Omit<Character, 'charId'>>({
    charName: '',
    charJob: CharJob.DESTROYER,
    charLevel: 1600,
    userKey: userKey,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCharacter({
      ...character,
      charId: Date.now(),
      charLevel: Number(character.charLevel),
      userKey,
    });
    setCharacter({ 
      charName: '', 
      charJob: CharJob.DESTROYER,
      charLevel: 1600,
      userKey: userKey,
    });
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
      <select
        name="charJob"
        value={character.charJob}
        onChange={handleChange}
        required
      >
        {Object.values(CharJob).map((job) => (
          <option key={job} value={job}>{job}</option>
        ))}
      </select>
      <input
        type="number"
        name="charLevel"
        value={character.charLevel}
        onChange={handleChange}
        placeholder="Level"
        required
        min="1"
      />
      <button type="submit">Create Character</button>
    </form>
  );
};

export default CharacterCreate;