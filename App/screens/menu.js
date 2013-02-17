function MenuScreen() {
	this.isActiveScreen = true;
	this.clouds = new Array();
	
	this.textTitle = new Text(100, 70, "Bomber Troll", 32, "rgb(255, 255, 255)");
	this.textVersion = new Text(300, 70, "v2.1", 12, "rgba(255, 255, 255, 0.5)");
	this.textAuthor = new Text(150, 90, "by TakRaj", 16, "rgb(255, 255, 255)");
	
	this.newGameButton = new AnimatedButton(500, 200, 250, 40, "Új játék");
	this.helpButton = new AnimatedButton(500, 260, 250, 40, "Játékszabályok");
	this.highscoresButton = new AnimatedButton(500, 320, 250, 40, "Legjobbak listája");
	
	this.muteButton = new MuteButton(16, jaws.context.canvas.height - 16, 14, 14);
	this.credits = null;
	
	this.setup = function() {	
		console.log("MenuScreen.setup()");
		
		this.credits = new CreditsWidget(115, 300);
		
		this.clouds = new Array();
		for (var i = 0; i < 20; i++) {
			this.clouds[i] = new Cloud(Math.random() * jaws.context.canvas.width, Math.random() * jaws.context.canvas.height);
		}
		
		$('#game_canvas').unbind('click');
		$('#game_canvas').unbind('mousemove');
		
		var _BomberTrollInstance = this;
		
		// for menu animations
		$('#game_canvas').mousemove(function() {
			if (_BomberTrollInstance.newGameButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.newGameButton.hover = true;
			} else {
				_BomberTrollInstance.newGameButton.hover = false;
			}
			
			if (_BomberTrollInstance.helpButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.helpButton.hover = true;
			} else {
				_BomberTrollInstance.helpButton.hover = false;
			}
			
			if (_BomberTrollInstance.highscoresButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.highscoresButton.hover = true;
			} else {
				_BomberTrollInstance.highscoresButton.hover = false;
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.muteButton.hover = true;
			} else {
				_BomberTrollInstance.muteButton.hover = false;
			}
		});
		
		// for menu selections
		$('#game_canvas').click(function() {
			if (_BomberTrollInstance.newGameButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(ModeSelectScreen);
				}
			}
			
			if (_BomberTrollInstance.helpButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(HelpScreen);
				}
			}
			
			if (_BomberTrollInstance.highscoresButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				$('#game_canvas').unbind('click');
				$('#game_canvas').unbind('mousemove');
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(HighScoresScreen);
				}
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				soundsEnabled ? DisableSounds() : EnableSounds();
			}
		});
		
		if (!isPlaying("menu_music")) {
			StopBackgroundSounds();
			PlaySound("menu_music");
		}
		
		offset = $('#game_canvas').offset();
	}
	
	this.update = function() {
		if (!this.isActiveScreen) return;
		var big_diff = jaws.game_loop.tick_duration;
		var diff = 100;
		
		while (big_diff > 0) {
			if (big_diff < diff) {
				diff = big_diff;
			}
			big_diff -= diff;
		
			for (var i = 0; i < this.clouds.length; i++) {
				this.clouds[i].step(diff);
			}
			
			this.credits.step(diff);
			
			this.newGameButton.step(diff);
			this.helpButton.step(diff);
			this.highscoresButton.step(diff);
		}
	}
	
	this.draw = function() {
		if (!this.isActiveScreen) return;
		jaws.clear();
		jaws.context.fillStyle = "rgb(183,184,255)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].draw();
		}
		
		jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		this.credits.draw();
		
		this.newGameButton.draw();
		this.helpButton.draw();
		this.highscoresButton.draw();
		
		this.muteButton.draw();
		
		this.textTitle.draw();
		this.textVersion.draw();
		this.textAuthor.draw();
	}
}