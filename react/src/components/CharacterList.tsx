// src\components\CharacterList.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteCharacter } from '../store/characterSlice';

const CharacterList: React.FC = () => {
  const characters = useSelector((state: RootState) => state.character.characters);
  const dispatch = useDispatch();

  const handleDelete = (charId: number) => {
    dispatch(deleteCharacter(charId));
  };

  return (
    <div>
      <h2>Character List</h2>
      <ul>
        {characters.map(char => (
          <li key={char.charId}>
            {char.charName} - {char.charJob} - Level {char.charLevel}
            <button onClick={() => handleDelete(char.charId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;