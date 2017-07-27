var colourArr = ["top-left", "top-right", "bottom-left", "bottom-right"]; 
var userAnswer = []; 
var rightAnswer = []; 
var counter = 0; 
var iteration = 0;
var randomIndex; 
var speed = 2000; 

// input checkbox event listener
$('input[type=checkbox]').change(function() {
	
	if (this.checked) {
		// enable start and strict button event listener
		$(document).on("click", "#startButton", function() {
			console.log("clicked start button!"); 
		}); 	

		$(document).on("click", "#strictButton", function() {
			console.log("clicked strict button!"); 
		}); 
	} else {
		//turn off the buttons if the switch is off
		$(document).off("click", "#startButton");
		$(document).off("click", "#strictButton");
	}
});

function playColours() {

	index = getRandom(0, 3); 

	if (counter == 0) {
		rightAnswer.push(index); 
	}
	//change speeds at 5th, 9th, and 13th iteration
	if ((iteration == 4 || iteration == 8 || iteration == 12) && counter == 0) {
		console.log("===============\nSPEED CHANGE!\n==============="); 
		speed -= 250;
		console.log("speed in ms: " + speed);  
	}
	
	console.log("counter: " + counter + "\niteration: " + iteration); 
	console.log("rightAnswer: " + rightAnswer); 
	// console.log("rightAnswer[counter] before setTimeout: "  + rightAnswer[counter]);
	// console.log("colourArr[rightAnswer[counter]]: " + rightAnswer[counter]);
	
	// play the colour
	$("." + colourArr[rightAnswer[counter]]).addClass(colourArr[rightAnswer[counter]] + "-active"); 
	
	// unplay the colour 800ms later
	setTimeout(function() {
		// console.log("counter in setTimeout: " + counter); 
		// console.log("rightAnswer in setTimeout: " + rightAnswer); 
		// console.log("rightAnswer[counter] in setTimeout: " + rightAnswer[counter]);
		$("." + colourArr[rightAnswer[counter]]).removeClass(colourArr[rightAnswer[counter]] + "-active"); 	

		counter++; 

	}, 500); 

	var pineapple = setTimeout(function() {
		playColours(); 
	}, speed);

	//ends the "playing" from the computer
	if (counter == iteration) {
		clearTimeout(pineapple); 
	}
}

function getRandom(min, max) {
	//if you ever don't understand this math, just think about the math again
	//rmb that math.random() returns a number between 0 and 1 exclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//continuously play colours

//each colour squares will be given a value from 0 to 3
//randomize it

playColours();

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
	
$(".quarter").on("mouseup", function(event) {
	// get number value from colour, get corresponding colour name from array
	userAnswer.push(Number($(this).attr("value")));

	var className = colourArr[Number($(this).attr("value"))];
	$(this).addClass(className + "-active"); 

	setTimeout(function() {
		$("." + className).removeClass(className + "-active"); 

		
	}, 300); 

	if (userAnswer.length == rightAnswer.length) {
		console.log("userAnswer: " + userAnswer);
		if (isArrSame(rightAnswer, userAnswer)) {
			console.log("hello, world!");
		} else {
			console.log("goodbye, world :("); 
		}
		
		// reset counter, increment iteration, and reset userAnswer/rightAnswer array
		counter = 0; 
		iteration++; 
		userAnswer = []; 

		// start next iteration of Simon
		setTimeout(playColours, 2000);
	}
}); 

// speed up at 5, 9, 13