import React, { useState, useEffect } from 'react';
// import { fetchRaidList, addRaid, updateRaid, deleteRaid } from '../services/api';
import RaidPopup from './Popup/RaidPopup';

function RaidTable() {
  const [raids, setRaids] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentRaid, setCurrentRaid] = useState(null);

  useEffect(() => {
    async function loadRaids() {
      try {
        const response = await fetch('/raid.json'); // Mock 데이터 경로
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const raidData = await response.json();
        setRaids(raidData.raids || []);
      } catch (error) {
        console.error('Failed to load raids:', error);
      }
    }
    loadRaids();
  }, []);

  const handleAddRaid = () => {
    setCurrentRaid(null);
    setShowPopup(true);
  };

  const handleEditRaid = (raidId) => {
    const raid = raids.find((r) => r.id === raidId);
    setCurrentRaid(raid);
    setShowPopup(true);
  };

  const handleDeleteRaid = async (raidId) => {
    setRaids(raids.filter((raid) => raid.id !== raidId));
  };

  const handleSaveRaid = async (raidData) => {
    if (currentRaid) {
      setRaids(raids.map((raid) => (raid.id === currentRaid.id ? raidData : raid)));
    } else {
      setRaids([...raids, raidData]);
    }
    setShowPopup(false);
  };

  return (
    <div className="raid-table">
      <h2>Raid List</h2>
      <button onClick={handleAddRaid}>Add Raid</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Raid Name</th>
            <th>Raid</th>
            <th>Date</th>
            <th>Time</th>
            <th>Max Size</th>
            <th>Participants</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {raids.map((raid) => (
            <tr key={raid.id}>
              <td>{raid.id}</td>
              <td>{raid.raid_name}</td>
              <td>{raid.raid}</td>
              <td>{raid.date}</td>
              <td>{raid.time}</td>
              <td>{raid.raid_max_size}</td>
              <td>
                {raid.participants.map((participant) => (
                  <div key={participant.id}>
                    {participant.nickname} ({participant.role})
                  </div>
                ))}
              </td>
              <td>{raid.status}</td>
              <td>
                <button onClick={() => handleEditRaid(raid.id)}>Edit</button>
                <button onClick={() => handleDeleteRaid(raid.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <RaidPopup
          raid={currentRaid}
          onSave={handleSaveRaid}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default RaidTable;
