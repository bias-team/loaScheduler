// src/components/RaidList.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd"; // 추가: react-dnd import
import { Raid, Character, RaidType, getDefaultPartyCount } from "../types";
import { useUserStore } from "../stores/userStore";
import { useTheme } from "../contexts/ThemeContext";

interface RaidListProps {
  characters: Character[];
}

const RaidList: React.FC<RaidListProps> = ({ characters }) => {
  const { userId } = useUserStore();
  const [raids, setRaids] = useState<Raid[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingRaidId, setEditingRaidId] = useState<number | null>(null);
  const [editingRaidName, setEditingRaidName] = useState("");
  const [editingRaidType, setEditingRaidType] = useState<RaidType>(
    RaidType.BEAST
  );
  const [newRaidName, setNewRaidName] = useState("");
  const [newRaidType, setNewRaidType] = useState<RaidType>(RaidType.BEAST);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const { theme } = useTheme();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 여기서 백엔드에서 레이드 목록을 가져오는 API를 호출할 수 있습니다.
    // 지금은 로컬 상태만 사용합니다.
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        setShowScrollTopButton(listRef.current.scrollTop > 300);
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleCreateRaid = () => {
    const partyCount = getDefaultPartyCount(newRaidType);
    const newRaid: Raid = {
      id: Date.now(),
      name: newRaidName || `${newRaidType} Raid`,
      type: newRaidType,
      partyCount: partyCount,
      parties: Array(partyCount).fill([]),
      raidCreatorId: userId,
    };
    setRaids([...raids, newRaid]);
    setHasChanges(true);
    setNewRaidName("");
    setNewRaidType(RaidType.BEAST);
  };

  const isRaidCreator = (raid: Raid) => raid.raidCreatorId === userId;

  // 변경: HTML5 Drag and Drop API 대신 react-dnd 사용
  const PartyDropZone: React.FC<{ raidId: number; partyIndex: number }> = ({
    raidId,
    partyIndex,
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "CHARACTER",
      drop: (item: { id: number }) => handleDrop(item.id, raidId, partyIndex),
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div
        ref={drop}
        style={{
          minWidth: "200px",
          flex: "1",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          background: isOver
            ? "rgba(16, 16, 16, 0.2)"
            : "rgba(16, 16, 16, 0.1)",
        }}
      >
        <h4 style={{ marginTop: "0", marginBottom: "10px" }}>
          Party {partyIndex + 1}
        </h4>
        {raids
          .find(r => r.id === raidId)
          ?.parties[partyIndex].map(charId => {
            const character = characters.find(char => char.charId === charId);
            return (
              <div
                key={charId}
                style={{
                  margin: "5px 0",
                  padding: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  background: "rgba(16, 16, 16, 0.4)",
                }}
              >
                {getCharacterInfo(charId)}
                {(isRaidCreator(raids.find(r => r.id === raidId)!) ||
                  character?.userId === userId) && (
                  <button
                    onClick={() =>
                      handleRemoveCharacter(raidId, partyIndex, charId)
                    }
                    style={{ marginLeft: "5px", padding: "2px 5px" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  const handleDrop = (charId: number, raidId: number, partyIndex: number) => {
    setRaids(
      raids.map(raid => {
        if (raid.id === raidId) {
          const isCharacterAlreadyInRaid = raid.parties.some(party =>
            party.includes(charId)
          );

          if (isCharacterAlreadyInRaid) {
            alert("This character is already in this raid.");
            return raid;
          }

          const newParties = [...raid.parties];
          newParties[partyIndex] = [...newParties[partyIndex], charId];
          return { ...raid, parties: newParties };
        }
        return raid;
      })
    );
    setHasChanges(true);
  };

  const handleRemoveCharacter = (
    raidId: number,
    partyIndex: number,
    charId: number
  ) => {
    setRaids(
      raids.map(raid => {
        if (raid.id === raidId) {
          const newParties = raid.parties.map((party, index) =>
            index === partyIndex ? party.filter(id => id !== charId) : party
          );
          return { ...raid, parties: newParties };
        }
        return raid;
      })
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // 여기서 백엔드 API를 호출하여 변경사항을 저장합니다.
    console.log("Saving changes to backend:", raids);
    setHasChanges(false);
    // 실제로는 여기서 axios나 fetch를 사용하여 백엔드 API를 호출해야 합니다.
  };

  const handleCancelChanges = () => {
    // 여기서 원래 상태로 되돌리는 로직을 구현해야 합니다.
    // 예를 들어, 백엔드에서 원래 데이터를 다시 불러오거나,
    // 로컬에서 변경 전 상태를 유지하고 있다가 복원하는 방식을 사용할 수 있습니다.
    console.log("Cancelling all changes");
    setHasChanges(false);
  };

  const handleDeleteRaid = (raidId: number) => {
    setRaids(raids.filter(raid => raid.id !== raidId));
    setHasChanges(true);
  };

  const handleStartEditingRaid = (raid: Raid) => {
    setEditingRaidId(raid.id);
    setEditingRaidName(raid.name);
    setEditingRaidType(raid.type);
  };

  const handleEditRaidNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingRaidName(e.target.value);
  };

  const handleEditRaidTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditingRaidType(e.target.value as RaidType);
  };

  const handleEditRaidSubmit = () => {
    if (editingRaidId !== null) {
      setRaids(
        raids.map(raid => {
          if (raid.id === editingRaidId) {
            const newPartyCount = getDefaultPartyCount(editingRaidType);
            const newParties = Array(newPartyCount)
              .fill([])
              .map((_, i) => raid.parties[i] || []);
            return {
              ...raid,
              name: editingRaidName,
              type: editingRaidType,
              partyCount: newPartyCount,
              parties: newParties,
            };
          }
          return raid;
        })
      );
      setEditingRaidId(null);
      setHasChanges(true);
    }
  };

  const getCharacterInfo = (charId: number) => {
    const character = characters.find(char => char.charId === charId);
    return character
      ? `(${character.charJob}) ${character.charName} Lv.${character.charLevel}`
      : `Character ${charId}`;
  };
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const getThemeStyles = () => ({
    container: {
      backgroundColor:
        theme === "dark" ? "rgba(32, 32, 32, 0.8)" : "rgba(240, 240, 240, 0.8)",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    characterItem: {
      backgroundColor:
        theme === "dark" ? "rgba(48, 48, 48, 0.8)" : "rgba(255, 255, 255, 0.8)",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    button: {
      backgroundColor:
        theme === "dark" ? "rgba(76, 175, 80, 0.4)" : "rgba(33, 150, 243, 0.4)",
      color: "#ffffff",
    },
    deleteButton: {
      backgroundColor:
        theme === "dark" ? "rgba(244, 67, 54, 0.4)" : "rgba(255, 87, 34, 0.4)",
      color: "#ffffff",
    },
  });

  const styles = getThemeStyles();

  return (
    <div
      ref={listRef}
      style={{
        padding: "1rem",
        width: "100%",
        boxSizing: "border-box",
        height: "calc(100vh - 100px)", // 예: 상단 헤더 높이를 100px로 가정
        overflowY: "auto",
      }}
    >
      <h2>Raids</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newRaidName}
          onChange={e => setNewRaidName(e.target.value)}
          placeholder="New Raid Name"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={newRaidType}
          onChange={e => setNewRaidType(e.target.value as RaidType)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          {Object.values(RaidType).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={handleCreateRaid} style={{ padding: "5px 10px" }}>
          Create Raid
        </button>
      </div>
      {raids.map(raid => (
        <div
          key={raid.id}
          style={{
            background: "rgba(200, 200, 200, 0.1)",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {editingRaidId === raid.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditRaidSubmit();
              }}
              style={{ marginBottom: "10px" }}
            >
              <input
                value={editingRaidName}
                onChange={handleEditRaidNameChange}
                placeholder="입력 후 엔터를 눌러주세요"
                style={{ marginRight: "10px", padding: "5px" }}
              />
              <select
                value={editingRaidType}
                onChange={handleEditRaidTypeChange}
                style={{ marginRight: "10px", padding: "5px" }}
              >
                {Object.values(RaidType).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{ marginRight: "10px", padding: "5px 10px" }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingRaidId(null)}
                style={{ padding: "5px 10px" }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <h3
              onClick={() =>
                isRaidCreator(raid) && handleStartEditingRaid(raid)
              }
              style={{ marginBottom: "10px", cursor: "pointer" }}
            >
              {raid.name} ({raid.type})
            </h3>
          )}
          {isRaidCreator(raid) && (
            <button
              onClick={() => handleDeleteRaid(raid.id)}
              style={{ marginBottom: "10px", padding: "5px 10px" }}
            >
              Delete Raid
            </button>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
            }}
          >
            {raid.parties.map((_, partyIndex) => (
              <PartyDropZone
                key={partyIndex}
                raidId={raid.id}
                partyIndex={partyIndex}
              />
            ))}
          </div>
        </div>
      ))}
      {hasChanges && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: "5px 10px",
              ...styles.button,
              border: "none",
              borderRadius: "3px",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={handleCancelChanges}
            style={{
              padding: "5px 10px",
              ...styles.deleteButton,
              border: "none",
              borderRadius: "3px",
            }}
          >
            Cancel Changes
          </button>
        </div>
      )}
      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ▲
        </button>
      )}
    </div>
  );
};

export default RaidList;
