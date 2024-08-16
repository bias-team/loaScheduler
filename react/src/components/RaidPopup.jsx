import React, { useState } from 'react';

function RaidPopup({ user }) {
  const [raidName, setRaidName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleCreateRaid = () => {
    const newRaid = {
      raid_name: raidName,
      date,
      time,
      user_id: user
    };
    fetch('/create_raid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRaid)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Raid created successfully!');
      }
    });
  };

  return (
    <div>
      <h3>Create Raid</h3>
      <input
        type="text"
        placeholder="Raid Name"
        value={raidName}
        onChange={(e) => setRaidName(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={handleCreateRaid}>Create</button>
    </div>
  );
}

export default RaidPopup;
