/*********************************/
/*          BOMBER TROLL         */
/*          ------------         */
/*           HTML5 game          */
/*            by TakRaj          */
/*                               */
/* Based on Bomber Run C64 game  */
/*      created by Les Allan     */
/*               & Angus Ager    */
/*********************************/

/*
*	Game States
*/
function BomberTroll() {
	this.player = null;
	this.previousUpdateTime;
	this.currentUpdateTime;
	this.airplane;
	this.buildings;
	this.scoreText;
	this.levelText;
	this.explosions;
	this.stillAlive = true;
	this.state_gameover = false;
	this.state_nextlevel = false;
	
	this.textGameOver = new Text(150, 300, "Vége a játéknak!", 32, "rgb(255, 255, 255)");
	this.textHighScoreHint = new Text(300, 330, "...de bekerültél a legjobbak közé!", 12, "rgb(255, 255, 255)");
	
	this.textNextLevel = new Text(150, 300, "Sikeres küldetés!", 32, "rgb(255, 255, 255)");
	this.textNextLevelHint = new Text(300, 330, "Kattints a követekző szintre lépéshez!", 12, "rgb(255, 255, 255)");

	/* Called once. Put your one-time initializing here. */
	this.setup = function() {
		this.player = new Player();
		this.initLevel();
	}
	
	this.initLevel = function() {
		this.previousUpdateTime = new Date().getTime();
		this.currentUpdateTime = this.previousUpdateTime;
		
		this.airplane = new Airplane(0, 15, 70, 30, 200 + ((this.player.currentLevel - 1) * this.player.currentLevel), this.player, this)
		this.buildings = new Array();
		this.explosions = new Array();
		
		for (var i = 0; i < 16; i++) {
			// az épület max magassága 16 egység, max szórása lefelé 6 egység
			this.buildings[i] = new Building(i*50, 50, true, Math.min(4 + this.player.currentLevel, 16), Math.min(Math.ceil(this.player.currentLevel / 2.0), 10), this.player);
		}
		
		this.levelText = new Text(jaws.context.canvas.width - 80, 30, "" + this.player.currentLevel + ". szint", 16, "rgb(0, 0, 0)");
		this.scoreText = new Text(20, 30, "Pontszám: " + this.player.currentScore, 16, "rgb(0, 0, 0)");
		
		$('#game_canvas').unbind('click');
		var _BomberTrollInstance = this;
		$("#game_canvas").click(function() {
			if (_BomberTrollInstance.airplane != null) {
				_BomberTrollInstance.airplane.dropBomb();
			}
		});
	}
	
	/* Called each gametick. Put your gamelogic here. */
	this.update = function() {
		this.currentUpdateTime = new Date().getTime();
		var diff = this.currentUpdateTime - this.previousUpdateTime;
		
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
					this.airplane.stopped = true;
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
		
		this.previousUpdateTime = this.currentUpdateTime;
		jaws.log(diff, false);
	}
	
	/* Called each gametick after update(). Put your drawing here. */
	this.draw = function() {
		jaws.clear();
		
		jaws.context.fillStyle = "rgb(0, 0, 0)";
		jaws.context.fillRect(0, jaws.context.canvas.height - 20, jaws.context.canvas.width, 20);
		
		if (this.airplane != null) {
			this.airplane.draw();
		}
		
		for (var i = 0; i < this.buildings.length; i++) {
			this.buildings[i].draw();
		}
		
		// kirajzolja a robbanásokat
		for (var i = 0; i < this.explosions.length; i++) {
			if (this.explosions[i] != null) {
				this.explosions[i].draw();
			}
		}
		
		if (this.state_gameover) {
			// gameover splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textGameOver.draw();
			this.textHighScoreHint.draw();
		} else if (this.state_nextlevel) {
			// next level splash screen
			jaws.context.fillStyle = "rgba(0,0,0, 0.8)";
			jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
			this.textNextLevel.draw();
			this.textNextLevelHint.draw();
		}
		
		this.scoreText.str = "Pontszám: " + this.player.currentScore;
		this.scoreText.draw();
		this.levelText.draw();
	}
	
	this.endgame = function() {
		// todo?
	}
	
	this.nextLevel = function() {
		this.state_nextlevel = false;
		this.player.currentLevel++;
		this.initLevel();
	}
	
	this.addExplosion = function(obj) {
		this.explosions[this.explosions.length] = new Explosion(obj);
	}
}

function Player() {
	this.currentScore = 0;
	this.currentLevel = 1;		// range = 1..12
	
	if (localStorage['highscores'] == null) {
		localStorage['highscores'] = JSON.stringify(this.highscores = new Array());
	} else {
		this.highscores = JSON.parse(localStorage['highscores']);
	}
	
	// eleve rendezetten, ez sokat segít
	this.addHighScore = function(item) {
		updatedList = new Array();
		for (var i = 0; (i < this.highscores.length) || (updatedList.length < 10); i++) {
			if (item.score >= this.highscores[i].score) {
				updatedList[updatedList.length] = item;
			}
			updatedList[updatedList.length] = this.highscores[i];
		}
		
		localStorage['highscores'] = JSON.stringify(this.highscores = updatedList);
	}
}

function HighScoreItem(name, score) {
	this.name = name;
	this.score = score;
}
