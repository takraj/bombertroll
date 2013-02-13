function HelpScreen() {
	this.textTitle = new Text(100, 70, "Játékszabályok", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a visszalépéshez!", 12, "rgb(255, 255, 255)");
	
	this.rules = new Array();
	this.rules[this.rules.length] = "A játékos egy repülőgépet irányít, mely a játéktéren található emeletes";
	this.rules[this.rules.length] = "házak fölött köröz és folyamatosan ereszkedik. A repülőgép képes bombákat";
	this.rules[this.rules.length] = "ledobni, de egyszerre csak egyet.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Ha a bomba ráesik egy házra, akkor abban jelentős kárt tesz vagy teljesen";
	this.rules[this.rules.length] = "le is rombolhatja. A cél az, hogy a játékos minden házat leromboljon anélkül,";
	this.rules[this.rules.length] = "hogy bármelyikbe is beleütközzön a repülőgépével. A sikeres rombolás értéke";
	this.rules[this.rules.length] = "emeletenként +5 pont, a mellédobás értéke -500 pont.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "A házak minden pályán véletlenszerűen generálódnak, maximális magasságukat";
	this.rules[this.rules.length] = "a 14. szinten érhetik el legkorábban. A játék rendelkezik egy speciális nehéz";
	this.rules[this.rules.length] = "móddal is, amely instrukcióit az 'Új játék' képernyőn lehet elolvasni.";
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
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function() {
			jaws.start(MenuScreen, {fps: 30});
		});
	}
	
	this.update = function() {
	}
	
	this.draw = function() {
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