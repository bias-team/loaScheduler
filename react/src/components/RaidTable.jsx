import React, { useState, useEffect } from 'react';
import RaidPopup from './RaidPopup';
import EditPopup from './EditPopup';

function RaidTable({ user }) {
  const [raids, setRaids] = useState([]);
  const [selectedRaid, setSelectedRaid] = useState(null);

  useEffect(() => {
    fetch('/get_raids')
      .then(response => response.json())
      .then(data => setRaids(data.raids));
  }, []);

  const handleAddRaid = () => {
    setSelectedRaid(null);
  };

  const handleEditRaid = (raid) => {
    setSelectedRaid(raid);
  };

  return (
    <div>
      <h2>Raid List</h2>
      <button onClick={handleAddRaid}>Add Raid</button>
      <ul>
        {raids.map(raid => (
          <li key={raid.raid_id}>
            {raid.raid_name} - {raid.date} - {raid.time}
            <button onClick={() => handleEditRaid(raid)}>Edit</button>
          </li>
        ))}
      </ul>
      {selectedRaid ? (
        <EditPopup raid={selectedRaid} user={user} />
      ) : (
        <RaidPopup user={user} />
      )}
    </div>
  );
}

export default RaidTable;
