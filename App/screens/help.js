function HelpScreen() {
	this.textTitle = new Text(100, 70, "Játékszabályok", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a visszalépéshez!", 12, "rgb(255, 255, 255)");
	
	this.rules = new Array();
	this.rules[this.rules.length] = "A játékos egy repülőgépet irányít, mely a játéktéren található emeletes";
	this.rules[this.rules.length] = "házak fölött köröz és folyamatosan ereszkedik. A repülőgép képes bombákat";
	this.rules[this.rules.length] = "ledobni, de egyszerre csak egyet. (kattintásra)";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Ha a bomba ráesik egy házra, akkor abban jelentős kárt tesz vagy teljesen";
	this.rules[this.rules.length] = "le is rombolhatja. A cél az, hogy a játékos minden házat leromboljon anélkül,";
	this.rules[this.rules.length] = "hogy bármelyikbe is beleütközzön a repülőgépével.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "A házak minden pályán véletlenszerűen generálódnak, elsősorban a magasságukat";
	this.rules[this.rules.length] = "tekintve lényeges paraméternek. A házak magasságának szórása (egy bizonyos maximumig)";
	this.rules[this.rules.length] = "és a repülőgép sebessége minden pályán növekszik az előzőhöz képest, így egyre";
	this.rules[this.rules.length] = "nehezebb lesz a játék.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "A pontozás alapját egy-egy rombolási kísérlet sikeres vagy sikertelen kimenetele adja.";
	this.rules[this.rules.length] = "A játék akkor ér véget, amikor a játékos nekiütközik egy háznak a repülőgépével.";
	this.rules[this.rules.length] = "Ha az addig elért pontszám nagyobb, mint a legjobb 10 pontszám utolsója, a program";
	this.rules[this.rules.length] = "bekéri a játékos nevét, majd megjeleníti a ponttáblát.";
	
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