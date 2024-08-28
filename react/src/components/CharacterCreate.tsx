// src\components\CharacterCreate.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCharacter } from '../store/characterSlice';

const CharacterCreate: React.FC = () => {
  const dispatch = useDispatch();
  const [character, setCharacter] = useState({
    charJob: '',
    charName: '',
    charClass: '',
    charLevel: 1600,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCharacter({
      ...character,
      charId: Date.now(), // 임시 ID 생성
      id: 1, // 현재 로그인한 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
      charLevel: Number(character.charLevel),
    }));
    setCharacter({ charJob: '', charName: '', charClass: '', charLevel: 1 });
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