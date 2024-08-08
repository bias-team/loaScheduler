import React, { useState, useEffect } from "react";

function RaidPopup({ currentRaid, onSaveRaid, onClose }) {
  const [raidName, setRaidName] = useState("");
  const [raid, setRaid] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [raidMaxSize, setRaidMaxSize] = useState("");
  const [status, setStatus] = useState("예정");
  const [remark, setRemark] = useState("");

  useEffect(
    () => {
      if (currentRaid) {
        setRaidName(currentRaid.raid_name);
        setRaid(currentRaid.raid);
        setDate(currentRaid.date);
        setTime(currentRaid.time);
        setRaidMaxSize(currentRaid.raid_max_size);
        setStatus(currentRaid.status);
        setRemark(currentRaid.remark);
      }
    },
    [currentRaid]
  );

  const handleSave = () => {
    onSaveRaid({
      raid_name: raidName,
      raid,
      date,
      time,
      raid_max_size: raidMaxSize,
      status,
      remark,
      participants: currentRaid ? currentRaid.participants : []
    });
  };

  return (
    <div className="popup">
      <h3>레이드 추가/수정</h3>
      <label>
        레이드 이름:
        <input
          type="text"
          value={raidName}
          onChange={e => setRaidName(e.target.value)}
        />
      </label>
      <label>
        레이드:
        <input
          type="text"
          value={raid}
          onChange={e => setRaid(e.target.value)}
        />
      </label>
      <label>
        날짜:
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </label>
      <label>
        시간:
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
      </label>
      <label>
        최대 인원:
        <input
          type="number"
          value={raidMaxSize}
          onChange={e => setRaidMaxSize(e.target.value)}
        />
      </label>
      <label>
        상태:
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="예정">예정</option>
          <option value="확정">확정</option>
          <option value="완료">완료</option>
        </select>
      </label>
      <label>
        비고:
        <input
          type="text"
          value={remark}
          onChange={e => setRemark(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default RaidPopup;
