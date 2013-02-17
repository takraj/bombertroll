function CreditsWidget(x, y) {
	this.life = 0;
	this.x = x;
	this.y = y;
	
	this.text_Title = null;
	this.text_Contrib = null;
	this.holdTime = 6000;
	this.textState = 0;
	this.textColorObject = new ColorString(255, 255, 255);
	
	this.draw = function() {		
		if (this.text_Title != null) {
			this.text_Title.draw();
		}
		
		if (this.text_Contrib != null) {
			for (i=0; i<this.text_Contrib.length; i++) {
				this.text_Contrib[i].draw();
			}
		}
	}
	
	this.step = function(diff) {
		this.life += diff;
		this.life %= 8 * this.holdTime;
		this.setTexts();
	}
	
	this.addContributor = function(str) {
		this.text_Contrib[this.text_Contrib.length] = new Text(this.x+15, this.y+20 + (this.text_Contrib.length * 15), str, 10, this.textColorObject.toAlphaString());
	}
	
	this.setupColors = function() {
		if (this.text_Title != null) {
			this.text_Title.color = this.textColorObject.toAlphaString();
		}
		
		if (this.text_Contrib != null) {
			for (i=0; i<this.text_Contrib.length; i++) {
				this.text_Contrib[i].color = this.textColorObject.toAlphaString();
			}
		}
	}
	
	this.setTexts = function() {
		// setup alpha
		var cycle = (this.life % this.holdTime);
		var div6 = (this.holdTime / 6.0);
		
		if (cycle < div6) {
			this.textColorObject.alpha = cycle / div6;
		} else if (cycle > (5*div6)) {
			this.textColorObject.alpha = 1 - ((cycle - (5*div6)) / div6);
		} else {
			this.textColorObject.alpha = 1.0;
		}
		this.textColorObject.alpha = Math.min(Math.max(this.textColorObject.alpha / 2.0, 0.0), 0.5);
	
		// setup strings
		if (this.life <= this.holdTime) {
			// CODE
			if (this.textState != 1) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Programozta:", 14, this.textColorObject.toAlphaString());
				this.addContributor("Takács Rajmund   (TakRaj)");
				
				// change state
				this.textState = 1;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (2*this.holdTime)) {
			// BACKGROUNDS
			if (this.textState != 2) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Hátterek:", 14, this.textColorObject.toAlphaString());
				this.addContributor("zhihan (zhihan08.blogspot.com)");
				this.addContributor("Earl Baumgardner (earlb.com)");
				this.addContributor("budapest-foto.hu");
				this.addContributor("Rhonda (one2one-removals.com.au)");
				this.addContributor("Osvát András (hu.wikipedia.org)");
				this.addContributor("Bobby Alcott (bobbyalcottweddings.com)");
				this.addContributor("wallsfeed.com");
				this.addContributor("cityhdwallpapers.com");
				
				// change state
				this.textState = 2;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (3*this.holdTime)) {
			// SPRITES
			if (this.textState != 3) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Rajzok:", 14, this.textColorObject.toAlphaString());
				this.addContributor("Takács Rajmund   (TakRaj)");
				this.addContributor("rg1024 (openclipart.org)");
				this.addContributor("animationbuddy.com");
				this.addContributor("philipp (clker.com)");
				
				// change state
				this.textState = 3;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (4*this.holdTime)) {
			// SFX
			if (this.textState != 4) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Hangok:", 14, this.textColorObject.toAlphaString());
				this.addContributor("grsites.com");
				this.addContributor("sarge4267 (freesound.org)");
				this.addContributor("Omar Alvarado (freesound.org)");
				this.addContributor("Portbot (freesound.org)");
				this.addContributor("CGEffex (freesound.org)");
				
				// change state
				this.textState = 4;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (5*this.holdTime)) {
			// MUSIC
			if (this.textState != 5) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Zenék:", 14, this.textColorObject.toAlphaString());
				this.addContributor("RED - Skifa2");
				this.addContributor("Skuter - Turbo Outrun Highscore");
				this.addContributor("Nula - Beery");
				this.addContributor("Gargaj - Evilchip");
				
				// change state
				this.textState = 5;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (6*this.holdTime)) {
			// SPECIAL THANKS
			if (this.textState != 6) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Külön köszönet:", 14, this.textColorObject.toAlphaString());
				this.addContributor("Takács Viktor   (TakVik)");
				this.addContributor("Fehér Marcell");
				
				// change state
				this.textState = 6;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else if (this.life <= (7*this.holdTime)) {
			// ORIGINAL GAME
			if (this.textState != 7) {
				this.text_Contrib = new Array();
				// create texts
				
				this.text_Title = new Text(this.x, this.y, "Eredeti ötlet:", 14, this.textColorObject.toAlphaString());
				this.addContributor("Bomber Run   (Commodore 64)");
				this.addContributor("");
				this.addContributor("(c) Les Allan & Angus Ager");
				this.addContributor("        Sunshine Publications Ltd. / 1983");
				
				// change state
				this.textState = 7;
			} else {
				// change transparencies
				this.setupColors();
			}
		} else {
			// SHORT BREAK
			this.textColorObject.alpha = 0.0;
			this.setupColors();
		}
	}
}