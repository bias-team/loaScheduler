import React from "react";
import { useDrop } from "react-dnd";
import RaidRow from "./RaidRow";

function RaidTable({
  raids,
  onDropParticipant,
  onEditRaid,
  onDeleteRaid,
  onDropRemoveParticipant
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>레이드 + 레이드 이름</th>
          <th>날짜 + 시간</th>
          <th>참가자</th>
          <th>상태</th>
          <th>생성자</th>
          <th>수정</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {raids.map(raid =>
          <RaidRow
            key={raid.raid_name}
            raid={raid}
            onDropParticipant={onDropParticipant}
            onEditRaid={onEditRaid}
            onDeleteRaid={onDeleteRaid}
            onDropRemoveParticipant={onDropRemoveParticipant}
          />
        )}
      </tbody>
    </table>
  );
}

export default RaidTable;
