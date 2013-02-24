/*************************
* BOMBER TROLL LOADER JS *
*************************/

// Configuration:
// --------------

var enable_engine_log = false;

// Helper Functions:
// -----------------

function is_mobile() {
	var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'armv7', 'armv6'];
	for (i in agents) {
		if (navigator.platform.toLowerCase().indexOf(agents[i]) > -1) {
			return true;
		}
	}
	return false;
}
var isMobileDevice = is_mobile();

function sync_HttpGetRequest(url, success_cb, other_cb) {
	console_log("Running sync_HttpGetRequest...");
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", url, false);
	xmlhttp.onreadystatechange = function() {
		try {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					success_cb(xmlhttp.responseText);
				} else {
					console_warn("sync_HttpGetRequest | Url = " + url + " | Status Code = " + xmlhttp.status);
					other_cb();
				}
			}
		} catch (e) {}
	}
	console_log("Sending sync_HttpGetRequest...");
	xmlhttp.send();
}

function include_audio(name, isMusic, loop) {
	var tag = document.createElement("audio");
	tag.setAttribute("id", name + (isMusic ? "_music" : ""));
	tag.setAttribute("preload", "auto");
	
	if (loop) {
		tag.setAttribute("loop", "loop");
	}
	
	var subtag1 = document.createElement("source");
	subtag1.setAttribute("type", "audio/mpeg");
	subtag1.setAttribute("src", (isMusic ? "music/" : "sfx/") + name + ".mp3");
	
	var subtag2 = document.createElement("source");
	subtag2.setAttribute("type", "audio/ogg");
	subtag2.setAttribute("src", (isMusic ? "music/" : "sfx/") + name + ".ogg");
	
	try {
		try {
			tag.appendChild(subtag1);
		} catch (e) {}
		try {
			tag.appendChild(subtag2);
		} catch (e) {}
		document.getElementsByTagName("body")[0].appendChild(tag);
	} catch (e) {}
}

function include_music(name, loop) {
	if (loop == null) {
		include_audio(name, true, true);
	} else {
		include_audio(name, true, loop);
	}
}

function include_sfx(name) {
	include_audio(name, false, false);
}

function include_js(name) {
	var tag = document.createElement("script");
	tag.setAttribute("type", "text/javascript");
	tag.setAttribute("src", name + ".js");
	
	try {
		document.getElementsByTagName("body")[0].appendChild(tag);
	} catch (e) {}
}

function create_engine_log() {
	try {
		var tag = document.createElement("div");
		
		var subtag1 = document.createElement("h3");
		subtag1.innerHTML = "jaws log";
		tag.appendChild(subtag1);
		
		var subtag2 = document.createElement("div");
		subtag2.setAttribute("id", "jaws-log");
		subtag2.innerHTML = "- no logs -";
		tag.appendChild(subtag2);
		
		document.getElementsByTagName("body")[0].appendChild(tag);
	} catch (e) {}
}

function console_log(str) {
	if (typeof console == "undefined") { return; }
	else { console.log(str); }
}

function console_warn(str) {
	if (typeof console == "undefined") { return; }
	else { console.warn(str); }
}

function preloadInfo(str) {
	document.getElementById("game_canvas").getContext("2d").fillStyle = "rgb(0,0,0)";
	document.getElementById("game_canvas").getContext("2d").fillRect(0, 0, 800, 480);
	
	document.getElementById("game_canvas").getContext("2d").fillStyle = "rgb(255,255,255)";
	document.getElementById("game_canvas").getContext("2d").font = "32px Helvetica";
	document.getElementById("game_canvas").getContext("2d").fillText("Inicializálás... " + str, 200, 272);
	
	console_log("Inicializálás... " + str);
}

// ---- End of Helper Functions ---- //

// Classic Loader
// --------------

var run_ClassicLoader = function() {
	console_log("-- BOMBERTROLL CLASSIC JAVASCRIPT LOADER --");
	try {
		//combinator:start
		preloadInfo("0%");
			include_music("menu");
			include_music("ingame");
			include_music("landing");
			include_music("crashed", false);
		preloadInfo("10%");
			include_sfx("bomb_explosion");
			include_sfx("bomb_falling");
			include_sfx("building_collapse");
			include_sfx("plane_crash");
			include_sfx("plane_explosion");
		preloadInfo("20%");
			include_js("jquery");
			include_js("jaws");
		preloadInfo("30%");
			include_js("classes/colorstring");
			include_js("classes/text");
			include_js("classes/flying_text");
		preloadInfo("40%");
			include_js("classes/airplane");
			include_js("classes/building");
		preloadInfo("50%");
			include_js("classes/explosion");
			include_js("classes/cloud");
		preloadInfo("60%");
			include_js("classes/solid_button");
			include_js("classes/anim_button");
			include_js("classes/pause_button");
			include_js("classes/back_button");
			include_js("classes/mute_button");
		preloadInfo("70%");
			include_js("classes/credits_widget");
			include_js("screens/menu");
			include_js("screens/gameplay");
		preloadInfo("80%");
			include_js("screens/help");
			include_js("screens/highscores");
			include_js("screens/mode_select");
		preloadInfo("90%");
			include_js("game");
		preloadInfo("100%");
		window.onload = function() {
			// timeout for Internet Explorer
			setTimeout(function() {
				jaws.start(PreloadGame, {fps: (isMobileDevice ? 25 : 59)});
			}, 1000);
		};

		window.onunload = function() {};
		//combinator:end
	} catch (e) {
		alert("Internal Error: Failed to load scripts.");
	}
}

// ---- End of Classic Loader ---- //

// Fast Loader
// -----------

var run_FastLoader = function(code) {
	console_log("Trying Fast Loader...");
	try {
		if (code.indexOf("<?php") != -1) {
			throw "PHP_NOT_SUPPORTED";
		}
		if (code == "") {
			throw "EMPTY_CODE";
		}
		console_log("-- BOMBERTROLL FAST JAVASCRIPT LOADER --");
		eval(code);
	} catch (e) {
		console_warn("Fast Loader Error. Switching back to Classic Loader...");
		run_ClassicLoader();
	}
}

// ---- End of Fast Loader ---- //

// Init Script
// -----------

preloadInfo("Letöltés");

if (enable_engine_log) {
	create_engine_log();
}

try {
	var url = "bombertroll_loader.php";
	// Try twice
	sync_HttpGetRequest(url, run_FastLoader, function() { sync_HttpGetRequest(url, run_FastLoader, run_ClassicLoader) });
} catch (e) {
	console_warn("Server Error: Failed to download scripts.");
	run_ClassicLoader();
}

// ---- End of Init Script ---- //
