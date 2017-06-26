var player1 = "O"; //player1 = triangle
var player2 = "X"; //player2 = circle
var turn = "O"; 
var originalBoard = [0 ,1 ,2, 3, 4, 5, 6, 7, 8];
var popup = $("#firstPopup"); 
var undoStyles = {
	backgroundColor: "e9e9e9", 
	transform: "none"
}


$(document).on("click", "#play", function() {
	//remove <i> icon to delete x's and o's
	$("td").html(""); 
	//remove old styling
	$("td").removeClass("cross circle"); 
	//add board again
	$("td").addClass("board"); 
	//reset board
	originalBoard = [0 ,1 ,2, 3, 4, 5, 6, 7, 8];
	//reset who goes first
	turn = "O"; 
	//fade out popup modal
	popup.fadeOut(350); 
}); 

$(document).on("click", "#quit", function(event) {
	$(".popup-inner").fadeOut(200, function() {
			$(this).html(""); 
		});
		event.stopPropagation(); //will stop event bubbling
	$(".popup-inner").fadeIn(200, function() {
		$(this).html('<div id="sadFace"><i class="fa fa-frown-o" aria-hidden="true"></i><p>If you do change your mind, you\'re going to have to hit refresh!</p><p>Hope you had fun!</p></div>'); 
	});
	event.stopPropagation(); //will stop event bubbling

	// $(this).fadeIn(1000, function() {
	// 	$(".popup-inner").html("SAD FACE"); 
	// });
	

});

//manipulate
$(document).on("click", ".board", function() {
	//if player 1, fill with colour purple
	if (typeof originalBoard[Number($(this).attr("value"))] == "number") {
		if (turn == "O") {
			//add class for styling
			$(this).addClass("cross"); 
			
			$(this).css(undoStyles); 
			//add actual triangle to the board
			$(this).html('<i class="fa fa-times" aria-hidden="true"></i></i>');

			

			//add player's move to the originalBoard
			originalBoard[Number($(this).attr("value"))] = turn; 
		}
		//else (player 2), fill with colour gray
		else {
			//add class for styling
			$(this).addClass("circle"); 
			$(this).css(undoStyles); 

			//add actual circle to the board
			$(this).html('<i class="fa fa-circle" aria-hidden="true"></i>'); 
			//add player's move to the originalBoard
			originalBoard[Number($(this).attr("value"))] = turn; 
		}

		//check for a winner
		if (winning(originalBoard, turn)) {
			popup.fadeIn(350);  
		}

		if (turn == player1) {
			turn = player2; 
		}
		else {
			turn = player1; 
		}
	}
	
}); 

// returns the available spots on the board
function emptyIndexies(board){
  return  board.filter(s => s != "O" && s != "X");
}

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
function winning(board, player){
	if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
		return true;
    } 
    else {
        return false;
    }
}

