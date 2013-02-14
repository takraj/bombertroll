function MenuScreen() {
	this.previousUpdateTime;
	this.currentUpdateTime;
	this.clouds = new Array();
	
	this.textTitle = new Text(100, 70, "Bomber Troll", 32, "rgb(255, 255, 255)");
	this.textAuthor = new Text(150, 90, "by TakRaj", 16, "rgb(255, 255, 255)");
	
	this.newGameButton = new AnimatedButton(500, 200, 250, 40, "Új játék");
	this.helpButton = new AnimatedButton(500, 260, 250, 40, "Játékszabályok");
	this.highscoresButton = new AnimatedButton(500, 320, 250, 40, "Legjobbak listája");
	
	this.muteButton = new MuteButton(16, jaws.context.canvas.height - 16, 14, 14);
	
	this.setup = function() {	
		this.previousUpdateTime = new Date().getTime();
		this.currentUpdateTime = this.previousUpdateTime;
		
		this.clouds = new Array();
		for (var i = 0; i < 20; i++) {
			this.clouds[i] = new Cloud(Math.random() * jaws.context.canvas.width, Math.random() * jaws.context.canvas.height);
		}
		
		$('#game_canvas').unbind('click');
		$('#game_canvas').unbind('mousemove');
		
		var _BomberTrollInstance = this;
		var offset = $('#game_canvas').offset();
		
		// for menu animations
		$('#game_canvas').mousemove(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
		
			if (_BomberTrollInstance.newGameButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.newGameButton.hover = true;
			} else {
				_BomberTrollInstance.newGameButton.hover = false;
			}
			
			if (_BomberTrollInstance.helpButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.helpButton.hover = true;
			} else {
				_BomberTrollInstance.helpButton.hover = false;
			}
			
			if (_BomberTrollInstance.highscoresButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.highscoresButton.hover = true;
			} else {
				_BomberTrollInstance.highscoresButton.hover = false;
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.muteButton.hover = true;
			} else {
				_BomberTrollInstance.muteButton.hover = false;
			}
		});
		
		// for menu selections
		$('#game_canvas').click(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
		
			if (_BomberTrollInstance.newGameButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				jaws.start(ModeSelectScreen, {fps: 30});
			}
			
			if (_BomberTrollInstance.helpButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				jaws.start(HelpScreen, {fps: 30});
			}
			
			if (_BomberTrollInstance.highscoresButton.isInnerPoint(lastMouseX, lastMouseY)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				jaws.start(HighScoresScreen, {fps: 30});
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(lastMouseX, lastMouseY)) {
				soundsEnabled ? DisableSounds() : EnableSounds();
			}
		});
		
		if (!isPlaying("menu_music")) {
			StopBackgroundSounds();
			PlaySound("menu_music");
		}
	}
	
	this.update = function() {
		this.currentUpdateTime = new Date().getTime();
		var big_diff = this.currentUpdateTime - this.previousUpdateTime;
		var diff = 100;
		
		while (big_diff > 0) {
			if (big_diff < diff) {
				diff = big_diff;
			}
			big_diff -= diff;
		
			for (var i = 0; i < this.clouds.length; i++) {
				this.clouds[i].step(diff);
			}
			
			this.newGameButton.step(diff);
			this.helpButton.step(diff);
			this.highscoresButton.step(diff);
		}
		
		this.previousUpdateTime = this.currentUpdateTime;
	}
	
	this.draw = function() {
		jaws.clear();
		jaws.context.fillStyle = "rgb(183,184,255)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].draw();
		}
		
		jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		this.newGameButton.draw();
		this.helpButton.draw();
		this.highscoresButton.draw();
		
		this.muteButton.draw();
		
		this.textTitle.draw();
		this.textAuthor.draw();
	}
}