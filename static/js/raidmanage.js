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
        $("#raidTable tbody").append(`
                    <tr>
                        <td>${raid.raid_name}</td>
                        <td>${raid.date}</td>
                        <td>${raid.time}</td>
                        <td>${raid.raid_max_size}</td>
                        <td>${raid.participants
                          .map(p => p.nickname)
                          .join(", ")}</td>
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
});