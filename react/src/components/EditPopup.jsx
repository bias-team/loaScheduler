import React, { useState } from 'react';

function EditPopup({ raid, user }) {
  const [raidName, setRaidName] = useState(raid.raid_name);
  const [date, setDate] = useState(raid.date);
  const [time, setTime] = useState(raid.time);

  const handleEditRaid = () => {
    const updatedRaid = {
      raid_id: raid.raid_id,
      raid_name: raidName,
      date,
      time,
      user_id: user
    };
    fetch('/update_raid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRaid)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Raid updated successfully!');
      }
    });
  };

  return (
    <div>
      <h3>Edit Raid</h3>
      <input
        type="text"
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
      <button onClick={handleEditRaid}>Save</button>
    </div>
  );
}

export default EditPopup;
