import React, { useState, useEffect } from 'react';
import MemberPopup from './MemberPopup';

function MemberList({ user }) {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    fetch(`/get_characters?user_id=${user}`)
      .then(response => response.json())
      .then(data => setMembers(data.characters));
  }, [user]);

  return (
    <div>
      <h2>Character List</h2>
      <ul>
        {members.map(member => (
          <li key={member.nickname}>
            {member.nickname} - {member.position} - {member.remark}
          </li>
        ))}
      </ul>
      <MemberPopup user={user} />
    </div>
  );
}

export default MemberList;
