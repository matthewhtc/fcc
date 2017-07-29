var colourObjArr = [
	{
		name: "top-left", 
		sound: "audio-green"
	},
	{
		name: "top-right", 
		sound: "audio-red"
	},
	{
		name: "bottom-left", 
		sound: "audio-yellow"
	},
	{
		name: "bottom-right", 
		sound: "audio-blue"
	}
];

var userAnswer = []; 
var rightAnswer = []; 
var userTryAgain = false; 
var counter = 0; 
var answerCounter = 0; 
var iteration = 1;
var winningIteration = 20; 
var speed = 1850; 
var pineapple; 
var strictMode = false; 

/*
 * UTILITY FUNCTIONS
 *
 */
function resetGame() {
	clearTimeout(pineapple); 
	userAnswer = [];
	rightAnswer = []; 
	userTryAgain = false; 
	counter = answerCounter = 0; 
	iteration = 1; 
	speed = 1850; 
}

function startGame() {
	clearTimeout(pineapple); 
	// start the game || restart
	$(".quarter").off("mouseup", temp);
	
	$(".quarter").removeClass("pointer"); 

	$("#counterDisplay").html("--"); 
	 // note: bug somewhere here... test tmr this: click restart during playback, then click another colour.
	pineapple = setTimeout(function() {
		resetGame();
		playColours();
	}, 1800); 
}

function turnOffGame() {
	// TURN OFF THE GAME!!! aka clearTimeout
	clearTimeout(pineapple); 

	// turn off the buttons if the switch is off
	$(".start-button").off("click");
	$(document).off("click", ".strict-button");
	$(".strict-button").off("click");
	$(".start-button").off("mouseup");

	// clear display in counter
	$("#counterDisplay").toggleClass("counter-display-off"); 
	$("#counterDisplay").html("--"); 

	// disable clicking colours
	$(".quarter").off("mouseup", temp);
	$(".quarter").removeClass("pointer"); 

	// if strict button is on, turn it off 
	$(".strict-button").removeClass("strict-button-active");
}

function isArrSame(arr1, arr2) {
	// compare lengths - can save a lot of time 
    if (arr1.length != arr2.length) {
        return false;
    }

	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false; 
		}
	}
	return true; 
}

function getRandom(min, max) {
	// math.random() returns a number between 0 and 1 exclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this function does all the validation if user input is correct or not
function temp() {
	// get number value from colour, get corresponding colour name from array
	userAnswer.push(Number($(this).attr("value")));

	var className = colourObjArr[Number($(this).attr("value"))].name;
	$(this).addClass(className + "-active"); 

	// play sound
	var userSound = document.getElementById(colourObjArr[Number($(this).attr("value"))].sound);
	userSound.play();

	setTimeout(function() {
		$("." + className).removeClass(className + "-active"); 		
	}, 300); 

	// check if user's input matches the computer
	if (userAnswer[answerCounter] == rightAnswer[answerCounter]) {
		answerCounter++; 
		console.log("answerCounter: " + answerCounter); 
		if (userAnswer.length == rightAnswer.length) {
			console.log("userAnswer: " + userAnswer);

			//check if the arrays's contents are the same
			if (isArrSame(rightAnswer, userAnswer)) {
				// again, disable for crazy users who will spam click
				$(".quarter").off("mouseup", temp);
				$(".quarter").removeClass("pointer"); 
				console.log("hello, world!");

				// check for winner
				if (iteration == winningIteration) {
					// play celebratory winning sound
					document.getElementById("audio-celebrate").play();

					// display a message tell the user that they won
					$("#counterDisplay").html("YOU");
					setTimeout(function() {
						$("#counterDisplay").html("WIN!");
					}, 800);

					// restart the game
					resetGame();
				} else {
					// reset counter, increment iteration, and reset userAnswer/rightAnswer array
					counter = answerCounter = 0; 
					iteration++; 
					userAnswer = []; 
					userTryAgain = false; 
				}
				
				// start next iteration of Simon
				pineapple = setTimeout(playColours, 3250);
			} 
		}
	} else { // if they don't match, then it's wrong
			console.log("goodbye, world :("); 
			// disable click for users in case they do something stupid and rage quit/click
			$(".quarter").off("mouseup", temp);
			$(".quarter").removeClass("pointer"); 
			// play error sound & display error in display
			var userSound = document.getElementById("audio-error");
			userSound.play();
			$("#counterDisplay").html("!!"); // displaying

			// if strict mode, restart with new pattern set
			if(strictMode) {
				resetGame(); 
			} else {
				// set up stuff if the user gets it wrong
				userAnswer = []; 
				counter = 0; 
				userTryAgain = true; 
			}

			// redisplay what iteration user is on in counter display
			setTimeout(function() {
				$("#counterDisplay").html(iteration);
			}, 1500);

			answerCounter = 0; 
			//	 play the button presses again for the user 
			pineapple = setTimeout(playColours, 3500);
	}	
}

function playColours() {
	console.log("current speed: " + speed); 
	$(".quarter").off("mouseup", temp);
	$(".quarter").removeClass("pointer"); 
	index = getRandom(0, 3); 

	if (counter == 0 && userTryAgain == false) {
		rightAnswer.push(index); 
	}
	//change speeds at 5th, 9th, and 13th iteration
	if ((iteration == 5 || iteration == 9 || iteration == 13) && counter == 0 && userTryAgain == false) {
		console.log("speed: " + speed); 
		speed -= 250;  
	}
	
	// update what count it is, for the user, in the countDisplay
	$("#counterDisplay").html(iteration); 

	console.log("counter: " + counter + "\niteration: " + iteration); 
	console.log("rightAnswer: " + rightAnswer); 
	
	// play the colour
	$("." + colourObjArr[rightAnswer[counter]].name).addClass(colourObjArr[rightAnswer[counter]].name + "-active"); 
	
	// play sound
	var sound = document.getElementById(colourObjArr[rightAnswer[counter]].sound);
	sound.play();

	// unplay the colour 800ms later
	setTimeout(function() {
		$("." + colourObjArr[rightAnswer[counter]].name).removeClass(colourObjArr[rightAnswer[counter]].name + "-active"); 	

		counter++; 

	}, 500); 

	pineapple = setTimeout(playColours, speed);

	//ends the "playing" from the computer
	if (counter == iteration - 1) {
		clearTimeout(pineapple); 
		setTimeout(function() {
			$(".quarter").on("mouseup", temp);
			$(".quarter").addClass("pointer"); 
		}, 1250); 
	}
}

/*
 * EVENT LISTENERS
 *
 */

// input checkbox event listener
$('input[type=checkbox]').change(function() {

	if (this.checked) { // check if the input has been 'checked'
		// display something in the counterDisplay to signify that game is on
		$("#counterDisplay").toggleClass("counter-display-off"); 
		$("#counterDisplay").html("--"); 

		// basically reset all parameters just in case
		resetGame(); 

		// enable start and strict button event listener
		$(".start-button").on("click", function() {
			startGame(); 		
		}); 	

		// strict button event listener
		$(document).on("click", ".strict-button", function() {
			strictMode = !strictMode; 
		}); 

		/*
		 * changing background colour on click
		 */
		$(".strict-button").on("click", function() {
			$(this).toggleClass("strict-button-active");
		});

		$(".start-button").on("mouseup", function() {
			$(".start-button").toggleClass("start-button-active");

			setTimeout(function() {
				$(".start-button").toggleClass("start-button-active"); 
			}, 300);
		});

	} else { // otherwise, the game is off
			turnOffGame(); 
	}
});

