$(document).ready(function() {
  console.log("JavaScript 파일 로드됨"); // JavaScript 파일 로드 확인

  // 더블 클릭 시 테이블 섹션 추가
  $("#mainTable").on("dblclick", function() {
    $("#mainTable tbody").append(
      '<tr><td contenteditable="true">새 섹션</td></tr>'
    );
    $("#saveChanges").show();
    $("#cancelChanges").show();
  });

  // 변경사항 저장 버튼
  $("#saveChanges").on("click", function() {
    // 여기에 저장 로직을 추가하세요
    alert("변경사항이 저장되었습니다.");
    $("#saveChanges").hide();
    $("#cancelChanges").hide();
  });

  // 변경사항 취소 버튼
  $("#cancelChanges").on("click", function() {
    $("#mainTable tbody tr:last-child").remove();
    $("#saveChanges").hide();
    $("#cancelChanges").hide();
  });

  // 캐릭터 추가 팝업 표시
  $(document).on("click", "#addMember", function() {
    console.log("캐릭터 추가 버튼 클릭됨"); // 디버깅을 위한 콘솔 로그
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      $("#memberId").val(userId);
      $("#memberPopup").show();
    } else {
      $.get("/members", function(data) {
        const userId = data.members.length > 0 ? data.members[0].id : "";
        $("#memberId").val(userId);
        $("#memberPopup").show();
      });
    }
  });

  // 캐릭터 추가 팝업 닫기
  $("#closePopup").on("click", function() {
    $("#memberPopup").hide();
  });

  // 캐릭터 추가 저장
  $("#saveMember").on("click", function() {
    const memberId = $("#memberId").val();
    const nickname = $("#nickname").val();
    const position = $("#position").val();
    const remark = $("#remark").val();

    if (memberId && nickname && position && remark) {
      const newMember = {
        id: memberId,
        nickname: nickname,
        position: position,
        remark: remark,
      };
      $.ajax({
        type: "POST",
        url: "/members",
        contentType: "application/json",
        data: JSON.stringify(newMember),
        success: function() {
          $("#memberPopup").hide();
          loadMembers();
        },
      });
    } else {
      alert("모든 항목을 입력하세요.");
    }
  });

  // 캐릭터 목록 불러오기
  function loadMembers() {
    $.get("/members", function(data) {
      $("#memberList").empty();
      const members = data.members;
      if (members.length === 0) {
        $("#memberList").append(
          '<li id="addMemberContainer"><button id="addMember">+</button></li>'
        );
      } else {
        members.forEach(function(member, index) {
          const deleteButton =
            members.length > 1
              ? '<button class="deleteMember" data-nickname="' +
                member.nickname +
                '">삭제</button>'
              : "";
          $("#memberList").append(
            "<li>" +
              member.nickname +
              " (" +
              member.position +
              "): " +
              member.remark +
              '<button class="editMember" data-id="' +
              member.id +
              '">수정</button>' +
              deleteButton +
              "</li>"
          );
        });
        $("#memberList").append(
          '<li id="addMemberContainer"><button id="addMember">+</button></li>'
        );
      }
    });
  }

  loadMembers();

  // 캐릭터 수정 버튼 클릭 시
  $(document).on("click", ".editMember", function() {
    const id = $(this).data("id");
    $.get("/members", function(data) {
      const member = data.members.find(member => member.id === id);
      if (member) {
        $("#editId").val(member.id);
        $("#editNickname").val(member.nickname);
        $("#editPosition").val(member.position);
        $("#editRemark").val(member.remark);
        $("#editPopup").show();
      }
    });
  });

  // 캐릭터 수정 저장
  $("#saveEdit").on("click", function() {
    const id = $("#editId").val();
    const nickname = $("#editNickname").val();
    const position = $("#editPosition").val();
    const remark = $("#editRemark").val();
    const updatedMember = {
      nickname: nickname,
      position: position,
      remark: remark,
    };

    $.ajax({
      type: "PUT",
      url: "/members/" + id,
      contentType: "application/json",
      data: JSON.stringify(updatedMember),
      success: function() {
        $("#editPopup").hide();
        loadMembers();
      },
    });
  });

  // 캐릭터 수정 팝업 닫기
  $("#cancelEdit").on("click", function() {
    $("#editPopup").hide();
  });

  // 캐릭터 삭제 버튼 클릭 시
  $(document).on("click", ".deleteMember", function() {
    const nickname = $(this).data("nickname");
    const confirmed = confirm(`${nickname} 삭제하시겠습니까?`);
    if (confirmed) {
      $.ajax({
        type: "DELETE",
        url: "/members/" + nickname,
        success: function() {
          loadMembers();
        },
      });
    }
  });

  // 팝업 닫을 때 초기화
  $("#memberPopup").on("hidden.bs.modal", function() {
    $("#memberId").val("");
    $("#nickname").val("");
    $("#position").val("딜러");
    $("#remark").val("");
  });

  $("#editPopup").on("hidden.bs.modal", function() {
    $("#editId").val("");
    $("#editNickname").val("");
    $("#editPosition").val("딜러");
    $("#editRemark").val("");
  });
});
