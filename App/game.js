/*
* Global variables
*/

var is_document_ready = false;
var context = null;

/*
* Init
*/

$(document).ready(function() {
	context = document.getElementById("game_canvas").getContext("2d");
	context.width = $("#game_canvas").width();
	context.height = $("#game_canvas").height();
	jc.start("game_canvas");
	$("#game_canvas").click(canvas_click);
	is_document_ready = true;
	game_loop();
});

/*
* Event handlers
*/

function canvas_click(event) {
	// Get element offset
	var posX = Math.round(event.pageX - $(this).offset().left);
	var posY = Math.round(event.pageY - $(this).offset().top);
	
	// handle
	draw();
	
	// return false as successful handling
	return false;
}

/*
* Game functions
*/

var px = 0;
var py = 0;

function draw() {
	jc.clear();
	jc.rect(px++,py++,50,60,1);
	jc.start("game_canvas");
}

function game_loop() {
	draw();
	setTimeout(game_loop, 1000/30);
}
