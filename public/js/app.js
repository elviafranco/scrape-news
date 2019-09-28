$(document).ready(function() {

  // STEP ONE : SAVE ARTICLE ==============================
  // When you click the savenote button
$(document).on("click", "#btnSave", function() {
  console.log("button clicked!")
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr("data-id");
    // var saved = {
    //   saved: true
    // };
    console.log(thisId);
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId,
      // data: saved
    })
      // With that done
      .then(function(data) {
        // Log the response
        window.location = "/"
        console.log(data);
      });
});

// STEP TWO: OPEN COMMMENT MODAL==============================
// populating notes
$(document).on("click", "#commentButton", function() {
  event.preventDefault();
  // const thisId = $(this).attr("data");
  const thisId = $(this).attr("data-id");
  console.log(thisId);
  $('#save-note').attr('data-id', thisId);

   $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
});




});

// STEP THREE: SAVE COMMENT ==========================
// When you click the savecomment button
// $(document).on("click", "#saveComment", function() {
  $("#saveComment").click(function(event){
    event.preventDefault();
    console.log("save comment button clicked!");
    const thisId = $(this).attr("data-id");
    console.log(thisId);
    const commentInput = $("#comment-input").val().trim();
    console.log(thisId + commentInput);
    $("#comment-input").val(" ");
  
     // Run a POST request to change the note, using what's entered in the inputs
  
     $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: commentInput
      }
    
    })
      // With that done
      .then(function(data) {
        // Log the response
        window.location = "/saved"
        console.log(data);
      });

  })
 
});



