var timer, minutes, seconds, studyTime, breakTime; 
var isPaused = false; 
var pomodoroing = false; 
var studying = true; 
var x; 
var display = $("#display"); 

//hover effect for name 
$("#name").mouseenter(function() {

	$(this).css("color", "#ff4b1f");
});

$("#name").mouseleave(function() {
	$(this).css("color", " 	#eaf0f7");
});

//you can only add a listener on elements that exists when it runs the first time. 
//so it needs to be on document, or ul parent.
$(document).on("click", "#minusSessionBtn", function() {
	//console.log('u have clicked the minusSessionBtn'); 
	if (Number($("#secondarySessionDisplay").text()) > 1) {
		var temp = Number($("#secondarySessionDisplay").text()); 
		--temp;  	
		$("#secondarySessionDisplay").text(temp); 
		
	}
});

$(document).on("click", "#plusSessionBtn", function() {
	//console.log('u have clicked the plusSessionBtn'); 	
	var temp = Number($("#secondarySessionDisplay").text()); 
	++temp;
	$("#secondarySessionDisplay").text(temp);  
});

$(document).on("click", "#minusBreakBtn", function() {
	if (Number($("#breakDisplay").text()) > 1) {
		var temp = Number($("#breakDisplay").text()); 
		--temp; 	
		$("#breakDisplay").text(temp); 
		
	}
});

$(document).on("click", "#plusBreakBtn", function() {
	var temp = Number($("#breakDisplay").text()); 
	++temp;
	$("#breakDisplay").text(temp);  
});	

$("#startBtn").on("click", function(event) {
	
	if (!isPaused) {
		$("#settings").fadeOut(200, function() {
			(this).remove(); 
		});
		event.stopPropagation(); //will stop event bubbling

		$("#settings").fadeIn(200, function() {
			$("#childContainer").toggleClass("displaySettings"); 
			$("#childContainer").append('<span id="display"><span>'); 
			
			
		});

		startStudying(); 

		$("#startBtn").html('<i class="fa fa-pause" aria-hidden="true"></i>'); 
	}
	else {
		clearInterval(x); 
		$("#startBtn").html('<i class="fa fa-play" aria-hidden="true"></i>'); 
	}
	isPaused = !isPaused; 
	
});

$("#resetBtn").on("click", function(event) {
	if (pomodoroing) {
		//console.log("clicked reset"); 
		pomodoroing = isPaused = false; 
		studying = true;
		clearInterval(x); 

		//a bunch of ugly code. this is just restoring the original + - buttons to adjust break and study time
		$("#display").fadeOut(1000, function() {
			(this).remove(); 

			$("#childContainer").fadeIn(1000, function() {
			
				$("#childContainer").append('<div id="settings"><div id="sessionLength"><span>Session</span><div class="incDec"><a href="#"><i id="minusSessionBtn" class="fa fa-minus" aria-hidden="true"></i></a> <span id="secondarySessionDisplay"> 25 </span> <a href="#"><i id="plusSessionBtn" class="fa fa-plus" aria-hidden="true"></i></a></div></div> <!--sessionLength--><div id="breakLength"><span>Break</span><div class="incDec"><a href="#"><i id="minusBreakBtn" class="fa fa-minus" aria-hidden="true"></i></a> <span id="breakDisplay"> 5 </span> <a href="#"><i id="plusBreakBtn" class="fa fa-plus" aria-hidden="true"></i></a></div></div> <!--breakLength--></div>'); 	
				$("#childContainer").toggleClass("displaySettings"); 
			});
		});
		event.stopPropagation(); //will stop event bubbling
	}
	

	

	$("#startBtn").html('<i class="fa fa-play" aria-hidden="true"></i>'); 
});

function startStudying() {
	//extract study and break times from user
	if (!pomodoroing) {	
		// timer = studyTime = Number($("#secondarySessionDisplay").text());
    	// breakTime = Number($("#breakDisplay").text());
    	timer = studyTime = Number($("#secondarySessionDisplay").text()) * 60; 
		breakTime = Number($("#breakDisplay").text()) * 60;
		pomodoroing = !pomodoroing; 
	}
	
	
	//start timer
	startTimer(timer, display); 
}

function startBreak() {
	
	//start timer
	startTimer(timer, display); 
}

function playSound() {
	var sound = document.getElementById("audio");
	sound.play();
}

function startTimer(duration, display) {
	  
	  timer = duration; 
    //console.log("duration in seconds	: " + duration); 
   
    x = setInterval(function() {

        minutes = parseInt(timer / 60, 10); //second parameter is to indicate base of number
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $("#display").html(minutes + " <span class='timeStyling'>Min</span> " + seconds + " <span class='timeStyling'>Sec</span>");

        if (--timer < 0) {
            timer = duration;
            clearInterval(x); 

            if (studying) { //start break 
            	//console.log('break'); 
            	timer = breakTime; 
            	//console.log("timer"); 
            	playSound(); 
            	startBreak();         	
            }
            else { //start studying
            	//console.log('study for how long?:' + studyTime);
            	timer = studyTime;  
            	startStudying(); 
            	 
            }
            studying = !studying;
            //console.log("studying?: " + studying); 
            
        }
    }, 1000);
}