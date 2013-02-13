function BomberTroll() {
	this.previousUpdateTime;
	this.currentUpdateTime;
	this.airplane;
	this.buildings;
	this.scoreText;
	this.levelText;
	this.explosions;
	this.flyingTexts;
	this.isPaused = false;
	this.stillAlive = true;
	this.state_gameover = false;
	this.state_nextlevel = false;
	
	// control buttons
	
	this.pauseButton = new PauseButton(jaws.context.canvas.width - 30, jaws.context.canvas.height - 16, 14, 14);
	this.backButton = new BackButton(jaws.context.canvas.width - 60, jaws.context.canvas.height - 16, 14, 14);
	this.muteButton = new MuteButton(16, jaws.context.canvas.height - 16, 14, 14);
	
	// texts
	
	this.textPaused = new Text(150, 300, "Egy pillanatra megálltam!", 32, "rgb(255, 255, 255)");
	this.textPausedHint = new Text(300, 330, "...de kattintásra vagy a 'P' billentyűre folytatom!", 12, "rgb(255, 255, 255)");
	
	this.textGameOver = new Text(150, 300, "Vége a játéknak!", 32, "rgb(255, 255, 255)");
	this.textHighScoreHint = new Text(300, 330, "...de bekerültél a legjobbak közé!", 12, "rgb(255, 255, 255)");
	
	this.textNextLevel = new Text(150, 300, "Sikeres küldetés!", 32, "rgb(255, 255, 255)");
	this.textNextLevelHint = new Text(300, 330, "Kattints a követekző szintre lépéshez!", 12, "rgb(255, 255, 255)");
	
	this.hardModeHint = new Text(jaws.context.canvas.width / 2.0 - 30, jaws.context.canvas.height - 5, "-- nehéz mód --", 12, "rgba(255, 255, 255, 0.5)");
	
	// other
	
	this.clouds = new Array();
	
	// ---- Background Selector ----
	
	if (previousBackground < 0) {
		previousBackground = Math.round(Math.random() * (backgrounds.length - 1));
	}
	if (backgrounds.length > 1) {
		newBg = previousBackground;
		while (newBg == previousBackground) {
			newBg = Math.round(Math.random() * 10000000) % backgrounds.length;
		}
		this.background = backgrounds[newBg];
		previousBackground = newBg;
	}
	
	// ---- end of selector ----
	
	this.backgroundSprite = null;

	/* Called once. Put your one-time initializing here. */
	this.setup = function() {
		player = new Player();
		this.initLevel();
		
		StopBackgroundSounds();
		PlaySound("ingame_music");
	}
	
	this.initLevel = function() {	
		this.previousUpdateTime = new Date().getTime();
		this.currentUpdateTime = this.previousUpdateTime;
		
		this.background = backgrounds[Math.round(Math.random() * (backgrounds.length - 1))];
		this.backgroundSprite = new jaws.Sprite({image: this.background.file, x: 0, y: 0, scale: 1, anchor: "top_left"});
		
		this.clouds = new Array();
		for (var i = 0; i < 6; i++) {
			this.clouds[i] = new Cloud(Math.random() * jaws.context.canvas.width, Math.random() * 100);
		}
		
		this.airplane = new Airplane(0, 15, 200 + ((player.currentLevel - 1) * player.currentLevel), player, this)
		this.buildings = new Array();
		this.explosions = new Array();
		this.flyingTexts = new Array();
		
		for (var i = 0; i < 16; i++) {
			// az épület max magassága 16 egység, max szórása lefelé 6 egység
			this.buildings[i] = new Building(i*50, 50, this.background.isDaytime, Math.min(4 + player.currentLevel, 16), Math.min(Math.ceil(player.currentLevel / 2.0), 10), player);
		}
		
		this.levelText = new Text(jaws.context.canvas.width - 80, 30, "" + player.currentLevel + ". szint", 16, "rgb(0, 0, 0)");
		this.scoreText = new Text(20, 30, "Pontszám: " + player.currentScore, 16, "rgb(0, 0, 0)");
		
		// local event handlers
		
		var offset = $('#game_canvas').offset();
		var _BomberTrollInstance = this;
		
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
		
			if (_BomberTrollInstance.backButton.isInnerPoint(lastMouseX, lastMouseY)) {
				// same as escape
				$(document).unbind('keyup');
				player = new Player();
				jaws.start(MenuScreen, {fps: 30});
			} else if (_BomberTrollInstance.muteButton.isInnerPoint(lastMouseX, lastMouseY)) {
				soundsEnabled ? DisableSounds() : EnableSounds();
			} else if (_BomberTrollInstance.isPaused) {
				_BomberTrollInstance.isPaused = false;
			} else if (_BomberTrollInstance.pauseButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.isPaused = true;
			} else {
				if (_BomberTrollInstance.airplane != null) {
					_BomberTrollInstance.airplane.dropBomb();
				}
			}
		});
		
		$('#game_canvas').unbind('mousemove');
		$("#game_canvas").mousemove(function(e) {
			var lastMouseX = e.pageX - offset.left;
			var lastMouseY = e.pageY - offset.top;
			
			if (_BomberTrollInstance.pauseButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.pauseButton.hover = true;
			} else {
				_BomberTrollInstance.pauseButton.hover = false;
			}
			
			if (_BomberTrollInstance.backButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.backButton.hover = true;
			} else {
				_BomberTrollInstance.backButton.hover = false;
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(lastMouseX, lastMouseY)) {
				_BomberTrollInstance.muteButton.hover = true;
			} else {
				_BomberTrollInstance.muteButton.hover = false;
			}
		});
		
		$(document).unbind('keyup');
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				// escape
				$(document).unbind('keyup');
				player = new Player();
				jaws.start(MenuScreen, {fps: 30});
			}
			
			if (e.keyCode == 80) {
				// p
				if (!_BomberTrollInstance.state_gameover && !_BomberTrollInstance.state_nextlevel) {
					_BomberTrollInstance.isPaused = !_BomberTrollInstance.isPaused;
				}
			}
			
			if (e.keyCode == 77) {
				// m
				soundsEnabled ? DisableSounds() : EnableSounds();
			}
			
			if (e.keyCode == 13) {
				// enter
				if (_BomberTrollInstance.airplane != null) {
					_BomberTrollInstance.airplane.dropBomb();
				}
			}
		});
		
		player.currentScore *= (player.currentLevel-1);
	}
	
	/* Called each gametick. Put your gamelogic here. */
	this.update = function() {
		this.currentUpdateTime = new Date().getTime();
		
		if (this.isPaused) {
			this.previousUpdateTime = this.currentUpdateTime;
			return;
		}
		
		var big_diff = this.currentUpdateTime - this.previousUpdateTime;
		var diff = 100;
		
		player.scoretimer += big_diff;
		
		while (big_diff > 0) {
			if (big_diff < diff) {
				diff = big_diff;
			}
			big_diff -= diff;
			
			if (this.airplane != null) {
				this.airplane.step(diff);
				
				// megvizsgálja, hogy a bomba eltalált-e valami épületet
				if (this.airplane.bomb != null) {
					for (var i = 0; i < this.buildings.length; i++) {
						if (this.buildings[i].isCollision(this.airplane.bomb.x, this.airplane.bomb.y, this.airplane.bomb.width, this.airplane.bomb.height)) {
							this.buildings[i].doDestroyByBomb(this);
							this.addExplosion(this.airplane.bomb);
							this.airplane.bomb = null;
							break;
						}
					}
				}
				
				// megvizsgálja, hogy lezuhant-e a repülő
				for (var i = 0; i < this.buildings.length; i++) {
					if (this.buildings[i].isCollision(this.airplane.x, this.airplane.y, this.airplane.width, this.airplane.height)) {
						this.addExplosion(this.airplane);
						this.airplane = null;
						break;
					}
				}
				
				// megvizsgálja, hogy leszálltunk-e
				if ((this.airplane != null) && (this.airplane.y > (jaws.context.canvas.height - 20 - this.airplane.height))) {
					allDestroyed = true;
					for (var i = 0; i < this.buildings.length; i++) {
						if (this.buildings[i].baseElement != null) {
							allDestroyed = false;
							break;
						}
					}
					
					if (allDestroyed) {
						this.state_nextlevel = true;
						
						$('#game_canvas').unbind('click');
						var _BomberTrollInstance = this;
						$("#game_canvas").click(function() {
							$('#game_canvas').unbind('click');
							_BomberTrollInstance.nextLevel();
						});
					} else {
						this.addExplosion(this.airplane);
						this.airplane = null;
					}
				}
				
				// ha elfogytak az épületek, akkor felgyorsítja a repülő zuhanási sebességét
				if ((this.airplane != null) && (!this.airplane.speedup)) {
					allDestroyed = true;
					for (var i = 0; i < this.buildings.length; i++) {
						if (this.buildings[i].baseElement != null) {
							allDestroyed = false;
							break;
						}
					}
					
					if (allDestroyed) {
						this.airplane.speedup = true;
					}
				}
			}
				
			// frissíti a robbanásokat
			for (var i = 0; i < this.explosions.length; i++) {
				if (this.explosions[i] != null) {
					if (!this.explosions[i].isDead()) {
						this.explosions[i].step(diff);
					} else {
						this.explosions[i] = null;
					}
				}
			}
			
			// frissíti a repülő szövegeket
			for (var i = 0; i < this.flyingTexts.length; i++) {
				if (this.flyingTexts[i] != null) {
					if (!this.flyingTexts[i].isDead()) {
						this.flyingTexts[i].step(diff);
					} else {
						this.flyingTexts[i] = null;
					}
				}
			}
			
			// frissíti a felhőket
			for (var i = 0; i < this.clouds.length; i++) {
				this.clouds[i].step(diff);
			}
			
			// ha már nincs repcsi, de a robanás is lezajlott
			if (this.stillAlive && (this.airplane == null)) {
				noExplosionsRunning = true;
				
				for (var i = 0; i < this.explosions.length; i++) {
					if (this.explosions[i] != null) {
						noExplosionsRunning = false;
					}
				}
				
				if (noExplosionsRunning) {
					this.stillAlive = false;
					this.state_gameover = true;
					
					$('#game_canvas').unbind('click');
					var _BomberTrollInstance = this;
					$("#game_canvas").click(function() {
						$('#game_canvas').unbind('click');
						_BomberTrollInstance.endgame();
					});
				}
			}
		}
		
		if (isHardMode && !this.state_gameover && !this.state_nextlevel) {
			if (player.currentScore > 0) {
				player.currentScore -= player.currentLevel * Math.floor(player.scoretimer / 1000);
				player.scoretimer %= 1000;
			} else {
				player.scoretimer = 0;
				player.currentScore = 0;
			}
		} else {
			player.scoretimer = 0;
		}
		
		this.previousUpdateTime = this.currentUpdateTime;
	}
	
	/* Called each gametick after update(). Put your drawing here. */
	this.draw = function() {
		if (this.airplane != null) {
			this.airplane.stopped = this.isPaused || this.state_nextlevel;
		}
	
		jaws.clear();
		
		this.backgroundSprite.draw();
		jaws.context.fillStyle = "rgba(183,184,255, 0.5)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		jaws.context.fillStyle = "rgb(0, 0, 0)";
		jaws.context.fillRect(0, jaws.context.canvas.height - 20, jaws.context.canvas.width, 20);
		
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].draw();
		}
		
		for (var i = 0; i < this.buildings.length; i++) {
			this.buildings[i].draw();
		}
		
		if (this.airplane != null) {
			this.airplane.draw();
		}
		
		// kirajzolja a robbanásokat
		for (var i = 0; i < this.explosions.length; i++) {
			if (this.explosions[i] != null) {
				this.explosions[i].draw();
			}
		}
		
		// kirajzolja a repülő pontokat
		for (var i = 0; i < this.flyingTexts.length; i++) {
			if (this.flyingTexts[i] != null) {
				this.flyingTexts[i].draw();
			}
		}
		
		if (this.isPaused) {
			// game paused splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textPaused.draw();
			this.textPausedHint.draw();
		} else if (this.state_gameover) {
			// gameover splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textGameOver.draw();
			
			if (player.currentScore > player.getLowestHighscore().score) {
				this.textHighScoreHint.draw();
			}
		} else if (this.state_nextlevel) {
			// next level splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textNextLevel.draw();
			this.textNextLevelHint.draw();
		}
		
		// control buttons
		
		this.pauseButton.draw();
		this.backButton.draw();
		this.muteButton.draw();
		
		// hint
		
		if (isHardMode) {
			this.hardModeHint.draw();
		}
		
		// scoreboard
		
		this.scoreText.str = "Pontszám: " + player.currentScore;
		this.scoreText.draw();
		this.levelText.draw();
	}
	
	this.endgame = function() {
		jaws.start(HighScoresScreen, {fps: 30});
	}
	
	this.nextLevel = function() {
		this.state_nextlevel = false;
		player.currentLevel++;
		this.initLevel();
	}
	
	this.addExplosion = function(obj) {
		this.explosions[this.explosions.length] = new Explosion(obj);
	}
	
	this.addFlyingText = function(obj, str, isRedNotGreen) {
		this.flyingTexts[this.flyingTexts.length] = new FlyingText(obj, str, isRedNotGreen);
	}
}