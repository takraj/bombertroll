function HelpScreen() {
	this.isActiveScreen = true;
	this.textTitle = new Text(100, 70, "Játékszabályok", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a visszalépéshez!", 12, "rgb(255, 255, 255)");
	
	this.rules = new Array();
	this.rules[this.rules.length] = "A játékos egy repülőgépet irányít, mely a játéktéren található emeletes házak fölött köröz és folyamatosan";
	this.rules[this.rules.length] = "ereszkedik. A repülőgép képes bombákat ledobni, de egyszerre csak egyet.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Ha a bomba ráesik egy házra, akkor abban jelentős kárt tesz vagy teljesen le is rombolhatja. A cél az, hogy";
	this.rules[this.rules.length] = "a játékos minden házat leromboljon anélkül, hogy bármelyikbe is beleütközzön a repülőgépével. A sikeres";
	this.rules[this.rules.length] = "rombolás értéke emeletenként +15 pont, továbbá egy tető +5, míg egy alagsor +18 pontot ér. A sikertelenség,";
	this.rules[this.rules.length] = "vagyis a mellédobás értéke -500 pont, könnyű játékmód esetén. A házak minden pályán véletlenszerűen";
	this.rules[this.rules.length] = "generálódnak, maximális magasságukat a 14. szinten érhetik el legkorábban.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Bónusz: Ha a bomba épületbe csapódás előtt csak kevés utat tesz meg, akkor a rombolásért kapott pontok";
	this.rules[this.rules.length] = "megtízszereződnek arra az alkalomra. A játék rendelkezik egy speciális nehéz móddal is, amely instrukcióit";
	this.rules[this.rules.length] = "az 'Új játék' képernyőn lehet elolvasni.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Irányítás:";
	this.rules[this.rules.length] = "----------";
	this.rules[this.rules.length] = "Kattintás vagy Enter              : bomba elengedése";
	this.rules[this.rules.length] = "P vagy kattintás az ikonon        : szünet be / ki";
	this.rules[this.rules.length] = "M vagy kattintás az ikonon        : némítás be / ki";
	this.rules[this.rules.length] = "ESC vagy kattintás az ikonon      : vissza a főmenübe";
	
	for (var i = 0; i < this.rules.length; i++) {
		this.rules[i] = new Text(150, 110 + (i*16), this.rules[i], 12, "rgb(255, 255, 255)");
	}

	this.setup = function() {
		var _BomberTrollInstance = this;
		console_log("HelpScreen.setup()");
		
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function() {
			if (_BomberTrollInstance.isActiveScreen) {
				_BomberTrollInstance.isActiveScreen = false;
				jaws.switchGameState(MenuScreen);
			}
		});
		offset = $('#game_canvas').offset();
	}
	
	this.update = function() {
		if (!this.isActiveScreen) return;
	}
	
	this.draw = function() {
		if (!this.isActiveScreen) return;
		jaws.clear();
		jaws.context.fillStyle = "rgb(0,0,0)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		this.textTitle.draw();
		
		for (var i = 0; i < this.rules.length; i++) {
			this.rules[i].draw();
		}
		
		this.textClickToContinue.draw();
	}
}