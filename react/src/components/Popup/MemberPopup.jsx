import React, { useState } from 'react';

function MemberPopup({ member, onSave, onClose }) {
  const [name, setName] = useState(member ? member.name : '');
  const [role, setRole] = useState(member ? member.role : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, role });
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>{member ? 'Edit Character' : 'Add New Character'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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

export default MemberPopup;
