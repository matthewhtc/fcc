var ans;
var x = [];

$('.btn').click(function() {
    $('#display').append($(this).attr("value"));
});

$('.number-btn').click(function() {
    x.push(+$(this).attr("value")); //'+' turns string into number
});

$('.operator').click(function() { //add function 
    x.push($(this).attr("value"));
});

$('#add').click(function() {
	x.push('*'); 
}); 

$('#equal').click(function() {
    ans = x.join("");
    ans = eval(ans);
    //console.log(ans);
    $('#display').append(ans);
})

$('.clear-btn').click(function() {
    x = [];
    $('#display').empty();
});