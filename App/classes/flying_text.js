function FlyingText(obj, str, isRedNotGreen) {
	this.maxLife = 2000.0;		// Life in ms
	this.life = 0.0;
	this.txt = new Text(obj.x, obj.y, str, 20, "rgb(255, 255, 255)");
	this.shadow = new Text(obj.x - 1, obj.y + 1, str, 20, "rgba(0, 0, 0, 0.5)");
	this.start_y = obj.y;
	this.end_y = Math.max(obj.y - 100, 0);
	this.isRed = isRedNotGreen;
	
	this.step = function(diff) {
		this.life += diff;
	}
	
	this.isDead = function() {
		return (this.life >= this.maxLife);
	}
	
	this.draw = function() {
		this.txt.y = ((this.end_y - this.start_y) * (this.life/this.maxLife)) + this.start_y;
		this.shadow.y = this.txt.y + 1;
		this.shadow.draw();
		if (this.isRed) {
			this.txt.color = "rgb(255, 0, 0)";
		} else {
			this.txt.color = "rgb(0, 255, 0)";
		}
		this.txt.draw();
	}
}