import React from 'react';
import { useDrop } from 'react-dnd';

function RaidRow({ raid, onDropParticipant, onEditRaid, onDeleteRaid, onDropRemoveParticipant }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'member',
    drop: (item) => onDropParticipant(item, raid.raid_name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isOverRemove }, dropRemove] = useDrop({
    accept: 'member',
    drop: (item) => onDropRemoveParticipant(item, raid.raid_name),
    collect: (monitor) => ({
      isOverRemove: !!monitor.isOver(),
    }),
  });

  return (
    <React.Fragment>
      <tr ref={drop} style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
        <td>{raid.raid_name}</td>
        <td>{`${raid.date} ${raid.time}`}</td>
        <td rowSpan={Math.ceil((raid.participants.length + 1) / 2)}>
          {raid.participants.map((participant, index) => (
            <div key={index}>{`${participant.nickname} (${participant.position})`}</div>
          ))}
        </td>
        <td rowSpan={Math.ceil((raid.participants.length + 1) / 2)}>{raid.status}</td>
        <td rowSpan={Math.ceil((raid.participants.length + 1) / 2)}>{raid.creator}</td>
        <td rowSpan={Math.ceil((raid.participants.length + 1) / 2)}>
          <button onClick={() => onEditRaid(raid)}>수정</button>
        </td>
        <td rowSpan={Math.ceil((raid.participants.length + 1) / 2)}>
          <button onClick={() => onDeleteRaid(raid.raid_name)}>삭제</button>
        </td>
      </tr>
      <tr ref={dropRemove} style={{ backgroundColor: isOverRemove ? 'lightcoral' : 'white' }}>
        <td colSpan="7">참가자 제거 드랍 영역</td>
      </tr>
    </React.Fragment>
  );
}

export default RaidRow;
