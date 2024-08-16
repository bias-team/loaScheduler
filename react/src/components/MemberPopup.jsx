import React, { useState } from 'react';

function MemberPopup({ user }) {
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('');
  const [remark, setRemark] = useState('');

  const handleAddMember = () => {
    const newMember = {
      user_id: user,
      nickname,
      position,
      remark
    };
    fetch('/add_character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Character added successfully!');
      }
    });
  };

  return (
    <div>
      <h3>Add Character</h3>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <input
        type="text"
        placeholder="Remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <button onClick={handleAddMember}>Add</button>
    </div>
  );
}

export default MemberPopup;
