import React, { useState } from 'react';
import { Character, CharJob, CharClass } from '../types';

interface Props {
  character: Character;
  onClose: () => void;
  onUpdate: (updatedCharacter: Character) => void;
  onUpdateSuccess: () => void;
}

const CharacterDetail: React.FC<Props> = ({ character, onClose, onUpdate, onUpdateSuccess }) => {
  const [newLevel, setNewLevel] = useState(character.charLevel.toString());
  const [newJob, setNewJob] = useState(character.charJob);
  const [newClass, setNewClass] = useState(character.charClass);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLevel(e.target.value);
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewJob(e.target.value as CharJob);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewClass(e.target.value as CharClass);
  };

  const handleUpdate = () => {
    const updatedLevel = parseInt(newLevel, 10);
    if (!isNaN(updatedLevel) && updatedLevel > 0) {
      const updatedCharacter = { 
        ...character, 
        charLevel: updatedLevel,
        charJob: newJob,
        charClass: newClass
      };
      onUpdate(updatedCharacter);
      onUpdateSuccess();
      onClose();
    } else {
      alert('Please enter a valid level (positive integer)');
    }
  };

  return (
    <div>
      <h2>Character Details</h2>
      <p>Name: {character.charName}</p>
      <div>
        <label htmlFor="jobSelect">Job: </label>
        <select id="jobSelect" value={newJob} onChange={handleJobChange}>
          {Object.values(CharJob).map((job) => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="classSelect">Class: </label>
        <select id="classSelect" value={newClass} onChange={handleClassChange}>
          {Object.values(CharClass).map((charClass) => (
            <option key={charClass} value={charClass}>{charClass}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="levelInput">Level: </label>
        <input
          id="levelInput"
          type="number"
          value={newLevel}
          onChange={handleLevelChange}
          min="1"
        />
      </div>
      <button onClick={handleUpdate}>Update Character</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CharacterDetail;