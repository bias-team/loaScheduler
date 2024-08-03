$(document).ready(function() {
  $("#signupButton").on("click", function() {
    $("#signupPopup").show();
  });

  $("#signupCancel").on("click", function() {
    $("#signupPopup").hide();
  });

  $("#signupConfirm").on("click", function() {
    const userId = $("#signupId").val();
    if (userId) {
      $.ajax({
        type: "POST",
        url: "/signup",
        contentType: "application/json",
        data: JSON.stringify({ user_id: userId }),
        success: function(response) {
          alert("가입 완료");
          $("#signupPopup").hide();
          window.location.href = "/";
        },
        error: function(response) {
          alert(response.responseJSON.error);
        },
      });
    } else {
      alert("ID를 입력하세요.");
    }
  });
});
