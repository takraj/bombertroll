function HighScoresScreen() {
	this.textHighScores = new Text(100, 70, "Legjobbak Listája", 32, "rgb(255, 255, 255)");
	this.textClickToContinue = new Text(600, 450, "Kattints a továbblépéshez!", 12, "rgb(255, 255, 255)");
	this.textHSList = new Array();

	this.setup = function() {
		if (player.currentScore > player.getLowestHighscore().score) {
			answer = window.prompt("Mi a neved?", "");
			
			while (answer == "") {
				answer = window.prompt("Biztos van...\nMi a neved?", "");
			}
			
			player.addHighScore(new HighScoreItem(answer, player.currentScore, player.currentLevel, isHardMode));
		}
		
		this.textHSList[0] = new Text(150, 130, "Név", 12, "rgb(255, 255, 255)");
		this.textHSList[1] = new Text(450, 130, "Pontszám", 12, "rgb(255, 255, 255)");
		this.textHSList[2] = new Text(550, 130, "Szint", 12, "rgb(255, 255, 255)");
		this.textHSList[3] = new Text(650, 130, "Játékmód", 12, "rgb(255, 255, 255)");
		
		for (var i = 0; i < player.highscores.length; i++) {
			this.textHSList[3 + (i * 5) + 1] = new Text(120, 160 + (i * 20), "" + (i+1) + ".", 12, "rgb(175, 175, 175)");
			this.textHSList[3 + (i * 5) + 2] = new Text(150, 160 + (i * 20), player.highscores[i].name, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 3] = new Text(450, 160 + (i * 20), player.highscores[i].score, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 4] = new Text(550, 160 + (i * 20), player.highscores[i].level, 12, "rgb(255, 255, 255)");
			this.textHSList[3 + (i * 5) + 5] = new Text(650, 160 + (i * 20), (player.highscores[i].mode ? "Nehéz" : "Könnyű"), 12, "rgb(255, 255, 255)");
		}
		
		$('#game_canvas').unbind('click');
		$("#game_canvas").click(function() {
			$('#game_canvas').unbind('click');
			jaws.start(MenuScreen, {fps: 30});
		});
		
		player = new Player();
	}
	
	this.update = function() {
	}
	
	this.draw = function() {
		jaws.clear();
		jaws.context.fillStyle = "rgb(0,0,0)";
		jaws.context.fillRect (0, 0, jaws.context.canvas.width, jaws.context.canvas.height);
		
		this.textHighScores.draw();
		this.textClickToContinue.draw();
		
		for (var i = 0; i < this.textHSList.length; i++) {
			this.textHSList[i].draw();
		}
	}
}