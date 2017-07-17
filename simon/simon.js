var count = 1; 



function getRandom(min, max) {
	//if you ever don't understand this math, just think about the math again
	//rmb that math.random() returns a number between 0 and 1 exclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//each colour squares will be given a value from 0 to 3
//randomize it
$(document).on("mousedown mouseup", ".top-left", function() {
	console.log(Number($(this).attr("value")));
	$(this).toggleClass("top-left-active"); 
}); 

$(document).on("mousedown mouseup", ".top-right", function() {
	console.log(Number($(this).attr("value")));
	$(this).toggleClass("top-right-active"); 
}); 

$(document).on("mousedown mouseup", ".bottom-left", function() {
	console.log(Number($(this).attr("value")));
	$(this).toggleClass("bottom-left-active"); 
}); 

$(document).on("mousedown mouseup", ".bottom-right", function() {
	console.log(Number($(this).attr("value")));
	$(this).toggleClass("bottom-right-active"); 
}); 


//play it 

//after each iteration, add 1, so that you can play 2, then 3, ... sounds

//speed up at 5, 9, 13