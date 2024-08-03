// static/js/scripts.js
$(document).ready(function() {
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

  // 회원 목록에 마우스를 올리면 추가 버튼 표시
  $("#memberList")
    .on("mouseenter", function() {
      $("#addMember").show();
    })
    .on("mouseleave", function() {
      $("#addMember").hide();
    });

  // 회원 추가 팝업 표시
  $("#addMember").on("click", function() {
    $("#memberPopup").show();
  });

  // 회원 추가 팝업 닫기
  $("#closePopup").on("click", function() {
    $("#memberPopup").hide();
  });

  // 회원 추가 저장
  $("#saveMember").on("click", function() {
    const nickname = $("#nickname").val();
    const position = $("#position").val();
    const remark = $("#remark").val();

    if (nickname && position && remark) {
      const newMember = {
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

  // 회원 목록 불러오기
  function loadMembers() {
    $.get("/members", function(data) {
      $("#memberList").empty();
      data.members.forEach(function(member) {
        $("#memberList").append(
          "<li>" +
            member.nickname +
            " (" +
            member.position +
            "): " +
            member.remark +
            '<button class="editMember" data-nickname="' +
            member.nickname +
            '">수정</button><button class="deleteMember" data-nickname="' +
            member.nickname +
            '">삭제</button></li>'
        );
      });
    });
  }

  loadMembers();

  // 회원 수정 버튼 클릭 시
  $(document).on("click", ".editMember", function() {
    const nickname = $(this).data("nickname");
    $.get("/members", function(data) {
      const member = data.members.find(member => member.nickname === nickname);
      if (member) {
        $("#editNickname").val(member.nickname);
        $("#editPosition").val(member.position);
        $("#editRemark").val(member.remark);
        $("#editPopup").show();
      }
    });
  });

  // 회원 수정 저장
  $("#saveEdit").on("click", function() {
    const nickname = $("#editNickname").val();
    const position = $("#editPosition").val();
    const remark = $("#editRemark").val();
    const updatedMember = { position: position, remark: remark };

    $.ajax({
      type: "PUT",
      url: "/members/" + nickname,
      contentType: "application/json",
      data: JSON.stringify(updatedMember),
      success: function() {
        $("#editPopup").hide();
        loadMembers();
      },
    });
  });

  // 회원 수정 팝업 닫기
  $("#cancelEdit").on("click", function() {
    $("#editPopup").hide();
  });

  // 회원 삭제 버튼 클릭 시
  $(document).on("click", ".deleteMember", function() {
    const nickname = $(this).data("nickname");
    $.ajax({
      type: "DELETE",
      url: "/members/" + nickname,
      success: function() {
        loadMembers();
      },
    });
  });

  // 팝업 닫을 때 초기화
  $("#memberPopup").on("hidden.bs.modal", function() {
    $("#nickname").prop("disabled", false);
    $("#saveMember").text("저장");
    $("#nickname").val("");
    $("#position").val("딜러");
    $("#remark").val("");
  });

  $("#editPopup").on("hidden.bs.modal", function() {
    $("#editNickname").val("");
    $("#editPosition").val("딜러");
    $("#editRemark").val("");
  });
});
