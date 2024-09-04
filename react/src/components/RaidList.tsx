// src/components/RaidList.tsx
import React, { useState } from 'react';
import { Raid } from '../types';

const RaidList: React.FC = () => {
  const [raids, setRaids] = useState<Raid[]>([]);

  const handleCreateRaid = () => {
    const newRaid: Raid = {
      id: Date.now(),
      name: `Raid ${raids.length + 1}`,
      maxParties: 2,
      parties: Array(2).fill([]).map(() => Array(4).fill(null)),
    };
    setRaids([...raids, newRaid]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, raidId: number, partyIndex: number, slotIndex: number) => {
    e.preventDefault();
    const charId = Number(e.dataTransfer.getData('text'));
    
    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        const newParties = [...raid.parties];
        newParties[partyIndex][slotIndex] = charId;
        return { ...raid, parties: newParties };
      }
      return raid;
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Raids</h2>
      <button onClick={handleCreateRaid}>Create Raid</button>
      {raids.map(raid => (
        <div key={raid.id} className="raid">
          <h3>{raid.name}</h3>
          {raid.parties.map((party, partyIndex) => (
            <div key={partyIndex} className="party">
              {party.map((charId, slotIndex) => (
                <div
                  key={slotIndex}
                  className="party-slot"
                  onDrop={(e) => handleDrop(e, raid.id, partyIndex, slotIndex)}
                  onDragOver={handleDragOver}
                >
                  {charId ? `Character ${charId}` : 'Empty'}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RaidList;