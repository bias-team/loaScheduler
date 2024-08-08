import React from "react";
import { useDrag } from "react-dnd";

function MemberList({ members, onEditMember, onDeleteMember, onAddMember }) {
  return (
    <div>
      <button onClick={onAddMember}>캐릭터 추가</button>
      <ul>
        {members.map(member =>
          <MemberItem
            key={member.nickname}
            member={member}
            onEditMember={onEditMember}
            onDeleteMember={onDeleteMember}
          />
        )}
      </ul>
    </div>
  );
}

function MemberItem({ member, onEditMember, onDeleteMember }) {
  const [{ isDragging }, drag] = useDrag({
    type: "member",
    item: member,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <li
      ref={drag}
      style={{ backgroundColor: isDragging ? "lightgreen" : "white" }}
    >
      {member.nickname} ({member.position})
      <button onClick={() => onEditMember(member)}>수정</button>
      <button onClick={() => onDeleteMember(member.nickname)}>삭제</button>
    </li>
  );
}

export default MemberList;
