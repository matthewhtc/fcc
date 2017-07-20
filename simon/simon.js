var colourArr = ["top-left", "top-right", "bottom-left", "bottom-right"]; 
var userAnswer = [];
var rightAnswer = []; 
var x = [1, 2, 3];
var y = [1, 2, 3]; 
var counter = 1; 
var randomIndex; 

function playColours(index) {
	userAnswer = []; 
	console.log("index: " + index); 
	rightAnswer.push(index); 
	$("." + colourArr[index]).addClass(colourArr[index] + "-active"); 
	
	//unplay the colour 800ms later
	setTimeout(function() {
		$("." + colourArr[index]).removeClass(colourArr[index] + "-active"); 
		
	}, 800); 

	var pineapple = setTimeout(function() {
		playColours(getRandom(0, 3)); 
	}, 2000);
	counter++; 
	console.log(counter); 
	console.log("rightAnswer array: " + rightAnswer); 

	if (counter == 4) {
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


randomIndex = getRandom(0, 3); 
// console.log(x); 
//play it
// console.log("are the arrays the same?: " + isArrSame()); 
playColours(randomIndex);

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
	//get number value from colour, get corresponding colour name from array
	userAnswer.push(Number($(this).attr("value")));
	var className = colourArr[Number($(this).attr("value"))];
	$(this).addClass(className + "-active"); 
	setTimeout(function() {
		$("." + className).removeClass(className + "-active"); 
	}, 300); 

	console.log("userAnswer array: " + userAnswer); 
	if (userAnswer.length == rightAnswer.length && isArrSame(rightAnswer, userAnswer)) {
		console.log("goodbye world");
		
	}

}); 


//after each iteration, add 1, so that you can play 2, then 3, ... sounds

//speed up at 5, 9, 13