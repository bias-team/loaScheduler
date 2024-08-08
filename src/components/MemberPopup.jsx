import React, { useState } from "react";

function MemberPopup({ onSaveMember, onClose }) {
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("딜러");
  const [remark, setRemark] = useState("");

  const handleSave = () => {
    onSaveMember({ nickname, position, remark });
  };

  return (
    <div className="popup">
      <h3>캐릭터 추가</h3>
      <label>
        닉네임:
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </label>
      <label>
        포지션:
        <select value={position} onChange={e => setPosition(e.target.value)}>
          <option value="딜러">딜러</option>
          <option value="서포터">서포터</option>
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

export default MemberPopup;
