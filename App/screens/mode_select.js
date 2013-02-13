function ModeSelectScreen() {
	this.textTitle = new Text(100, 70, "Könnyű vagy Nehéz játékot szeretnél?", 32, "rgb(255, 255, 255)");
	this.textHardModeHint1 = new Text(150, 150, "Nehéz módban nincs negatív pontszám és a bomba sem függőlegesen esik, továbbá", 12, "rgb(255, 255, 255)");
	this.textHardModeHint2 = new Text(150, 166, "minden másodpercben az aktuális szint számával csökken a pontszámod. Cserébe", 12, "rgb(255, 255, 255)");
	this.textHardModeHint3 = new Text(150, 182, "ez utóbbi minden szintlépéskor megszorzódik az előző szint számával, félredobás", 12, "rgb(255, 255, 255)");
	this.textHardModeHint4 = new Text(150, 198, "esetén pedig azonnal megfeleződik.", 12, "rgb(255, 255, 255)");
	
	this.easyButton = new SolidButton(100, 320, 190, 40, "Könnyűt");
	this.hardButton = new SolidButton(300, 320, 190, 40, "Nehezet");
	this.cancelButton = new SolidButton(500, 320, 190, 40, "Egyiket sem");
	
	this.setup = function() {
		$('#game_canvas').unbind('click');
		$('#game_canvas').unbind('mousemove');
		
		var _BomberTrollInstance = this;
		var offset = $('#game_canvas').offset();
		
		// for button hover effects
		$('#game_canvas').mousemove(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
		
			if (_BomberTrollInstance.easyButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.easyButton.hover = true;
			} else {
				_BomberTrollInstance.easyButton.hover = false;
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.hardButton.hover = true;
			} else {
				_BomberTrollInstance.hardButton.hover = false;
			}
			
			if (_BomberTrollInstance.cancelButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.cancelButton.hover = true;
			} else {
				_BomberTrollInstance.cancelButton.hover = false;
			}
		});
		
		// for button selections
		$('#game_canvas').click(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
		
			if (_BomberTrollInstance.easyButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = false;
				jaws.start(BomberTroll, {fps: 30});
			}
			
			if (_BomberTrollInstance.hardButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				isHardMode = true;
				jaws.start(BomberTroll, {fps: 30});
			}
			
			if (_BomberTrollInstance.cancelButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				jaws.start(MenuScreen, {fps: 30});
			}
		});
		
		StopBackgroundSounds();
	}
	
	this.update = function() {
	}
	
	this.draw = function() {
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