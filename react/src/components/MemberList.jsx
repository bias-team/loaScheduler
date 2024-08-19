import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
// import { fetchMemberList, addMember, updateMember, deleteMember } from '../services/api';
import MemberPopup from './Popup/MemberPopup';

function Member({ member }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MEMBER',
    item: { id: member.id, name: member.name, role: member.role },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {member.name} - {member.role}
      <button onClick={() => handleEditMember(member.id)}>Edit</button>
      <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
    </li>
  );
}

function MemberList() {
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        // Mock 데이터를 로드하는 부분
        const response = await fetch('/member.json'); // Mock 데이터 경로
        // 추후 실제 API 엔드포인트로 변경
        // const response = await fetch('/api/members'); 

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const memberData = await response.json();
        setMembers(memberData.members || []);
      } catch (error) {
        console.error('Failed to load members:', error);
      }
    }
    loadMembers();
  }, []);

  const handleAddMember = () => {
    setCurrentMember(null);
    setShowPopup(true);
  };

  const handleEditMember = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    setCurrentMember(member);
    setShowPopup(true);
  };

  const handleDeleteMember = async (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleSaveMember = async (memberData) => {
    if (currentMember) {
      setMembers(members.map((member) => (member.id === currentMember.id ? memberData : member)));
    } else {
      setMembers([...members, memberData]);
    }
    setShowPopup(false);
  };

  return (
    <div className="member-list">
      <h2>Character List</h2>
      <button onClick={handleAddMember}>Add Character</button>
      <ul>
        {members.length > 0 ? (
          members.map((member) => (
            <Member key={member.id} member={member} />
          ))
        ) : (
          <li>No members found</li>
        )}
      </ul>
      {showPopup && (
        <MemberPopup
          member={currentMember}
          onSave={handleSaveMember}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default MemberList;
