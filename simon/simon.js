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
var userTryAgain = false; 
var rightAnswer = []; 
var counter = 0; 
var answerCounter = 0; 
var iteration = 1;
var winningIteration = 3; 
var randomIndex; 
var speed = 1750; 
var pineapple; 
var strictMode = false; 

/*
 * UTILITY FUNCTIONS
 *
 */
function resetGame() {
	userAnswer = [];
	rightAnswer = []; 
	counter = answerCounter = 0; 
	iteration = 1; 
	speed = 2000; 
	userTryAgain = false; 
	strictMode = false; 
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
	//if you ever don't understand this math, just think about the math again
	//rmb that math.random() returns a number between 0 and 1 exclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

	if (userAnswer[answerCounter] == rightAnswer[answerCounter]) {
		answerCounter++; 
		if (userAnswer.length == rightAnswer.length) {
			console.log("userAnswer: " + userAnswer);

			//check if the arrays's contents are the same
			if (isArrSame(rightAnswer, userAnswer)) {
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
				setTimeout(playColours, 3500);
			} 
		}
	} else { // if they don't match, then it's wrong
			$("#counterDisplay").html("!!"); 

			// play error sound
			var userSound = document.getElementById("audio-error");
			userSound.play();

			console.log("goodbye, world :("); 

			// redisplay what iteration user is on in counter display
			setTimeout(function() {
				$("#counterDisplay").html(iteration);
			}, 1500);

			// if strict mode, restart with new pattern set
			if(strictMode) {
				userAnswer = [];
				rightAnswer = []; 
				counter = 0; 
				iteration = 1; 
				speed = 2000; 
			} else {
				// set up stuff if the user gets it wrong
				userAnswer = []; 
				counter = 0; 
				userTryAgain = true; 
			}
			
			answerCounter = 0; 
			//	 play the button presses again for the user 
			setTimeout(playColours, 3500);
	}	
}

function playColours() {
	$(".quarter").off("mouseup", temp);
	index = getRandom(0, 3); 

	if (counter == 0 && userTryAgain == false) {
		rightAnswer.push(index); 
	}
	//change speeds at 5th, 9th, and 13th iteration
	if ((iteration == 5 || iteration == 9 || iteration == 13) && counter == 0) {
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

	pineapple = setTimeout(function() {
		playColours(); 
	}, speed);

	//ends the "playing" from the computer
	if (counter == iteration - 1) {
		clearTimeout(pineapple); 
		$(".quarter").on("mouseup", temp);
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
		$("#counterDisplay").html("--"); 

		// enable colour buttons
		$(".quarter").on("mouseup", temp); 

		// basically reset all parameters just in case
		resetGame(); 

		// enable start and strict button event listener
		$(document).on("click", ".start-button", function() {
			console.log("clicked start button!"); 

			// start the game
			playColours();
			$(".start-button").addClass("start-button-active");
			// turn off the button right away cuz only need to play it once
			$(document).off("click", ".start-button");
		}); 	

		// strict button event listener
		$(document).on("click", ".strict-button", function() {
			console.log("clicked strict button!"); 
			strictMode = true; 
		}); 

		/*
		 * changing background colour on click
		 */
		$(".strict-button").on("click", function() {
			$(this).toggleClass("strict-button-active");
		});

		$(".start-button").on("mouseup", function() {
			$(this).addClass("start-button-active");

			setTimeout(function() {
				$(".start-button").removeClass("start-button-active"); 
			}, 300);
		});

	} else { // otherwise, the game is off

		// TURN OFF THE GAME!!! aka clearTimeout
		clearTimeout(pineapple); 

		// turn off the buttons if the switch is off
		$(document).off("click", ".start-button");
		$(document).off("click", ".strict-button");
		$(".strict-button").off("click");
		$(".start-button").off("mouseup");

		// clear display in counter
		$("#counterDisplay").empty(); 

		// disable clicking colours
		$(".quarter").off("mouseup");

		// if strict button is on, turn it off 
		$(".strict-button").removeClass("strict-button-active");
	}
});

