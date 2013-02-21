function HelpScreen() {
	this.isActiveScreen = true;
	this.textTitle = new Text(100, 70, "J�t�kszab�lyok", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a visszal�p�shez!", 12, "rgb(255, 255, 255)");
	
	this.rules = new Array();
	this.rules[this.rules.length] = "A j�t�kos egy rep�l�g�pet ir�ny�t, mely a j�t�kt�ren tal�lhat� emeletes h�zak f�l�tt k�r�z �s folyamatosan";
	this.rules[this.rules.length] = "ereszkedik. A rep�l�g�p k�pes bomb�kat ledobni, de egyszerre csak egyet.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Ha a bomba r�esik egy h�zra, akkor abban jelent�s k�rt tesz vagy teljesen le is rombolhatja. A c�l az, hogy";
	this.rules[this.rules.length] = "a j�t�kos minden h�zat leromboljon an�lk�l, hogy b�rmelyikbe is bele�tk�zz�n a rep�l�g�p�vel. A sikeres";
	this.rules[this.rules.length] = "rombol�s �rt�ke emeletenk�nt +15 pont, tov�bb� egy tet� +5, m�g egy alagsor +18 pontot �r. A sikertelens�g,";
	this.rules[this.rules.length] = "vagyis a mell�dob�s �rt�ke -500 pont, k�nny� j�t�km�d eset�n. A h�zak minden p�ly�n v�letlenszer�en";
	this.rules[this.rules.length] = "gener�l�dnak, maxim�lis magass�gukat a 14. szinten �rhetik el legkor�bban.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "B�nusz: Ha a bomba �p�letbe csap�d�s el�tt csak kev�s utat tesz meg, akkor a rombol�s�rt kapott pontok";
	this.rules[this.rules.length] = "megt�zszerez�dnek arra az alkalomra. A j�t�k rendelkezik egy speci�lis neh�z m�ddal is, amely instrukci�it";
	this.rules[this.rules.length] = "az '�j j�t�k' k�perny�n lehet elolvasni.";
	this.rules[this.rules.length] = "";
	this.rules[this.rules.length] = "Ir�ny�t�s:";
	this.rules[this.rules.length] = "----------";
	this.rules[this.rules.length] = "Kattint�s vagy Enter              : bomba elenged�se";
	this.rules[this.rules.length] = "P vagy kattint�s az ikonon        : sz�net be / ki";
	this.rules[this.rules.length] = "M vagy kattint�s az ikonon        : n�m�t�s be / ki";
	this.rules[this.rules.length] = "ESC vagy kattint�s az ikonon      : vissza a f�men�be";
	
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