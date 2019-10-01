// $(document).ready(function() {

// STEP ONE : SAVE ARTICLE ==============================
$(document).on("click", "#btnSave", function () {
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId,
  }).then(function (data) {
    window.location = "/"
  });
});

// STEP TWO: OPEN COMMMENT MODAL==============================
$(document).on("click", "#commentButton", function () {
  event.preventDefault();
  const thisId = $(this).attr("data-id");
  console.log(thisId);
  $('#save-note').attr('data-id', thisId);
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
   
    .then(function (data) {
      console.log(data);
      $('.modal-body').empty();
      $(data[0].comment).each(function(){
        $('.modal-body').append
        ($(`<li class='list-group-item'>${data[0].comment.body}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data-id='${data[0].comment._id}'>X</button></li>`))
      });
});
});

// STEP THREE: SAVE COMMENT ==========================
$(document).on("click", "#saveComment", function () {
  // $("#saveComment").click(function(event){
  event.preventDefault();
  const thisId = $("#commentButton").attr("data-id");
  console.log(thisId);
  const commentInput = $("#comment-input").val().trim();
  $("#comment-input").val(" ");
  $.ajax({
    method: "POST",
    url: "/comment/" + thisId,
    data: {
      body: commentInput
    }
  })
    .then(function (data) {
      window.location = "/saved"
    });
});

// STEP FOUR: DELETE COMMENT ==========================
$(document).on("click", ".btn-deletenote", function () {
  event.preventDefault();
  console.log($(this).attr("data-id"))
  const thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "DELETE",
    url: "/comment/" + thisId,
  }).then(function (data) {
  $('#commentModal').modal('toggle');
});
});




// });
