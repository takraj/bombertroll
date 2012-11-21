/*********************************/
/*          BOMBER TROLL         */
/*          ------------         */
/*           HTML5 game          */
/*            by TakRaj          */
/*                               */
/* Based on Bomber Run C64 game  */
/*      created by Les Allan     */
/*               & Angus Ager    */
/*********************************/

/*
*	Global Variables
*/
var prevousUpdateTime;
var currentUpdateTime;
var airplane;
var buildings;

/*
*	Game Objects
*/
function Airplane(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.velocity = 100;
	this.go_right = true;
	
	this.draw = function() {
		jaws.context.fillStyle = "rgb(150,29,28)";
		jaws.context.fillRect (this.x, this.y, this.width, this.height);
	}
	
	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}
	
	this.step = function(diff)
	{
		if (this.x > 800) {
			this.go_right = false;
		}
		else if (this.x < -this.width) {
			this.go_right = true;
		}
		
		if (this.go_right) {
			this.x += this.velocity * (diff/1000);
		} else {
			this.x -= this.velocity * (diff/1000);
		}
	}
}

function Building(x, width, height) {
	this.x = x;
	this.y = jaws.context.canvas.height - height;
	this.width = width;
	this.height = height;
	this.rgbString = "rgb(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(128 * Math.random()) + ")";
	
	this.draw = function() {
		jaws.context.fillStyle = this.rgbString;
		jaws.context.fillRect(this.x, this.y, this.width, this.height);
	}
}

/*
*	Game States
*/
function BomberTroll() {
	/* Called once. Put your one-time initializing here. */
	this.setup = function() {
		prevousUpdateTime = new Date().getTime();
		currentUpdateTime = prevousUpdateTime;
		
		airplane = new Airplane(0, 15, 70, 30)
		buildings = new Array();
		
		for (var i = 0; i < 16; i++) {
			buildings[i] = new Building(i*50, 50, Math.random() * 200 + 50);
		}
	}
	
	/* Called each gametick. Put your gamelogic here. */
	this.update = function() {
		currentUpdateTime = new Date().getTime();
		var diff = currentUpdateTime - prevousUpdateTime;
		
		airplane.step(diff);
		
		prevousUpdateTime = currentUpdateTime;
		jaws.log(diff, false);
	}
	
	/* Called each gametick after update(). Put your drawing here. */
	this.draw = function() {
		jaws.clear();
		airplane.draw();
		
		for (var i = 0; i < buildings.length; i++) {
			buildings[i].draw();
		}
	}
}

/*
*	MAIN
*/
jaws.start(BomberTroll, {fps: 30})
