import React, { useState } from 'react';
import { Raid, Character } from '../types';

interface RaidListProps {
  characters: Character[];
}

const RaidList: React.FC<RaidListProps> = ({ characters }) => {
  const [raids, setRaids] = useState<Raid[]>([]);

  const handleCreateRaid = () => {
    const newRaid: Raid = {
      id: Date.now(),
      name: `Raid ${raids.length + 1}`,
      partyCount: 1,
      parties: [[]],
    };
    setRaids([...raids, newRaid]);
  };

  const handlePartyCountChange = (raidId: number, count: number) => {
    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        const newParties = Array(count).fill(null).map((_, i) => raid.parties[i] || []);
        return { ...raid, partyCount: count, parties: newParties };
      }
      return raid;
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, raidId: number, partyIndex: number) => {
    e.preventDefault();
    const charId = Number(e.dataTransfer.getData('text'));
    
    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        const newParties = [...raid.parties];
        newParties[partyIndex] = [...newParties[partyIndex], charId];
        return { ...raid, parties: newParties };
      }
      return raid;
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getPartyLayout = (partyCount: number): [number, number] => {
    if (partyCount <= 2) return [1, 2];
    if (partyCount <= 4) return [2, 2];
    return [partyCount/2, 2];
  };

  const getCharacterInfo = (charId: number) => {
    const character = characters.find(char => char.charId === charId);
    return (
      character ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            ({character.charJob}) {character.charName}
          </span>
          <span>
            {character.charLevel}
          </span>
        </div>
      ) : (
        `Character ${charId}`
      )
    );
  };

  return (
    <div>
      <h2>Raids</h2>
      <button onClick={handleCreateRaid}>Create Raid</button>
      {raids.map(raid => (
        <div key={raid.id} className="raid">
          <h3>{raid.name}</h3>
          <select
            value={raid.partyCount}
            onChange={(e) => handlePartyCountChange(raid.id, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map(count => (
              <option key={count} value={count}>{count} {count === 1 ? 'Party' : 'Parties'}</option>
            ))}
          </select>
          <div style={{ display: 'grid', gridTemplateRows: `repeat(${getPartyLayout(raid.partyCount)[0]}, 1fr)`, gridTemplateColumns: `repeat(${getPartyLayout(raid.partyCount)[1]}, 1fr)`, gap: '10px' }}>
            {raid.parties.map((party, partyIndex) => (
              <div
                key={partyIndex}
                className="party"
                onDrop={(e) => handleDrop(e, raid.id, partyIndex)}
                onDragOver={handleDragOver}
                style={{ border: '1px solid #ccc', padding: '10px' }}
              >
                <h4>Party {partyIndex + 1}</h4>
                <div>
                  {party.slice(0, 4).map((charId, index) => (
                    <div key={index} className="party-member">
                      {getCharacterInfo(charId)}
                    </div>
                  ))}
                </div>
                {party.length > 4 && (
                  <div className="reserve-members">
                    <h5>Reserve Members</h5>
                    {party.slice(4).map((charId, index) => (
                      <div key={index} className="reserve-member">
                        {getCharacterInfo(charId)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RaidList;