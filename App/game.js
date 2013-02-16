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

var offset = $('#game_canvas').offset();
var player = new Player();
var backgrounds = new Array();
var isLoaded = false;
var soundsLoaded = false;
var soundsEnabled = true;
var isHardMode = false;
var previousBackground = -1;
var soundsWerePlayingBeforePause = new Array();

/*
*	Game States
*/

function PreloadGame() {
	this.isActiveScreen = true;
	
	this.setup = function() {
		console.log("PreloadGame.setup()");
		
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
		
		InitSound("bomb_explosion");
		InitSound("bomb_falling");
		InitSound("building_collapse");
		InitSound("plane_crash");
		InitSound("plane_explosion");
		
		$("audio").bind("pause", function() {
			this.currentTime = 0;
		});
		
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
		if (!this.isActiveScreen) return;
		if (isLoaded && this.isActiveScreen) {
			this.isActiveScreen = false;
			LoadMuteState();
			jaws.switchGameState(MenuScreen);
		}
	}
	
	this.draw = function() {
		if (!this.isActiveScreen) return;
	}
}

function Player() {
	this.currentScore = 0;
	this.currentLevel = 1;		// range = 1..12
	this.highscores = new Array();
	this.negativeRecord = new HighScoreItem("-- Mr. Maß --", -10000, 1, false);
	this.scoretimer = 0;
	this.multiplier = 1;
	
	for (var i = 0; i < 10; i++) {
		this.highscores[i] = new HighScoreItem("-- Bomber Troll --", 1000 * (i+1), 1, false);
	}
	
	if (localStorage['highscores'] == null) {
		localStorage['highscores'] = JSON.stringify(this.highscores);
	} else {
		this.highscores = JSON.parse(localStorage['highscores']);
	}
	
	if (localStorage['negativeRecord'] == null) {
		localStorage['negativeRecord'] = JSON.stringify(this.negativeRecord);
	} else {
		this.negativeRecord = JSON.parse(localStorage['negativeRecord']);
	}
	
	this.getNegativeRecord = function() {
		return this.negativeRecord;
	}
	
	this.setNegativeRecord = function(item) {
		this.negativeRecord = item;
		localStorage['negativeRecord'] = JSON.stringify(this.negativeRecord);
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

// --- SOUND MANAGEMENT --- //

function SaveMuteState() {
	localStorage['muteState'] = JSON.stringify(!soundsEnabled);
	console.log("Mute state saved as " + !soundsEnabled);
}

function LoadMuteState() {
	if (localStorage['muteState'] == null) {
		SaveMuteState();
	}
	soundsEnabled = !JSON.parse(localStorage['muteState']);
	console.log("Mute state loaded as " + !soundsEnabled);
}

function InitSound(html_id) {
	console.log("Loading sound " + html_id);
	if (!! document.getElementById(html_id).currentSrc) {
		jaws.assets.add(document.getElementById(html_id).currentSrc);
		console.log(document.getElementById(html_id).currentSrc + " is loaded");
	} else {
		soundsLoaded = false;
		console.warn(document.getElementById(html_id).currentSrc + " is not loaded");
	}
}

function isPlaying(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		return !document.getElementById(html_id).paused;
	} else {
		return false;
	}
}

function PlaySound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		StopSound(html_id);
		document.getElementById(html_id).play();
		document.getElementById(html_id).volume = 0.3;
		document.getElementById(html_id).muted = !soundsEnabled;
		console.log("Playing sound " + document.getElementById(html_id).currentSrc);
	}
}

function MuteSound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		document.getElementById(html_id).muted = true;
		console.log("Sound " + document.getElementById(html_id).currentSrc + " is muted");
	}
}

function UnmuteSound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		document.getElementById(html_id).muted = false;
		console.log("Sound " + document.getElementById(html_id).currentSrc + " is unmuted");
	}
}

function StopSound(html_id) {
	if (soundsLoaded && (!! document.getElementById(html_id))) {
		document.getElementById(html_id).pause();
		console.log("Sound " + document.getElementById(html_id).currentSrc + " is stopped");
	}
}

function _RegisterAndPauseSound(html_id) {
	if (isPlaying(html_id)) {
		soundsWerePlayingBeforePause[soundsWerePlayingBeforePause.length] = html_id;
		StopSound(html_id);
	}
}

function PauseAllSounds() {
	soundsWerePlayingBeforePause = new Array();
	$("audio").unbind("pause");
	
	_RegisterAndPauseSound("menu_music");
	_RegisterAndPauseSound("ingame_music");
	_RegisterAndPauseSound("landing_music");
	_RegisterAndPauseSound("crashed_music");
	_RegisterAndPauseSound("bomb_explosion");
	_RegisterAndPauseSound("bomb_falling");
	_RegisterAndPauseSound("building_collapse");
	_RegisterAndPauseSound("plane_crash");
	_RegisterAndPauseSound("plane_explosion");
}

function ContinueAllSounds() {
	for (i=0; i<soundsWerePlayingBeforePause.length; i++) {
		PlaySound(soundsWerePlayingBeforePause[i]);
	}
	
	soundsWerePlayingBeforePause = new Array();
	$("audio").bind("pause", function() {
		this.currentTime = 0;
	});
}

function StopBackgroundSounds() {
	StopSound("menu_music");
	StopSound("ingame_music");
	StopSound("landing_music");
	StopSound("crashed_music");
}

function StopAllSounds() {
	StopBackgroundSounds();
	StopSound("bomb_explosion");
	StopSound("bomb_falling");
	StopSound("building_collapse");
	StopSound("plane_crash");
	StopSound("plane_explosion");
}

function DisableSounds() {
	soundsEnabled = false;
	SaveMuteState();
	
	MuteSound("menu_music");
	MuteSound("ingame_music");
	MuteSound("landing_music");
	MuteSound("crashed_music");
	
	MuteSound("bomb_explosion");
	MuteSound("bomb_falling");
	MuteSound("building_collapse");
	MuteSound("plane_crash");
	MuteSound("plane_explosion");
}

function EnableSounds() {
	soundsEnabled = true;
	SaveMuteState();
	
	UnmuteSound("menu_music");
	UnmuteSound("ingame_music");
	UnmuteSound("landing_music");
	UnmuteSound("crashed_music");
	
	UnmuteSound("bomb_explosion");
	UnmuteSound("bomb_falling");
	UnmuteSound("building_collapse");
	UnmuteSound("plane_crash");
	UnmuteSound("plane_explosion");
}