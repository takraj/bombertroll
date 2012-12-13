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

var player = new Player();
var backgrounds = new Array();
var isLoaded = false;

/*
*	Game States
*/

function PreloadGame() {

	this.setup = function() {
		jaws.assets.add("images/bomba.png");
		jaws.assets.add("images/airplane.png");
		jaws.assets.add("images/cloud-th.png");
		
		backgrounds[backgrounds.length] = new Background("backgrounds/day1.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/day2.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/day3.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/night1.jpg", false);
		backgrounds[backgrounds.length] = new Background("backgrounds/night2.jpg", false);
		backgrounds[backgrounds.length] = new Background("backgrounds/night3.jpg", false);
		
		jaws.assets.loadAll({onfinish: function() {
			isLoaded = true;
		}});
	}
	
	this.update = function() {
		if (isLoaded) {
			jaws.start(MenuScreen, {fps: 30});
		}
	}
	
	this.draw = function() {
	}
}

function Player() {
	this.currentScore = 0;
	this.currentLevel = 1;		// range = 1..12
	this.highscores = new Array();
	
	for (var i = 0; i < 10; i++) {
		this.highscores[i] = new HighScoreItem("- senki -", 0);
	}
	
	if (localStorage['highscores'] == null) {
		localStorage['highscores'] = JSON.stringify(this.highscores);
	} else {
		this.highscores = JSON.parse(localStorage['highscores']);
	}
	
	// eleve rendezetten, ez sokat segít
	this.addHighScore = function(item) {
		updatedList = new Array();
		added = false;
		for (var i = 0; (i < this.highscores.length) && (updatedList.length < 10); i++) {
			if ((!added) && (item.score >= this.highscores[i].score)) {
				added = true;
				updatedList[updatedList.length] = item;
			}
			if (updatedList.length < 10) {
				updatedList[updatedList.length] = this.highscores[i];
			}
		}
		
		this.highscores = updatedList;
		localStorage['highscores'] = JSON.stringify(this.highscores);
	}
	
	this.getLowestHighscore = function() {
		if (this.highscores.length > 0) {
			return this.highscores[this.highscores.length-1];
		} else {
			return new HighScoreItem("- senki -", 0);
		}
	}
	
	
	this.getHighestHighscore = function() {
		if (this.highscores.length > 0) {
			return this.highscores[0];
		} else {
			return new HighScoreItem("- senki -", 0);
		}
	}
}

function HighScoreItem(name, score) {
	this.name = name;
	this.score = score;
}

function Background(file, isDaytime) {
	this.file = file;
	this.isDaytime = isDaytime;
	jaws.assets.add(file);
}
