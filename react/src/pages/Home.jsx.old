import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RaidTable from "../components/RaidTable";
import MemberList from "../components/MemberList";
import RaidPopup from "../components/RaidPopup";
import MemberPopup from "../components/MemberPopup";
import EditPopup from "../components/EditPopup";

function Home() {
  const [raids, setRaids] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentRaid, setCurrentRaid] = useState(null);
  const [showRaidPopup, setShowRaidPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    fetch("/raids")
      .then(response => response.json())
      .then(data => setRaids(data.raids));

    fetch("/members")
      .then(response => response.json())
      .then(data => setMembers(data.members));
  }, []);

  const handleAddRaid = () => {
    setCurrentRaid(null);
    setShowRaidPopup(true);
  };

  const handleSaveRaid = raid => {
    const method = currentRaid ? "PUT" : "POST";
    const url = currentRaid ? `/raids/${currentRaid.raid_name}` : "/raids";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(raid)
    })
      .then(response => response.json())
      .then(savedRaid => {
        setRaids(
          prevRaids =>
            currentRaid
              ? prevRaids.map(
                  r => (r.raid_name === currentRaid.raid_name ? savedRaid : r)
                )
              : [...prevRaids, savedRaid]
        );
        setShowRaidPopup(false);
      });
  };

  const handleDeleteRaid = raidName => {
    fetch(`/raids/${raidName}`, {
      method: "DELETE"
    }).then(() => {
      setRaids(prevRaids =>
        prevRaids.filter(raid => raid.raid_name !== raidName)
      );
    });
  };

  const handleEditRaid = raid => {
    setCurrentRaid(raid);
    setShowRaidPopup(true);
  };

  const handleDropParticipant = (participant, raidName) => {
    const raid = raids.find(r => r.raid_name === raidName);
    if (
      raid.participants.findIndex(p => p.nickname === participant.nickname) ===
      -1
    ) {
      fetch(`/raids/${raidName}/add_participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(participant)
      })
        .then(response => response.json())
        .then(updatedRaid => {
          setRaids(prevRaids =>
            prevRaids.map(r => (r.raid_name === raidName ? updatedRaid : r))
          );
        });
    }
  };

  const handleDropRemoveParticipant = (participant, raidName) => {
    const raid = raids.find(r => r.raid_name === raidName);
    fetch(`/raids/${raidName}/remove_participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(participant)
    })
      .then(response => response.json())
      .then(updatedRaid => {
        setRaids(prevRaids =>
          prevRaids.map(r => (r.raid_name === raidName ? updatedRaid : r))
        );
      });
  };

  const handleAddMember = () => {
    setShowMemberPopup(true);
  };

  const handleSaveMember = member => {
    fetch("/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(member)
    })
      .then(response => response.json())
      .then(savedMember => {
        setMembers(prevMembers => [...prevMembers, savedMember]);
        setShowMemberPopup(false);
      });
  };

  const handleEditMember = member => {
    setCurrentMember(member);
    setShowEditPopup(true);
  };

  const handleUpdateMember = member => {
    fetch(`/members/${member.nickname}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(member)
    })
      .then(response => response.json())
      .then(updatedMember => {
        setMembers(prevMembers =>
          prevMembers.map(
            m => (m.nickname === updatedMember.nickname ? updatedMember : m)
          )
        );
        setShowEditPopup(false);
      });
  };

  const handleDeleteMember = nickname => {
    fetch(`/members/${nickname}`, {
      method: "DELETE"
    }).then(() => {
      setMembers(prevMembers =>
        prevMembers.filter(member => member.nickname !== nickname)
      );
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header>
          <h1>편향팀 일정 관리</h1>
          <a href="/logout">로그아웃</a>
        </header>
        <main>
          <article>
            <h2>테이블(레이드) 섹션</h2>
            <button onClick={handleAddRaid}>레이드 추가</button>
            <RaidTable
              raids={raids}
              onDropParticipant={handleDropParticipant}
              onEditRaid={handleEditRaid}
              onDeleteRaid={handleDeleteRaid}
              onDropRemoveParticipant={handleDropRemoveParticipant}
            />
          </article>
          <aside>
            <h2>캐릭터 목록</h2>
            <MemberList
              members={members}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onAddMember={handleAddMember}
            />
            <div id="loginIdContainer">
              LOGIN ID: <span id="loginId">{"user_id"}</span>
            </div>
          </aside>
        </main>
        <footer>
          <p>편향팀 일정 관리 시스템</p>
        </footer>

        {showRaidPopup &&
          <RaidPopup
            currentRaid={currentRaid}
            onSaveRaid={handleSaveRaid}
            onClose={() => setShowRaidPopup(false)}
          />}

        {showMemberPopup &&
          <MemberPopup
            onSaveMember={handleSaveMember}
            onClose={() => setShowMemberPopup(false)}
          />}

        {showEditPopup &&
          <EditPopup
            currentMember={currentMember}
            onUpdateMember={handleUpdateMember}
            onClose={() => setShowEditPopup(false)}
          />}

        <div id="deleteOverlay" className="overlay" style={{ display: "none" }}>
          <p>삭제 영역</p>
        </div>
      </div>
    </DndProvider>
  );
}

export default Home;
