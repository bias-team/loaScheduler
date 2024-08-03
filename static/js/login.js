$(document).ready(function() {
  // 회원가입 버튼 클릭 시 회원가입 팝업 표시
  $("#signupButton").on("click", function() {
    $("#signupPopup").show();
  });

  // 회원가입 팝업 닫기
  $("#signupCancel").on("click", function() {
    $("#signupPopup").hide();
  });

  // 회원가입 확인 버튼 클릭 시
  $("#signupConfirm").on("click", function() {
    const signupId = $("#signupId").val();
    if (/^[a-zA-Z0-9]{2,20}$/.test(signupId)) {
      $.ajax({
        type: "POST",
        url: "/signup",
        contentType: "application/json",
        data: JSON.stringify({ user_id: signupId }),
        success: function(response) {
          alert(response.message);
          $("#signupPopup").hide();
          sessionStorage.setItem("user_id", signupId);
        },
        error: function(response) {
          alert(response.responseJSON.error);
        },
      });
    } else {
      alert("유효하지 않은 ID입니다. 영문자와 숫자로 구성된 2~20자리 문자열이어야 합니다.");
    }
  });
});
