function FlyingText(obj, str, isRedNotGreen) {
	
	// initializer (aka: constructor)
	this.init = function(obj, str, isRedNotGreen) {
		this.maxLife = 2000.0 + ((Math.random() - 0.2) * 400.0);		// Life in ms
		this.life = 0.0;
		this.txt = new Text(obj.x, obj.y, str, 20, "rgba(255, 255, 255, 0.0)");
		this.shadow = new Text(obj.x - 1, obj.y + 1, str, 20, "rgba(0, 0, 0, 0.5)");
		this.start_y = obj.y;
		this.end_y = Math.max(obj.y - 100, 0);
		
		if (isRedNotGreen) {
			this.colorObject = new ColorString(255, 0, 0);
		} else {
			this.colorObject = new ColorString(0, 255, 0);
		}
		
		this.shadowColorObject = new ColorString(0, 0, 0);
		this.shadowColorObject.alpha = 0.5;
		
		return this;
	}
	
	// call init
	this.init(obj, str, isRedNotGreen);
	
	this.step = function(diff) {
		this.life += diff;
		
		this.txt.y = this.start_y - Math.round(this.life / 20.0);
		this.shadow.y = this.txt.y + 1;
		
		if ((this.maxLife - this.life) < 250) {
			this.colorObject.alpha = (this.maxLife - this.life) / 250.0;
			this.shadowColorObject.alpha = Math.max(0.0, this.colorObject.alpha - 0.5);
		}
		
		if (isMobileDevice) {
			this.txt.color = this.colorObject.toString();
			this.shadow.color = this.shadowColorObject.toString();
		} else {
			this.txt.color = this.colorObject.toAlphaString();
			this.shadow.color = this.shadowColorObject.toAlphaString();
		}
	}
	
	this.isDead = function() {
		return (this.life >= this.maxLife);
	}
	
	this.kill = function() {
		this.life = this.maxLife;
	}
	
	this.draw = function() {
		this.shadow.draw();
		this.txt.draw();
	}
}