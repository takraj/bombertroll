function BomberTroll() {
	this.isActiveScreen = true;
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
	this.textPausedHint = new Text(300, 330, "...de kattintásra vagy a 'P' billentyûre folytatom!", 12, "rgb(255, 255, 255)");
	
	this.textGameOver = new Text(150, 300, "Vége a játéknak!", 32, "rgb(255, 255, 255)");
	this.textHighScoreHint = new Text(300, 330, "...de bekerültél a legjobbak közé!", 12, "rgb(255, 255, 255)");
	this.textNegativeRecordHint = new Text(300, 330, "...és megdöntötted a negatív rekordot!", 12, "rgb(255, 255, 255)");
	
	this.textNextLevel = new Text(150, 300, "Sikeres küldetés!", 32, "rgb(255, 255, 255)");
	this.textNextLevelHint = new Text(300, 330, "Kattints a követekzõ szintre lépéshez!", 12, "rgb(255, 255, 255)");
	
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
		console_log("BomberTroll.setup()");
		
		player = new Player();
		this.initLevel();
	}
	
	this.initLevel = function() {	
		this.previousUpdateTime = new Date().getTime();
		this.currentUpdateTime = this.previousUpdateTime;
		
		this.background = backgrounds[Math.round(Math.random() * (backgrounds.length - 1))];
		this.backgroundSprite = new jaws.Sprite({image: this.background.file, x: 0, y: 0, scale: 1, anchor: "top_left"});
		
		try {
			parent._gaq.push(['_trackEvent', 'Gameplay', 'BackgroundFile', this.background.file]);
			console_log("Analytics sent.");
		} catch (e) {}
		
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
		var _BomberTrollInstance = this;
		
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function() {		
			if (_BomberTrollInstance.backButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				// same as escape
				$(document).unbind('keyup');
				player = new Player();
				ContinueAllSounds();
				StopAllSounds();
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					try {
						parent._gaq.push(['_trackEvent', 'GameOptions', 'BackToMainMenu']);
						console_log("Analytics sent.");
					} catch (e) {}
					jaws.switchGameState(MenuScreen);
				}
			} else if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				soundsEnabled ? DisableSounds() : EnableSounds();
			} else if (_BomberTrollInstance.isPaused) {
				_BomberTrollInstance.isPaused = false;
				try {
					parent._gaq.push(['_trackEvent', 'GameOptions', 'Unpaused']);
					console_log("Analytics sent.");
				} catch (e) {}
				ContinueAllSounds();
			} else if (_BomberTrollInstance.pauseButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.isPaused = true;
				try {
					parent._gaq.push(['_trackEvent', 'GameOptions', 'Paused']);
					console_log("Analytics sent.");
				} catch (e) {}
				PauseAllSounds();
			} else {
				if (_BomberTrollInstance.airplane != null) {
					_BomberTrollInstance.airplane.dropBomb();
				}
			}
		});
		
		$('#game_canvas').unbind('mousemove');
		$("#game_canvas").mousemove(function() {			
			if (_BomberTrollInstance.pauseButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.pauseButton.hover = true;
			} else {
				_BomberTrollInstance.pauseButton.hover = false;
			}
			
			if (_BomberTrollInstance.backButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.backButton.hover = true;
			} else {
				_BomberTrollInstance.backButton.hover = false;
			}
			
			if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
				_BomberTrollInstance.muteButton.hover = true;
			} else {
				_BomberTrollInstance.muteButton.hover = false;
			}
		});
		
		$(document).unbind('keyup');
		$(document).keyup(function(e) {
			try {
				parent._gaq.push(['_trackEvent', 'Keyboard', 'ButtonPressed', 'keycode=' + e.keyCode]);
				console_log("Analytics sent.");
			} catch (e) {}
		
			if ((e.keyCode == 27) && !_BomberTrollInstance.state_gameover) {
				// escape
				$(document).unbind('keyup');
				player = new Player();
				ContinueAllSounds();
				StopAllSounds();
				if (_BomberTrollInstance.isActiveScreen) {
					_BomberTrollInstance.isActiveScreen = false;
					jaws.switchGameState(MenuScreen);
				}
			}
			
			if ((e.keyCode == 80) && !_BomberTrollInstance.state_gameover && !_BomberTrollInstance.state_endgame) {
				// p
				if (!_BomberTrollInstance.state_gameover && !_BomberTrollInstance.state_nextlevel) {
					_BomberTrollInstance.isPaused = !_BomberTrollInstance.isPaused;
					_BomberTrollInstance.isPaused ? PauseAllSounds() : ContinueAllSounds();
				}
			}
			
			if (e.keyCode == 77) {
				// m
				soundsEnabled ? DisableSounds() : EnableSounds();
			}
			
			if ((e.keyCode == 13) && !_BomberTrollInstance.state_gameover && !_BomberTrollInstance.state_endgame) {
				// enter
				if (_BomberTrollInstance.airplane != null) {
					_BomberTrollInstance.airplane.dropBomb();
				}
			}
		});
		
		if (isHardMode) {
			player.currentScore *= 2;
		}
		
		// music
		StopBackgroundSounds();
		PlaySound("ingame_music");
	}
	
	/* Called each gametick. Put your gamelogic here. */
	this.update = function() {
		if (!this.isActiveScreen) return;
		
		if (this.airplane != null) {
			this.airplane.stopped = this.isPaused || this.state_nextlevel;
		}
		
		if (this.isPaused) return;
		
		var big_diff = jaws.game_loop.tick_duration;
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
						
							if (isHardMode && (player.currentLevel > 1) && ((this.airplane.bomb.y - this.airplane.bomb.startY) > 220)) {
								this.addFlyingText({x: this.airplane.x, y: this.airplane.y+60}, player.currentLevel + "x bónusz!", false);
								player.multiplier = player.currentLevel;
							} else if (!isHardMode && ((this.airplane.bomb.y - this.airplane.bomb.startY) < 50)) {
								this.addFlyingText({x: this.airplane.x, y: this.airplane.y+60}, "10x bónusz!", false);
								player.multiplier = 10;
							}
						
							this.buildings[i].doDestroyByBomb(this);
							this.addExplosion(this.airplane.bomb);
							StopSound("bomb_falling");
							PlaySound("bomb_explosion");
							this.airplane.bomb = null;
							player.multiplier = 1;
							break;
						}
					}
				}
				
				// megvizsgálja, hogy lezuhant-e a repülõ
				for (var i = 0; i < this.buildings.length; i++) {
					if (this.buildings[i].isCollision(this.airplane.x, this.airplane.y, this.airplane.width, this.airplane.height)) {
						this.addExplosion(this.airplane);
						StopBackgroundSounds();
						PlaySound("plane_explosion");
						PlaySound("plane_crash");
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
						// set mission accomplished screen
						this.state_nextlevel = true;
						
						$('#game_canvas').unbind('click');
						var _BomberTrollInstance = this;
						$("#game_canvas").click(function() {						
							if (_BomberTrollInstance.backButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
								// same as escape
								$(document).unbind('keyup');
								player = new Player();
								ContinueAllSounds();
								StopAllSounds();
								if (_BomberTrollInstance.isActiveScreen) {
									_BomberTrollInstance.isActiveScreen = false;
									jaws.switchGameState(MenuScreen);
								}
							} else if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
								soundsEnabled ? DisableSounds() : EnableSounds();
							} else {
								$('#game_canvas').unbind('click');
								_BomberTrollInstance.nextLevel();
							}
						});
					} else {
						this.addExplosion(this.airplane);
						this.airplane = null;
					}
				}
				
				// ha elfogytak az épületek, akkor felgyorsítja a repülõ zuhanási sebességét
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
						StopBackgroundSounds();
						PlaySound("landing_music");
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
			
			// frissíti a repülõ szövegeket
			for (var i = 0; i < this.flyingTexts.length; i++) {
				if (this.flyingTexts[i] != null) {
					if (!this.flyingTexts[i].isDead()) {
						this.flyingTexts[i].step(diff);
					} else {
						this.flyingTexts[i] = null;
					}
				}
			}
			
			// frissíti a felhõket
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
					
					StopBackgroundSounds();
					PlaySound("crashed_music");
					
					$('#game_canvas').unbind('click');
					var _BomberTrollInstance = this;
					$("#game_canvas").click(function() {					
						if (_BomberTrollInstance.muteButton.isInnerPoint(jaws.mouse_x, jaws.mouse_y)) {
							soundsEnabled ? DisableSounds() : EnableSounds();
						} else {
							$('#game_canvas').unbind('click');
							_BomberTrollInstance.endgame();
						}
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
	}
	
	/* Called each gametick after update(). Put your drawing here. */
	this.draw = function() {
		if (!this.isActiveScreen) return;
	
		jaws.clear();
		this.backgroundSprite.draw();
		
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
		
		// kirajzolja a repülõ pontokat
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
			} else if (player.currentScore < player.getNegativeRecord().score) {
				this.textNegativeRecordHint.draw();
			}
		} else if (this.state_nextlevel) {
			// next level splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textNextLevel.draw();
			this.textNextLevelHint.draw();
		}
		
		// control buttons
		
		if (!this.state_nextlevel && !this.state_gameover) {
			this.pauseButton.draw();
		}
		
		if (!this.state_gameover) {
			this.backButton.draw();
		}
		
		this.muteButton.draw();
		
		// hint
		
		if (isHardMode) {
			this.hardModeHint.draw();
		}
		
		// scoreboard
		
		this.scoreText.str = "Pontszám: " + player.currentScore;
		
		if (!this.state_nextlevel && !this.state_gameover && !this.isPaused && this.background.isDaytime) {
			this.scoreText.draw();
			this.levelText.draw();
		} else {
			this.scoreText.drawWithColor("rgb(200, 200, 200)");
			this.levelText.drawWithColor("rgb(200, 200, 200)");
		}
	}
	
	this.endgame = function() {
		if (this.isActiveScreen) {
			this.isActiveScreen = false;
			
			try {
				parent._gaq.push(['_trackEvent', 'Gameplay', 'LevelFailed', 'level', player.currentLevel]);
				parent._gaq.push(['_trackEvent', 'Gameplay', 'LevelFailed', 'score', player.currentScore]);
				console_log("Level data sent.");
			} catch (e) {}
			
			jaws.switchGameState(HighScoresScreen);
		}
	}
	
	this.nextLevel = function() {
		this.state_nextlevel = false;
		
		try {
			parent._gaq.push(['_trackEvent', 'Gameplay', 'LevelComplete', 'level', player.currentLevel]);
			parent._gaq.push(['_trackEvent', 'Gameplay', 'LevelComplete', 'score', player.currentScore]);
			console_log("Level data sent.");
		} catch (e) {}
		
		player.currentLevel++;
		this.initLevel();
	}
	
	this.addExplosion = function(obj) {
		for (i=0; i<this.explosions.length; i++) {
			if (this.explosions[i] == null) {
				this.explosions[i] = new Explosion(obj);
				return;
			}
		}
		this.explosions[this.explosions.length] = new Explosion(obj);
		console_log("Explosion buffer size increased to " + this.explosions.length);
	}
	
	this.addFlyingText = function(obj, str, isRedNotGreen) {
		for (i=0; i<this.flyingTexts.length; i++) {
			if (this.flyingTexts[i] == null) {
				this.flyingTexts[i] = new FlyingText(obj, str, isRedNotGreen);
				return;
			}
		}
		this.flyingTexts[this.flyingTexts.length] = new FlyingText(obj, str, isRedNotGreen);
		console_log("Flying text buffer size increased to " + this.flyingTexts.length);
	}
}