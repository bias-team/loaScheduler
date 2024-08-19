import React, { useState } from 'react';

function RaidPopup({ raid, onSave, onClose }) {
  const [name, setName] = useState(raid ? raid.name : '');
  const [date, setDate] = useState(raid ? raid.date : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, date });
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>{raid ? 'Edit Raid' : 'Add New Raid'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Raid Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaidPopup;
