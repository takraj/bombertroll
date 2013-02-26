function HighScoresScreen() {
	this.isActiveScreen = true;
	this.textHighScores = new Text(100, 70, "Legjobbak List�ja", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a tov�bbl�p�shez!", 12, "rgb(255, 255, 255)");
	this.textNegativeRecord = new Text(100, 400, "Negat�v rekord: ", 12, "rgb(128, 128, 0)");
	this.textNegativeRecordItem = new Text(120, 420, "-- m�g nincs --", 14, "rgb(255, 255, 0)");
	this.textHSList = new Array();

	this.textFPS = new Text(50, 190, "FPS: 0", 16, "rgb(255, 255, 255)");
	
	this.setup = function() {
		console_log("HighScoresScreen.setup()");
		var _BomberTrollInstance = this;
		var asks = 0;
		
		if (player.currentScore > player.getLowestHighscore().score) {
			answer = window.prompt("Mi a neved?", player.getPlayerName());
			
			if (answer != null) {
				asks++;
				
				while ((answer == "") || (answer.length > 30)) {
					if ((++asks) > 10) {
						answer = "-- ismeretlen --";
						continue;
					}
					if (answer.length > 30) {
						answer = window.prompt("T�l hossz�...\nMi a (r�videbb) neved? MAX 30 karakter legyen!", answer);
					} else {
						answer = window.prompt("Biztos van...\nMi a neved?", "");
					}
				}
				
				player.setPlayerName(answer);
				player.addHighScore(new HighScoreItem(answer, player.currentScore, player.currentLevel, isHardMode));
				
				try {
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewHighScore', 'name: ' + answer]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewHighScore', 'asks', asks]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewHighScore', 'level', player.currentLevel]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewHighScore', 'score', player.currentScore]);
					console_log("Analytics sent.");
				} catch (e) {}
			} else {
				try {
					parent._gaq.push(['_trackEvent', 'HighScores', 'HighScoreInputCancelled', 'level', player.currentLevel]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'HighScoreInputCancelled', 'score', player.currentScore]);
					console_log("Analytics sent.");
				} catch (e) {}
			}
		} else if (player.currentScore < player.getNegativeRecord().score) {
			answer = window.prompt("NEGAT�V REKORD!! Mi a neved?", player.getPlayerName());
			
			if (answer != null) {
				asks++;
				
				while ((answer == "") || (answer.length > 30)) {
					if ((++asks) > 10) {
						answer = "-- ismeretlen --";
						continue;
					}
					if (answer.length > 30) {
						answer = window.prompt("T�l hossz�...\nMi a (r�videbb) neved? MAX 30 karakter legyen!", answer);
					} else {
						answer = window.prompt("Pedig h�res is lehetn�l...\nMi a neved?", "");
					}
				}
				
				player.setPlayerName(answer);
				player.setNegativeRecord(new HighScoreItem(answer, player.currentScore, player.currentLevel, isHardMode));
				
				try {
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewNegativeRecord', 'name: ' + answer]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewNegativeRecord', 'asks', asks]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewNegativeRecord', 'level', player.currentLevel]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NewNegativeRecord', 'score', player.currentScore]);
					console_log("Analytics sent.");
				} catch (e) {}
			} else {
				try {
					parent._gaq.push(['_trackEvent', 'HighScores', 'NegativeRecordInputCancelled', 'level', player.currentLevel]);
					parent._gaq.push(['_trackEvent', 'HighScores', 'NegativeRecordInputCancelled', 'score', player.currentScore]);
					console_log("Analytics sent.");
				} catch (e) {}
			}
		}
		
		this.textNegativeRecordItem.str = player.getNegativeRecord().name + "                  ( " + player.getNegativeRecord().score + " pont @ lvl "+ player.getNegativeRecord().level +" )";
		
		this.textHSList[0] = new Text(150, 130, "N�v", 12, "rgb(255, 255, 255)");
		this.textHSList[1] = new Text(500, 130, "Pontsz�m", 12, "rgb(255, 255, 255)");
		this.textHSList[2] = new Text(600, 130, "Szint", 12, "rgb(255, 255, 255)");
		this.textHSList[3] = new Text(650, 130, "J�t�km�d", 12, "rgb(255, 255, 255)");
		
		for (var i = 0; i < player.highscores.length; i++) {
			if (player.highscores[i].name == null) {
				player.highscores[i].name = "-- ismeretlen --";
			}
			if (player.highscores[i].score == null) {
				player.highscores[i].score = "- n/a -";
			}
			if (player.highscores[i].level == null) {
				player.highscores[i].level = "- n/a -";
			}
			if (player.highscores[i].mode == null) {
				player.highscores[i].mode = false;
			}
			
			this.textHSList[3 + (i * 5) + 1] = new Text(120, 160 + (i * 20), "" + (i+1) + ".", 12, "rgb(175, 175, 175)");
			this.textHSList[3 + (i * 5) + 2] = new Text(150, 160 + (i * 20), player.highscores[i].name, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 3] = new Text(500, 160 + (i * 20), player.highscores[i].score, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 4] = new Text(600, 160 + (i * 20), player.highscores[i].level, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 5] = new Text(650, 160 + (i * 20), (player.highscores[i].mode ? "Neh�z" : "K�nny�"), 12, "rgb(255, 255, 255)");
		}
		
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function() {
			$('#game_canvas').unbind('click');
			if (_BomberTrollInstance.isActiveScreen) {
				_BomberTrollInstance.isActiveScreen = false;
				jaws.switchGameState(MenuScreen);
			}
		});
		
		player = new Player();
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
		
		this.textHighScores.draw();
		this.textClickToContinue.draw();
		
		for (var i = 0; i < this.textHSList.length; i++) {
			this.textHSList[i].draw();
		}
		
		this.textNegativeRecord.draw();
		this.textNegativeRecordItem.draw();
		
		if (debug_fps_osd) {
			try {
				this.textFPS.str = "FPS: " + jaws.game_loop.fps;
				this.textFPS.draw();
			} catch (e) {}
		}
	}
}