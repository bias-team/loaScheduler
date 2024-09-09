import React, { useState } from 'react';
import { Character, CharJob, getCharClassFromJob } from '../types';
import { useUserStore } from '../stores/userStore';

interface Props {
  character: Character;
  onClose: () => void;
  onUpdate: (updatedCharacter: Character) => void;
  onUpdateSuccess: () => void;  // 새로 추가된 prop
}

const CharacterDetail: React.FC<Props> = ({ character, onClose, onUpdate, onUpdateSuccess }) => {
  const { userKey } = useUserStore();
  const [editedCharacter, setEditedCharacter] = useState<Character>({...character});

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
    onUpdateSuccess();  // 업데이트 성공 시 호출
    onClose();
  };

  const canEdit = character.userKey === userKey;

  return (
    <div>
      <h2>Character Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="charName">Name: </label>
          <input
            id="charName"
            type="text"
            name="charName"
            value={editedCharacter.charName}
            onChange={handleChange}
            disabled={!canEdit}
          />
        </div>
        <div>
          <label htmlFor="charJob">Job: </label>
          <select
            id="charJob"
            name="charJob"
            value={editedCharacter.charJob}
            onChange={handleChange}
            disabled={!canEdit}
          >
            {Object.values(CharJob).map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Class: </label>
          <span>{getCharClassFromJob(editedCharacter.charJob)}</span>
        </div>
        <div>
          <label htmlFor="charLevel">Level: </label>
          <input
            id="charLevel"
            type="number"
            name="charLevel"
            value={editedCharacter.charLevel}
            onChange={handleChange}
            disabled={!canEdit}
          />
        </div>
        {canEdit && <button type="submit">Update Character</button>}
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default CharacterDetail;