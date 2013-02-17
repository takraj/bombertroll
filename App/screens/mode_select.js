function ModeSelectScreen() {
	this.isActiveScreen = true;
	this.textTitle = new Text(100, 70, "Könnyű vagy Nehéz játékot szeretnél?", 32, "rgb(255, 255, 255)");
	this.textHardModeHint1 = new Text(130, 150, "Nehéz módban nincs negatív pontszám és a bomba sem függőlegesen esik, továbbá minden másodpercben", 12, "rgb(255, 255, 255)");
	this.textHardModeHint2 = new Text(130, 166, "az aktuális szint számával csökken a pontszámod. Cserébe ez utóbbi minden szintlépéskor megduplázódik,", 12, "rgb(255, 255, 255)");
	this.textHardModeHint3 = new Text(130, 182, "félredobás esetén pedig azonnal megfeleződik. A lerombolt épületrészek minden szinten egy ponttal többet", 12, "rgb(255, 255, 255)");
	this.textHardModeHint4 = new Text(130, 198, "érnek. Nehéz módban a bónusz a 2. szinttől kezdve jár akkor, ha a bomba nagyon magasról lett indítva.", 12, "rgb(255, 255, 255)");
	this.textHardModeHint5 = new Text(130, 214, "A bónusz szorzó értéke ilyenkor az aktuális szint száma.", 12, "rgb(255, 255, 255)");
	
	this.easyButton = new SolidButton(100, 320, 190, 40, "Könnyűt");
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
					jaws.switchGameState(BomberTroll);
				}
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = true;
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
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