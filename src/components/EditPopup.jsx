import React, { useState, useEffect } from "react";

function EditPopup({ currentMember, onUpdateMember, onClose }) {
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("딜러");
  const [remark, setRemark] = useState("");

  useEffect(
    () => {
      if (currentMember) {
        setNickname(currentMember.nickname);
        setPosition(currentMember.position);
        setRemark(currentMember.remark);
      }
    },
    [currentMember]
  );

  const handleUpdate = () => {
    onUpdateMember({ nickname, position, remark });
  };

  return (
    <div className="popup">
      <h3>캐릭터 수정</h3>
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
      <button onClick={handleUpdate}>확인</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
}

export default EditPopup;
