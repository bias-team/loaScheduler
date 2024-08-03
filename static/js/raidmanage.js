$(document).ready(function() {
  console.log("Raid Management JavaScript 파일 로드됨"); // JavaScript 파일 로드 확인

  const userId = $("body").data("userId"); // 로그인한 사용자 ID

  // 세션 스토리지에 사용자 ID 저장
  sessionStorage.setItem("user_id", userId);

  // 레이드 추가 버튼 클릭 시
  $("#addRaid").on("click", function() {
    $("#raidPopup").show();
    $("#raidName").val("");
    $("#raidSelect").val("");
    $("#raidDate").val("");
    $("#raidTime").val("");
    $("#raidMaxSize").val("");
    $("#raidStatus").val("예정");
    $("#raidRemark").val("");
    $("#saveRaid").data("edit", false); // 추가 모드로 설정
  });

  // 레이드 팝업 닫기
  $("#closeRaidPopup").on("click", function() {
    $("#raidPopup").hide();
  });

  // 레이드 선택 시 최대 인원 자동 설정
  $("#raidSelect").on("change", function() {
    const selectedOption = $(this).find("option:selected");
    const maxSize = selectedOption.data("max-size");
    $("#raidMaxSize").val(maxSize);
  });

  // 레이드 저장 버튼 클릭 시
  $("#saveRaid").on("click", function() {
    const raidName = $("#raidName").val();
    const raid = $("#raidSelect").val();
    const raidDate = $("#raidDate").val();
    const raidTime = $("#raidTime").val();
    const raidMaxSize = $("#raidMaxSize").val();
    const raidStatus = $("#raidStatus").val();
    const raidRemark = $("#raidRemark").val();

    if (raidName && raid && raidDate && raidTime && raidMaxSize) {
      if (
        raidStatus === "완료" &&
        !confirm("완료 상태로 바꾸면 더이상 수정할 수 없습니다. 정말 완료하시겠습니까?")
      ) {
        return;
      }

      const newRaid = {
        raid_name: raidName,
        raid: raid,
        date: raidDate,
        time: raidTime,
        raid_max_size: raidMaxSize,
        participants: [],
        status: raidStatus,
        remark: raidRemark,
        creator: sessionStorage.getItem("user_id"), // 레이드 생성자 추가
      };

      if ($(this).data("edit")) {
        // 수정 모드
        const originalName = $(this).data("originalName");
        $.ajax({
          type: "PUT",
          url: `/raids/${originalName}`,
          contentType: "application/json",
          data: JSON.stringify(newRaid),
          success: function() {
            $("#raidPopup").hide();
            loadRaids();
            $("#saveRaid").data("edit", false).removeData("originalName");
          },
        });
      } else {
        // 추가 모드
        $.ajax({
          type: "POST",
          url: "/raids",
          contentType: "application/json",
          data: JSON.stringify(newRaid),
          success: function() {
            $("#raidPopup").hide();
            loadRaids();
          },
        });
      }
    } else {
      alert("모든 항목을 입력하세요.");
    }
  });

  // 레이드 목록 불러오기
  function loadRaids() {
    $.get("/raids", function(data) {
      $("#raidTable tbody").empty();
      data.raids.forEach(function(raid) {
        const isCompleted = raid.status === "완료";
        const isCreator = raid.creator === sessionStorage.getItem("user_id");
        const participantRows = [];
        const maxParticipants = parseInt(raid.raid_max_size);
        const rows = maxParticipants === 4 ? 2 : maxParticipants === 8 ? 4 : 6;

        // 레이드 헤더
        $("#raidTable tbody").append(`
            <tr class="raid-header">
              <td colspan="8">
                ${raid.raid} ${raid.raid_name} - ${raid.date} ${raid.time}
              </td>
            </tr>
          `);

        // 참가자들 좌, 우
        for (let i = 0; i < rows; i++) {
          const participantLeft = raid.participants[i]
            ? `${raid.participants[i].nickname} (${raid.participants[i]
                .position})`
            : "";
          const participantRight = raid.participants[i + rows]
            ? `${raid.participants[i + rows].nickname} (${raid.participants[
                i + rows
              ].position})`
            : "";
          participantRows.push(`
              <tr class="participant-row">
                <td>${participantLeft}</td>
                <td>${participantRight}</td>
                <td colspan="4"></td>
              </tr>
            `);
        }
        $("#raidTable tbody").append(participantRows.join(""));

        // 레이드 상태 및 수정/삭제 버튼
        $("#raidTable tbody").append(`
            <tr class="raid-footer">
              <td colspan="2"></td>
              <td>${raid.status}</td>
              <td>${raid.creator}</td>
              <td><button class="editRaid" data-name="${raid.raid_name}" ${isCompleted
          ? "disabled"
          : ""}>수정</button></td>
              <td><button class="deleteRaid" data-name="${raid.raid_name}" ${!isCreator
          ? "disabled"
          : ""}>삭제</button></td>
            </tr>
          `);
      });
    });
  }

  loadRaids();

  // 레이드 수정 버튼 클릭 시
  $(document).on("click", ".editRaid", function() {
    const raidName = $(this).data("name");
    $.get("/raids", function(data) {
      const raid = data.raids.find(r => r.raid_name === raidName);
      if (raid) {
        $("#raidName").val(raid.raid_name);
        $("#raidSelect").val(raid.raid);
        $("#raidDate").val(raid.date);
        $("#raidTime").val(raid.time);
        $("#raidMaxSize").val(raid.raid_max_size);
        $("#raidStatus").val(raid.status);
        $("#raidRemark").val(raid.remark);
        $("#raidPopup").show();
        $("#saveRaid").data("edit", true).data("originalName", raidName);
      } else {
        console.error(`레이드 ${raidName}를 찾을 수 없습니다.`);
      }
    });
  });

  // 레이드 삭제 버튼 클릭 시
  $(document).on("click", ".deleteRaid", function() {
    const raidName = $(this).data("name");
    const confirmed = confirm(`${raidName} 레이드를 삭제하시겠습니까?`);
    if (confirmed) {
      $.ajax({
        type: "DELETE",
        url: `/raids/${raidName}`,
        success: function() {
          loadRaids();
        },
      });
    }
  });

  // 캐릭터 목록 불러오기
  function loadMembers() {
    $.get("/members", function(data) {
      $("#memberList").empty();
      data.members.forEach(function(member) {
        $("#memberList").append(`
            <li class="member-item" draggable="true" data-nickname="${member.nickname}" data-position="${member.position}" data-remark="${member.remark}">
              ${member.nickname} (${member.position}): ${member.remark}
            </li>
          `);
      });
      $("#memberList").append(`
          <li id="addMemberContainer">
            <button id="addMember">+</button>
          </li>
        `);
    });
  }

  loadMembers();

  // 드래그 앤 드롭 이벤트 설정
  $(document).on("dragstart", ".member-item", function(event) {
    event.originalEvent.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        nickname: $(this).data("nickname"),
        position: $(this).data("position"),
        remark: $(this).data("remark"),
      })
    );
  });

  $(document).on("dragover", ".raid-row", function(event) {
    event.preventDefault();
    $(this).addClass("drag-over");
  });

  $(document).on("dragleave", ".raid-row", function(event) {
    event.preventDefault();
    $(this).removeClass("drag-over");
  });

  $(document).on("drop", ".raid-row", function(event) {
    event.preventDefault();
    $(this).removeClass("drag-over");

    const raidName = $(this).data("raid-name");
    const raidStatus = $(this).data("raid-status");
    const raidMaxSize = parseInt($(this).data("raid-max-size")) + 4; // 레이드 크기 + 4
    const memberData = JSON.parse(
      event.originalEvent.dataTransfer.getData("text/plain")
    );

    if (raidStatus !== "예정") {
      alert("레이드 상태가 예정일 때만 참가자를 추가할 수 있습니다.");
      return;
    }

    const raidRow = $(this);
    const participantsCell = raidRow.find(".participants");
    const currentParticipants = participantsCell
      .text()
      .split(", ")
      .map(p => p.split(" ")[0]);

    if (currentParticipants.length >= raidMaxSize) {
      alert("레이드 크기 초과로 참가자를 추가할 수 없습니다.");
      return;
    }

    if (!currentParticipants.includes(memberData.nickname)) {
      participantsCell.append(
        `${participantsCell.text()
          ? ", "
          : ""}${memberData.nickname} (${memberData.position})`
      );
      $("#saveChanges").show();
      $("#cancelChanges").show();
    } else {
      alert("이미 등록된 참가자입니다.");
    }
  });

  // 변경사항 저장 버튼 클릭 시
  $("#saveChanges").on("click", function() {
    $("#raidTable .raid-row").each(function() {
      const raidName = $(this).data("raid-name");
      const participants = $(this)
        .find(".participants")
        .text()
        .split(", ")
        .map(participantText => {
          const [nickname, position] = participantText.split(" (");
          return {
            nickname: nickname,
            position: position ? position.replace(")", "") : "",
          };
        });

      const existingParticipants = new Set();
      participants.forEach(participant => {
        if (
          participant.position &&
          !existingParticipants.has(participant.nickname)
        ) {
          existingParticipants.add(participant.nickname);
          $.ajax({
            type: "POST",
            url: `/raids/${raidName}/add_participant`,
            contentType: "application/json",
            data: JSON.stringify(participant),
            success: function() {
              console.log(`참가자 ${participant.nickname} 추가됨.`);
            },
            error: function(xhr) {
              console.error(`참가자 추가 실패: ${xhr.responseText}`);
            },
          });
        } else {
          console.warn(`참가자 ${participant.nickname}는 이미 추가되었습니다.`);
        }
      });
      $("#saveChanges").hide();
      $("#cancelChanges").hide();
    });
  });

  // 변경사항 취소 버튼 클릭 시
  $("#cancelChanges").on("click", function() {
    loadRaids();
    $(this).hide();
    $("#saveChanges").hide();
  });
});
