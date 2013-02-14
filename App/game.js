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
var soundsLoaded = false;
var soundsEnabled = true;
var isHardMode = false;
var previousBackground = -1;

/*
*	Game States
*/

function PreloadGame() {

	this.setup = function() {
		jaws.assets.add("images/bomba.png");
		jaws.assets.add("images/airplane.png");
		jaws.assets.add("images/cloud-th.png");
		
		// --- Load Sounds ---
		
		console.log("Loading sounds...");
		soundsLoaded = true;		// this will become false if any of the sounds below cannot be loaded
		InitSound("menu_music");
		InitSound("ingame_music");
		InitSound("landing_music");
		InitSound("crashed_music");
		
		// -------------------
		
		backgrounds[backgrounds.length] = new Background("backgrounds/day1.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/day2.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/day3.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/day4.jpg", true);
		backgrounds[backgrounds.length] = new Background("backgrounds/night1.jpg", false);
		backgrounds[backgrounds.length] = new Background("backgrounds/night2.jpg", false);
		backgrounds[backgrounds.length] = new Background("backgrounds/night3.jpg", false);
		backgrounds[backgrounds.length] = new Background("backgrounds/night4.jpg", false);
		
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
	this.scoretimer = 0;
	
	for (var i = 0; i < 10; i++) {
		this.highscores[i] = new HighScoreItem("- senki -", 0, 1, false);
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
			return new HighScoreItem("- senki -", 0, 1, false);
		}
	}
	
	
	this.getHighestHighscore = function() {
		if (this.highscores.length > 0) {
			return this.highscores[0];
		} else {
			return new HighScoreItem("- senki -", 0, 1, false);
		}
	}
}

function HighScoreItem(name, score, level, mode) {
	this.name = name;
	this.score = score;
	this.level = level;
	this.mode = mode;
}

function Background(file, isDaytime) {
	this.file = file;
	this.isDaytime = isDaytime;
	jaws.assets.add(file);
}

function InitSound(html_id) {
	console.log("Loading sound " + html_id);
	if (!! document.getElementById(html_id).currentSrc) {
		jaws.assets.add(document.getElementById(html_id).currentSrc);
		console.log(document.getElementById(html_id).currentSrc + " is loaded");
		document.getElementById(html_id).addEventListener("pause", function() {
			this.currentTime = 0;
		});
	} else {
		soundsLoaded = false;
		console.warn(document.getElementById(html_id).currentSrc + " is not loaded");
	}
}

function PlaySound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id)) && soundsEnabled) {
		document.getElementById(html_id).play();
		console.log("Playing sound " + document.getElementById(html_id).currentSrc);
	}
}

function StopSound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		document.getElementById(html_id).pause();
		console.log("Sound " + document.getElementById(html_id).currentSrc + " is stopped");
	}
}

function StopBackgroundSounds() {
	StopSound("menu_music");
	StopSound("ingame_music");
}

function DisableSounds() {
	soundsEnabled = false;
	StopBackgroundSounds();
}

function EnableSounds() {
	soundsEnabled = true;
}