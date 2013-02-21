function ModeSelectScreen() {
	this.isActiveScreen = true;
	this.textTitle = new Text(100, 70, "K�nny� vagy Neh�z j�t�kot szeretn�l?", 32, "rgb(255, 255, 255)");
	this.textHardModeHint1 = new Text(130, 150, "Neh�z m�dban nincs negat�v pontsz�m �s a bomba sem f�gg�legesen esik, tov�bb� minden m�sodpercben", 12, "rgb(255, 255, 255)");
	this.textHardModeHint2 = new Text(130, 166, "az aktu�lis szint sz�m�val cs�kken a pontsz�mod. Cser�be ez ut�bbi minden szintl�p�skor megdupl�z�dik,", 12, "rgb(255, 255, 255)");
	this.textHardModeHint3 = new Text(130, 182, "f�lredob�s eset�n pedig azonnal megfelez�dik. A lerombolt �p�letr�szek minden szinten egy ponttal t�bbet", 12, "rgb(255, 255, 255)");
	this.textHardModeHint4 = new Text(130, 198, "�rnek. Neh�z m�dban a b�nusz a 2. szintt�l kezdve j�r akkor, ha a bomba nagyon magasr�l lett ind�tva.", 12, "rgb(255, 255, 255)");
	this.textHardModeHint5 = new Text(130, 214, "A b�nusz szorz� �rt�ke ilyenkor az aktu�lis szint sz�ma.", 12, "rgb(255, 255, 255)");
	
	this.easyButton = new SolidButton(100, 320, 190, 40, "K�nny�t");
	this.hardButton = new SolidButton(300, 320, 190, 40, "Nehezet");
	this.cancelButton = new SolidButton(500, 320, 190, 40, "Egyiket sem");
	
	this.setup = function() {
		console_log("ModeSelectScreen.setup()");
		
		$('#game_canvas').unbind('click');
		$('#game_canvas').unbind('mousemove');
		
		var _BomberTrollInstance = this;
		
		// for button hover effects
		$('#game_canvas').mousemove(function() {		
			if (_BomberTrollInstance.easyButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.easyButton.hover = true;
			} else {
				_BomberTrollInstance.easyButton.hover = false;
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.hardButton.hover = true;
			} else {
				_BomberTrollInstance.hardButton.hover = false;
			}
			
			if (_BomberTrollInstance.cancelButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.cancelButton.hover = true;
			} else {
				_BomberTrollInstance.cancelButton.hover = false;
			}
		});
		
		// for button selections
		$('#game_canvas').click(function() {		
			if (_BomberTrollInstance.easyButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = false;
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					
					try {
						parent._gaq.push(['_trackEvent', 'GameMode', 'Easy']);
						console_log("Analytics sent.");
					} catch (e) {}
					
					jaws.switchGameState(BomberTroll);
				}
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = true;
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					
					try {
						parent._gaq.push(['_trackEvent', 'GameMode', 'Hard']);
						console_log("Analytics sent.");
					} catch (e) {}
					
					jaws.switchGameState(BomberTroll);
				}
			}
			
			if (_BomberTrollInstance.cancelButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(MenuScreen);
				}
			}
		});
		
		StopBackgroundSounds();
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
		this.textHardModeHint1.draw();
		this.textHardModeHint2.draw();
		this.textHardModeHint3.draw();
		this.textHardModeHint4.draw();
		this.textHardModeHint5.draw();
		
		this.easyButton.draw();
		this.hardButton.draw();
		this.cancelButton.draw();
	}
}