import React, { useState, useEffect } from 'react';
import { Raid, Character, RaidType, getDefaultPartyCount } from '../types';
import { useUserStore } from '../stores/userStore';

interface RaidListProps {
  characters: Character[];
}

const RaidList: React.FC<RaidListProps> = ({ characters }) => {
  const { userId } = useUserStore();
  const [raids, setRaids] = useState<Raid[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingRaidId, setEditingRaidId] = useState<number | null>(null);
  const [editingRaidName, setEditingRaidName] = useState('');
  const [editingRaidType, setEditingRaidType] = useState<RaidType>(RaidType.BEAST);
  const [newRaidName, setNewRaidName] = useState('');
  const [newRaidType, setNewRaidType] = useState<RaidType>(RaidType.BEAST);

  useEffect(() => {
    // 여기서 백엔드에서 레이드 목록을 가져오는 API를 호출할 수 있습니다.
    // 지금은 로컬 상태만 사용합니다.
  }, []);

  const handleCreateRaid = () => {
    const partyCount = getDefaultPartyCount(newRaidType);
    const newRaid: Raid = {
      id: Date.now(),
      name: newRaidName || `${newRaidType} Raid`,
      type: newRaidType,
      partyCount: partyCount,
      parties: Array(partyCount).fill([]),
      raidCreatorId: userId,
    };
    setRaids([...raids, newRaid]);
    setHasChanges(true);
    setNewRaidName('');
    setNewRaidType(RaidType.BEAST);
  };

  const isRaidCreator = (raid: Raid) => raid.raidCreatorId === userId;

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

  const handleStartEditingRaid = (raid: Raid) => {
    setEditingRaidId(raid.id);
    setEditingRaidName(raid.name);
    setEditingRaidType(raid.type);
  };

  const handleEditRaidNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingRaidName(e.target.value);
  };

  const handleEditRaidTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingRaidType(e.target.value as RaidType);
  };

  const handleEditRaidSubmit = () => {
    if (editingRaidId !== null) {
      setRaids(raids.map(raid => {
        if (raid.id === editingRaidId) {
          const newPartyCount = getDefaultPartyCount(editingRaidType);
          const newParties = Array(newPartyCount).fill([]).map((_, i) => raid.parties[i] || []);
          return { 
            ...raid, 
            name: editingRaidName, 
            type: editingRaidType,
            partyCount: newPartyCount,
            parties: newParties
          };
        }
        return raid;
      }));
      setEditingRaidId(null);
      setHasChanges(true);
    }
  };

  const getCharacterInfo = (charId: number) => {
    const character = characters.find(char => char.charId === charId);
    return character ? `(${character.charJob}) ${character.charName} Lv.${character.charLevel}` : `Character ${charId}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Raids</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newRaidName}
          onChange={(e) => setNewRaidName(e.target.value)}
          placeholder="New Raid Name"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select
          value={newRaidType}
          onChange={(e) => setNewRaidType(e.target.value as RaidType)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          {Object.values(RaidType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={handleCreateRaid} style={{ padding: '5px 10px' }}>Create Raid</button>
      </div>
      {hasChanges && <button onClick={handleSave} style={{ marginBottom: '20px', padding: '5px 10px' }}>Save Changes</button>}
      {raids.map(raid => (
        <div key={raid.id} style={{
          background: 'rgba(200, 200, 200, 0.1)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
          {editingRaidId === raid.id ? (
            <form onSubmit={(e) => { e.preventDefault(); handleEditRaidSubmit(); }} style={{ marginBottom: '10px' }}>
              <input 
                value={editingRaidName}
                onChange={handleEditRaidNameChange}
                placeholder="입력 후 엔터를 눌러주세요"
                style={{ marginRight: '10px', padding: '5px' }}
              />
              <select
                value={editingRaidType}
                onChange={handleEditRaidTypeChange}
                style={{ marginRight: '10px', padding: '5px' }}
              >
                {Object.values(RaidType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button type="submit" style={{ marginRight: '10px', padding: '5px 10px' }}>Save</button>
              <button type="button" onClick={() => setEditingRaidId(null)} style={{ padding: '5px 10px' }}>Cancel</button>
            </form>
          ) : (
            <h3 onClick={() => isRaidCreator(raid) && handleStartEditingRaid(raid)} style={{ marginBottom: '10px', cursor: 'pointer' }}>
              {raid.name} ({raid.type})
            </h3>
          )}
          {isRaidCreator(raid) && (
            <button onClick={() => handleDeleteRaid(raid.id)} style={{ marginBottom: '10px', padding: '5px 10px' }}>Delete Raid</button>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {raid.parties.map((party, partyIndex) => (
              <div
                key={partyIndex}
                className="party"
                onDrop={(e) => handleDrop(e, raid.id, partyIndex)}
                onDragOver={handleDragOver}
                style={{ 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  padding: '10px', 
                  background: 'rgba(16, 16, 16, 0.1)',
                  minWidth: '200px'
                }}
              >
                <h4 style={{ marginTop: '0', marginBottom: '10px' }}>Party {partyIndex + 1}</h4>
                {party.map((charId) => {
                  const character = characters.find(char => char.charId === charId);
                  return (
                    <div 
                      key={charId} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, charId)}
                      style={{ 
                        margin: '5px 0', 
                        padding: '5px', 
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        background: 'rgba(16, 16, 16, 0.4)'
                      }}
                    >
                      {getCharacterInfo(charId)}
                      {(isRaidCreator(raid) || character?.userId === userId) && (
                        <button onClick={() => handleRemoveCharacter(raid.id, partyIndex, charId)} style={{ marginLeft: '5px', padding: '2px 5px' }}>Remove</button>
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