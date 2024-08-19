import React, { useState } from 'react';

function EditPopup({ item, onSave, onClose }) {
  const [name, setName] = useState(item ? item.name : '');
  const [date, setDate] = useState(item ? item.date : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, date });
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>{item ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
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

export default EditPopup;
