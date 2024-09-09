import React, { useState, useEffect } from 'react';
import { Raid, Character } from '../types';
import { useUserStore } from '../stores/userStore';

interface RaidListProps {
  characters: Character[];
}

const RaidList: React.FC<RaidListProps> = ({ characters }) => {
  const { userKey } = useUserStore();
  const [raids, setRaids] = useState<Raid[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingRaidId, setEditingRaidId] = useState<number | null>(null);

  useEffect(() => {
    // 여기서 백엔드에서 레이드 목록을 가져오는 API를 호출할 수 있습니다.
    // 지금은 로컬 상태만 사용합니다.
  }, []);

  const handleCreateRaid = () => {
    const newRaid: Raid = {
      id: Date.now(),
      name: `Raid ${raids.length + 1}`,
      partyCount: 1,
      parties: [[]],
      raidCreatorKey: userKey,
    };
    setRaids([...raids, newRaid]);
    setHasChanges(true);
  };

  const isRaidCreator = (raid: Raid) => raid.raidCreatorKey === userKey;

  const handlePartyCountChange = (raidId: number, count: number) => {
    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        const newParties = Array(count).fill(null).map((_, i) => raid.parties[i] || []);
        return { ...raid, partyCount: count, parties: newParties };
      }
      return raid;
    }));
    setHasChanges(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, raidId: number, partyIndex: number) => {
    e.preventDefault();
    const charId = Number(e.dataTransfer.getData('text'));

    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        // 현재 레이드 내에서 캐릭터가 이미 존재하는지 확인
        const isCharacterAlreadyInRaid = raid.parties.some(party => party.includes(charId));
        
        if (isCharacterAlreadyInRaid) {
          alert('This character is already in this raid.');
          return raid;
        }

        const newParties = [...raid.parties];
        newParties[partyIndex] = [...newParties[partyIndex], charId];
        return { ...raid, parties: newParties };
      }
      return raid;
    }));
    setHasChanges(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, charId: number) => {
    e.dataTransfer.setData('text/plain', charId.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveCharacter = (raidId: number, partyIndex: number, charId: number) => {
    setRaids(raids.map(raid => {
      if (raid.id === raidId) {
        const newParties = raid.parties.map((party, index) => 
          index === partyIndex ? party.filter(id => id !== charId) : party
        );
        return { ...raid, parties: newParties };
      }
      return raid;
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // 여기서 백엔드 API를 호출하여 변경사항을 저장합니다.
    console.log('Saving changes to backend:', raids);
    setHasChanges(false);
    // 실제로는 여기서 axios나 fetch를 사용하여 백엔드 API를 호출해야 합니다.
  };

  const handleDeleteRaid = (raidId: number) => {
    setRaids(raids.filter(raid => raid.id !== raidId));
    setHasChanges(true);
  };

  const handleEditRaidName = (raidId: number, newName: string) => {
    setRaids(raids.map(raid => 
      raid.id === raidId ? { ...raid, name: newName } : raid
    ));
    setEditingRaidId(null);
    setHasChanges(true);
  };

  const getCharacterInfo = (charId: number) => {
    const character = characters.find(char => char.charId === charId);
    return character ? `(${character.charJob}) ${character.charName} Lv.${character.charLevel}` : `Character ${charId}`;
  };


  return (
    <div>
      <h2>Raids</h2>
      <button onClick={handleCreateRaid}>Create Raid</button>
      {hasChanges && <button onClick={handleSave}>Save Changes</button>}
      {raids.map(raid => (
        <div key={raid.id} className="raid">
          {editingRaidId === raid.id ? (
            <input 
              value={raid.name}
              onChange={(e) => handleEditRaidName(raid.id, e.target.value)}
              onBlur={() => setEditingRaidId(null)}
            />
          ) : (
            <h3 onClick={() => isRaidCreator(raid) && setEditingRaidId(raid.id)}>{raid.name}</h3>
          )}
          {isRaidCreator(raid) && (
            <>
              <button onClick={() => handleDeleteRaid(raid.id)}>Delete Raid</button>
              <select
                value={raid.partyCount}
                onChange={(e) => handlePartyCountChange(raid.id, Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(count => (
                  <option key={count} value={count}>{count} {count === 1 ? 'Party' : 'Parties'}</option>
                ))}
              </select>
            </>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {raid.parties.map((party, partyIndex) => (
              <div
                key={partyIndex}
                className="party"
                onDrop={(e) => handleDrop(e, raid.id, partyIndex)}
                onDragOver={handleDragOver}
                style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}
              >
                <h4>Party {partyIndex + 1}</h4>
                {party.map((charId) => {
                  const character = characters.find(char => char.charId === charId);
                  return (
                    <div 
                      key={charId} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, charId)}
                      style={{ margin: '5px', padding: '5px', border: '1px solid #ddd' }}
                    >
                      {getCharacterInfo(charId)}
                      {(isRaidCreator(raid) || character?.userKey === userKey) && (
                        <button onClick={() => handleRemoveCharacter(raid.id, partyIndex, charId)}>Remove</button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RaidList;