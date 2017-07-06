player1 = {
	name: "Player 1",
	letter: "X", 
	weapon: "times"
};
player2 = {
	name: "Player 2", 
	letter: "O", 
	weapon: "circle"
};
var turn = "X"; 
var originalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var popup = $("#firstPopup"); 
var mode; 
var undoStyles = {
	backgroundColor: "e9e9e9", 
	transform: "none"
}
var aiPlayer, huPlayer; 

setup(); 

function setup() {
	buttonSetup(); 
}

function fade() {
	popup.fadeOut(500); 
}
function buttonSetup() {
	//single player button 
	$(document).on("touchstart touch click", "#singlePlayer", function() {
		//run single player setup
		singlePlayerSetup(); 
	});

	$(document).on("touchstart touch click", "#twoPlayer", function() {
		//run two player setup
		twoPlayerSetup(); 
	})

	// PLAY AGAIN BUTTON
	$(document).on("touchstart touch click", "#play", function() {
		//remove <i> icon to delete x's and o's
		$("td").html(""); 
		//remove old styling
		$("td").removeClass("times circle"); 
		//add board again
		$("td").addClass("board"); 
		//reset board
		originalBoard = [0 ,1 ,2, 3, 4, 5, 6, 7, 8];
		//reset who goes first
		turn = player1; 
		//reset counter to zero to continually check for ties
		checkForTie = 0; 
		//fade out popup modal
		popup.fadeOut(200); 
		
	}); 

	// QUIT BUTTON
	$(document).on("touchstart touch click", "#quit", function(event) {
		$(".popup-inner").fadeOut(200, function() {
				$(this).html(""); 
			});
			event.stopPropagation(); //will stop event bubbling
		$(".popup-inner").fadeIn(200, function() {
			$(this).html('<div id="sadFace"><i class="fa fa-frown-o" aria-hidden="true"></i><p>If you do change your mind, you\'re going to have to hit refresh!</p><p>Hope you had fun!</p></div>'); 
		});
		event.stopPropagation(); //will stop event bubbling

		//disable .board click events
		$(".board").click(false); 
		setTimeout(fade, 3000); 
	});

	$(document).on("touchstart touch click", "#weaponX", function() {
		if (mode == true) { //mode == true means singlePlayer
			huPlayer = player1; 
			aiPlayer = player2; 
			huPlayer.name = "Human";
			aiPlayer.name = "The computer"; 
			boardSetup(huPlayer, aiPlayer, mode);
		} else {
			//the default settings already match the weapon chosen, so just setupBoard
			boardSetup(player1, player2, mode); 
		}
		
		$("#initPopup").fadeOut(350);
	});

	$(document).on("touchstart touch click", "#weaponO", function() {
		if (mode == true) { //mode == true means singlePlayer
			huPlayer = player2; 
			aiPlayer = player1; 
			huPlayer.name = "Human";
			aiPlayer.name = "The computer"; 
			boardSetup(huPlayer, aiPlayer, mode);
		} else {
			//first param is now player2, as player2 is weapon"O"
			player2.name = "Player 1"; //need to switch names cuz user picked "circle"
			player1.name = "Player 2"; //cuz player1 and player2 are hardcoded at the top
			boardSetup(player2, player1, mode); 
		}
		$("#initPopup").fadeOut(350); 
	});
}

function singlePlayerSetup() {
	mode = true; 
	
	$(".popup-inner2").fadeOut(200, function() {
		$(this).html(""); 
	});
	event.stopPropagation(); //will stop event bubbling

	$(".popup-inner2").fadeIn(200, function() {
		$(this).html('<div class="mainMessage"><div><h2>Pick your weapon:</h2></div></div><div id="weapon"><a id="weaponX" class="playAgain left" href="#"><i class="fa fa-times" aria-hidden="true"></i></a><a id="weaponO" class="playAgain right" href="#" ><i class="fa fa-circle" aria-hidden="true"></i></a></div>'); 
	});
	event.stopPropagation(); //will stop event bubbling
}

function twoPlayerSetup() {
	mode = false; 

	$(".popup-inner2").fadeOut(200, function() {
		$(this).html(""); 
	});
	event.stopPropagation(); //will stop event bubbling

	$(".popup-inner2").fadeIn(200, function() {
		$(this).html('<div class="mainMessage"><div><h2>Player 1, pick your weapon:</h2></div></div><div id="weapon"><a id="weaponX" class="playAgain left" href="#"><i class="fa fa-times" aria-hidden="true"></i></a><a id="weaponO" class="playAgain right" href="#" ><i class="fa fa-circle" aria-hidden="true"></i></a></div>'); 
	}); 
}

function boardSetup(p1, p2, singlePlayerMode) {
	turn = p1; 
	//turn = p1.letter;
	//console.log("turn.letter: " + turn.letter)
	
	$(document).on("touchstart touch click", ".board", function() {
	
		if (typeof originalBoard[Number($(this).attr("value"))] == "number") {
			if (turn.letter == p1.letter || singlePlayerMode) {
				//add class for styling
				$(this).addClass(p1.weapon); 
				$(this).css(undoStyles); 

				//add actual circle to the board
				$(this).html('<i class="fa fa-' + p1.weapon + '" aria-hidden="true"></i>'); 
				//add player's move to the originalBoard
				originalBoard[Number($(this).attr("value"))] = p1.letter; 

				if (singlePlayerMode) {
					//use setTimeout so that there is the slightest delay and computer doesn't play immediately
					setTimeout(computerTurn, 100); 
				}		
			} else { //else, two player mode
				//add class for styling
				$(this).addClass(p2.weapon); 
				$(this).css(undoStyles); 

				//add actual circle to the board
				$(this).html('<i class="fa fa-' + p2.weapon + '" aria-hidden="true"></i>'); 
				//add player's move to the originalBoard
				originalBoard[Number($(this).attr("value"))] = p2.letter; 
			}
			//console.log("who's turn is it?: " + turn.letter); 

			//check for a winner
			checkWinner(turn); 
			
			if (!singlePlayerMode) {
				if (turn.letter == p1.letter) {
					turn = p2; 
				} else {
					turn = p1; 
				}
			}	
		}			 
	});	
}

function checkWinner(player) {
	if (winning(originalBoard, player.letter) && emptyIndexies(originalBoard).length == 0 || winning(originalBoard, player.letter)) {
		$(".mainMessage").html("<div><h2 id='win'>" + player.name + " wins!</h2></div><p>Would you like to play again?</p>");
		popup.fadeIn(350);  
	}

	//check for a tie
	else if (emptyIndexies(originalBoard).length == 0) { 
		$(".mainMessage").html("<div><h2>We have a draw!</h2></div><p>Would you like to play again?</p>");
		popup.fadeIn(350);  
	}
}
/*
 *
 * MINIMAX ALGORITHM FOR UNBEATABLE AI
 *
 */
 function minimax(newBoard, player) {

 	//available spots  
 	//emptyIndexies() returns the available spots on the board in an array
 	var availSpots = emptyIndexies(newBoard); 

 	//base cases: win, lose, tie
 	if (winning(newBoard, huPlayer.letter)) {
 		return {score: -10};
 	}
 	else if (winning(newBoard, aiPlayer.letter)) {
 		return {score: 10}; 
 	}
 	else if (availSpots.length === 0) {
 		return {score: 0}; 
 	}
 
 	//an array to collect all the objects
 	var moves = []; 

 	//loop through available spots
 	for (var i = 0; i < availSpots.length; i++) {
 		//create an object for each and store the index of that spot
 		var move = {}; 
 		move.index = newBoard[availSpots[i]]; 

 		//set the empty spot to the current player
 		newBoard[availSpots[i]] = player; 

 		//collect the score results from calling minimax on opponent of current player
 		if (player == aiPlayer.letter) {
 			var result = minimax(newBoard, huPlayer.letter); 
 			move.score = result.score; 
 		} else {
 			var result = minimax(newBoard, aiPlayer.letter); 
 			move.score = result.score; 
 		}

 		//reset the spot to empty
 		newBoard[availSpots[i]] = move.index;

 		//push the object to the array
 		moves.push(move); 
 	}

 	//if it's the computer's turn, loop over the moves and choose the move w/ the highest score
 	var bestMove; 
 	if (player === aiPlayer.letter) {
 		var bestScore = -10000; 
 		for (var i = 0; i < moves.length; i++) {
 			if (moves[i].score > bestScore) {
 				bestScore = moves[i].score; 
 				bestMove = i; 
 			}
 		}
 	} else { //else loop over the moves and choose the move w/ lowest score
 		var bestScore = 10000; 
 		for (var i = 0; i < moves.length; i++) {
 			if (moves[i].score < bestScore) {
 				bestScore = moves[i].score; 
 				bestMove = i; 
 			}
 		}
 	}

 	//returns the chosen move (object) from the array to the higher depth
 	return moves[bestMove]; 

 }

//aiPlayer's turn
function computerTurn() {
	//computer goes first (for now) --> get best move with minimax
	var bestMove = minimax(originalBoard, aiPlayer.letter); 
	
	//get table value
	var tableValue = "[value=" + bestMove.index + "]"; 

	//add class for stylings
	$(tableValue).addClass(aiPlayer.weapon); 
	$(tableValue).css(undoStyles); 
	$(tableValue).html('<i class="fa fa-' + aiPlayer.weapon + '" aria-hidden="true"></i>');

	//add computer's move from object returned from minimax 
	originalBoard[bestMove.index] = aiPlayer.letter;  

	//check for a winner
	checkWinner(aiPlayer); 
}

// returns the available spots on the board in an array
function emptyIndexies(board){
	return board.filter(s => s != "O" && s != "X");
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
    } else {
        return false;
    }
}

