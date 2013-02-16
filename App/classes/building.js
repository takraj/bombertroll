function Building(x, width, isDaytime, maxFloors, minFloors, player) {
	this.x = x;
	this.width = width;
	this.rgbString = new ColorString(Math.random(), Math.random(), Math.random()).mul(255).toString();
	this.player = player;
	
	if (!isDaytime) {
		this.rgbString = new ColorString(Math.random(), Math.random(), Math.random()).mul(128).toString();
	}
	
	this.baseElement = new BaseElement(x, 20, width, this.rgbString, isDaytime, Math.round(minFloors + (maxFloors-minFloors) * Math.random()), this);
	
	// Megadja az épület jelenlegi elemszámát (magasságát)
	this.getHeight = function() {
		result = 0;
		
		if (this.baseElement != null) {
			element = this.baseElement;
			
			while (element != null) {
				result += element.height;
				element = element.childElement;
			}
		}
		
		return result;
	}
	
	// Ütközést vizsgál egy befoglaló négyzettel
	this.isCollision = function(x, y, w, h) {
		if (this.baseElement != null) {
			height = this.getHeight();
			return jaws.collideRects(new jaws.Rect(x, y, w, h), new jaws.Rect(this.x, jaws.context.canvas.height - 20 - height, this.width, height)); 
		} else {
			return false;
		}
	}
	
	// Megpróbálja elpusztítani az épületet
	this.doDestroyByBomb = function(scene) {
		if (this.baseElement != null) {
			element = this.baseElement;
			
			while (element != null) {
				if (element.childElement == null) {
					element.destroy(scene);
					break;
				} else {
					element = element.childElement;
				}
			}
		}
	}
	
	// Rajzoló függvény
	this.draw = function() {
		if (this.baseElement != null) {
			this.baseElement.draw();
		}
	}
}

// 4 féle (a 4. legyen átmenetes, torony típusú)
function BaseElement(x, shiftUp, width, color, isDaytime, numberOfFloors, building) {
	this.x = x;
	this.width = width;
	this.type = Math.round(Math.random() * 2);	// típus generálása
	this.color = color;
	this.isDaytime = isDaytime;
	this.building = building;
	
	this.height = 20;
	this.y = jaws.context.canvas.height - shiftUp;
	this.player = building.player;
	
	// ablakok színének generálása
	this.wndColors = new Array();
	for (var i = 0; i < 50; i++) {
		if (!this.isDaytime) {
			this.wndColors[i] = ((Math.random() >= 0.5) ? "rgb(0,0,0)" : "rgb(255,255,0)");
		} else {
			this.wndColors[i] = "rgb(0,0,0)";
		}
	}
	
	// Maga fölé épít, amíg lehet
	if (numberOfFloors > 1) {
		this.childElement = new FloorElement(this, true, numberOfFloors-1);
	} else {
		this.childElement = new RoofElement(this);
	}
	
	this.tryDestroy = function(scene) {
		if (Math.random() > 0.1) {
			this.destroy(scene);
		} else {
			PlaySound("building_collapse");
		}
	}
	
	this.destroy = function(scene) {
		scene.addExplosion(this);
		PlaySound("building_collapse");
		var addpoints = 18;
		if (isHardMode) {
			addpoints += (this.player.currentLevel-1);
		}
		addpoints *= this.player.multiplier;
		scene.addFlyingText(this, "+"+addpoints+" pont", false);
		this.player.currentScore += addpoints;
		this.building.baseElement = null;
		this.building = null;
	}

	// Rajzoló függvény
	this.draw = function() {
		jaws.context.fillStyle = this.color;
		jaws.context.fillRect(this.x, this.y - this.height, this.width, this.height);
		
		switch (this.type) {
		case 0:
			// ajtó
			jaws.context.fillStyle = "rgb(111, 78, 47)";
			jaws.context.fillRect(this.x + (this.width * 0.6), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.6);
			
			// ablak
			jaws.context.fillStyle = this.wndColors[0];
			jaws.context.fillRect(this.x + (this.width * 0.2), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			break;
		case 1:
			// ajtó
			jaws.context.fillStyle = "rgb(111, 78, 47)";
			jaws.context.fillRect(this.x + (this.width * 0.2), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.6);
			
			// ablak
			jaws.context.fillStyle = this.wndColors[1];
			jaws.context.fillRect(this.x + (this.width * 0.6), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			break;
		case 2:
			// ajtó
			jaws.context.fillStyle = this.wndColors[2];
			jaws.context.fillRect(this.x + (this.width * 0.4), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.6);
			
			// bal ablak
			jaws.context.fillStyle = this.wndColors[3];
			jaws.context.fillRect(this.x + (this.width * 0.1), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			
			// jobb ablak
			jaws.context.fillStyle = this.wndColors[4];
			jaws.context.fillRect(this.x + (this.width * 0.7), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			break;
		}
		
		if (this.childElement != null) {
			this.childElement.draw();
		}
	}
}

// 4 féle
function FloorElement(parentElement, generate, numberOfFloors) {
	this.height = 20;
	
	this.parentElement = parentElement;
	this.x = parentElement.x;
	this.y = parentElement.y - this.height;
	this.width = parentElement.width;
	this.color = parentElement.color;
	this.isDaytime = parentElement.isDaytime;
	
	this.type = (generate ? Math.round(Math.random() * 2) : parentElement.type); // típus generálása, ha ő az első, amúgy örököl
	this.player = parentElement.player;
	
	// ablakok színének generálása
	this.wndColors = new Array();
	for (var i = 0; i < 50; i++) {
		if (!this.isDaytime) {
			this.wndColors[i] = ((Math.random() >= 0.5) ? "rgb(0,0,0)" : "rgb(255,255,0)");
		} else {
			this.wndColors[i] = "rgb(0,0,0)";
		}
	}
	
	// Maga fölé épít amíg lehet
	if (numberOfFloors > 1) {
		this.childElement = new FloorElement(this, false, numberOfFloors-1);
	} else {
		this.childElement = new RoofElement(this);
	}
	
	this.tryDestroy = function(scene) {
		if (Math.random() > 0.1) {
			this.destroy(scene);
		} else {
			PlaySound("building_collapse");
		}
	}
	
	this.destroy = function(scene) {
		scene.addExplosion(this);
		var addpoints = 15;
		if (isHardMode) {
			addpoints += (this.player.currentLevel-1);
		}
		addpoints *= this.player.multiplier;
		scene.addFlyingText(this, "+"+addpoints+" pont", false);
		this.player.currentScore += addpoints;
		this.parentElement.childElement = null;
		this.parentElement.tryDestroy(scene);
		this.parentElement = null;
	}

	// Rajzoló függvény
	this.draw = function() {
		jaws.context.fillStyle = this.color;
		jaws.context.fillRect(this.x, this.y - this.height, this.width, this.height);
		
		switch (this.type) {
		case 0:
			// bal ablak
			jaws.context.fillStyle = this.wndColors[5];
			jaws.context.fillRect(this.x + (this.width * 0.1), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			
			// középső ablak
			jaws.context.fillStyle = this.wndColors[6];
			jaws.context.fillRect(this.x + (this.width * 0.4), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			
			// jobb ablak
			jaws.context.fillStyle = this.wndColors[7];
			jaws.context.fillRect(this.x + (this.width * 0.7), this.y - (this.height * 0.6), this.width * 0.2, this.height * 0.4);
			break;
		case 1:
			jaws.context.fillStyle = this.wndColors[8];
			jaws.context.fillRect(this.x + (this.width * 0.1), this.y - (this.height * 0.6), this.width * 0.8, this.height * 0.4);
			break;
		case 2:
			// bal ablak
			jaws.context.fillStyle = this.wndColors[9];
			jaws.context.fillRect(this.x + (this.width * 0.4), this.y - (this.height * 0.9), this.width * 0.1, this.height * 0.95);
			
			// középső ablak
			jaws.context.fillStyle = this.wndColors[10];
			jaws.context.fillRect(this.x + (this.width * 0.6), this.y - (this.height * 0.9), this.width * 0.1, this.height * 0.95);
			
			// jobb ablak
			jaws.context.fillStyle = this.wndColors[11];
			jaws.context.fillRect(this.x + (this.width * 0.8), this.y - (this.height * 0.9), this.width * 0.1, this.height * 0.95);
			break;
		}
		
		if (this.childElement != null) {
			this.childElement.draw();
		}
	}
}

// 4 féle: lapostető, egycsúcsos, 3 csúcsos, torony típusú csúcsos (órával)
function RoofElement(parentElement) {
	this.height = 20;
	
	this.parentElement = parentElement;
	this.x = parentElement.x;
	this.y = parentElement.y - this.height;
	this.width = parentElement.width;
	
	this.type = Math.round(Math.random() * 2);	// típus generálása
	this.player = parentElement.player;
	
	if ((this.type == 1) || (Math.random() > 0.7)) {
		this.color = "rgb(0, 0, 0)";
	} else {
		this.color = "rgb(255, 0, 0)";
	}
	
	this.destroy = function(scene) {
		scene.addExplosion(this);
		var addpoints = 5;
		if (isHardMode) {
			addpoints += (this.player.currentLevel-1);
		}
		addpoints *= this.player.multiplier;
		scene.addFlyingText(this, "+"+addpoints+" pont", false);
		this.player.currentScore += addpoints;
		this.parentElement.childElement = null;
		this.parentElement.tryDestroy(scene);
		this.parentElement = null;
	}

	// Rajzoló függvény
	this.draw = function() {
		jaws.context.fillStyle = this.color;
	
		switch (this.type) {
		case 0:
			jaws.context.fillRect(this.x, this.y - this.height, this.width, this.height/2.0);
			jaws.context.fillStyle = parentElement.color;
			jaws.context.fillRect(this.x, this.y - (this.height/2.0), this.width, this.height/2.0);
			break;
		case 1:
			jaws.context.beginPath();
			jaws.context.moveTo(this.x, this.y);
			jaws.context.lineTo(this.x + (this.width / 2.0), this.y - this.height);
			jaws.context.lineTo(this.x + this.width, this.y);
			jaws.context.fill();
			break;
		case 2:
			// bal csúcs
			jaws.context.beginPath();
			jaws.context.moveTo(this.x, this.y);
			jaws.context.lineTo(this.x + (this.width / 4.0), this.y - (this.height / 2.0));
			jaws.context.lineTo(this.x + (this.width / 2.0), this.y);
			jaws.context.fill();
			
			// jobb csúcs
			jaws.context.beginPath();
			jaws.context.moveTo(this.x + (this.width / 2.0), this.y);
			jaws.context.lineTo(this.x + ((this.width * 3) / 4.0), this.y - (this.height / 2.0));
			jaws.context.lineTo(this.x + this.width, this.y);
			jaws.context.fill();
			
			// középső csúcs
			jaws.context.beginPath();
			jaws.context.moveTo(this.x + (this.width / 4.0), this.y);
			jaws.context.lineTo(this.x + (this.width / 2.0), this.y - this.height);
			jaws.context.lineTo(this.x + ((this.width * 3) / 4.0), this.y);
			jaws.context.fill();
			break;
		}
	}
}
