function ModeSelectScreen() {
	this.isActiveScreen = true;
	this.textTitle = new Text(100, 70, "Könnyű vagy Nehéz játékot szeretnél?", 32, "rgb(255, 255, 255)");
	this.textHardModeHint1 = new Text(150, 150, "Nehéz módban nincs negatív pontszám és a bomba sem függőlegesen esik, továbbá", 12, "rgb(255, 255, 255)");
	this.textHardModeHint2 = new Text(150, 166, "minden másodpercben az aktuális szint számával csökken a pontszámod. Cserébe", 12, "rgb(255, 255, 255)");
	this.textHardModeHint3 = new Text(150, 182, "ez utóbbi minden szintlépéskor megduplázódik, félredobás esetén pedig azonnal", 12, "rgb(255, 255, 255)");
	this.textHardModeHint4 = new Text(150, 198, "megfeleződik. A lerombolt épületrészek minden szinten egy ponttal többet érnek.", 12, "rgb(255, 255, 255)");
	
	this.easyButton = new SolidButton(100, 320, 190, 40, "Könnyűt");
	this.hardButton = new SolidButton(300, 320, 190, 40, "Nehezet");
	this.cancelButton = new SolidButton(500, 320, 190, 40, "Egyiket sem");
	
	this.setup = function() {
		console.log("ModeSelectScreen.setup()");
		
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
					jaws.switchGameState(BomberTroll, {fps: 30});
				}
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = true;
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(BomberTroll, {fps: 30});
				}
			}
			
			if (_BomberTrollInstance.cancelButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(MenuScreen, {fps: 30});
				}
			}
		});
		
		StopBackgroundSounds();
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
		this.textHardModeHint1.draw();
		this.textHardModeHint2.draw();
		this.textHardModeHint3.draw();
		this.textHardModeHint4.draw();
		
		this.easyButton.draw();
		this.hardButton.draw();
		this.cancelButton.draw();
	}
}