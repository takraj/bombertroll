function PauseButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hover = false;
	
	this.isInnerPoint = function(x, y) {
		return ((x > this.x) && (y > this.y) && (x < (this.x + this.width)) && (y < (this.y + this.height)));
	}
	
	this.draw = function() {		
		if (this.hover) {
			jaws.context.fillStyle = "rgb(255,255,255)";
		} else {
			jaws.context.fillStyle = "rgba(255,255,255, 0.5)";
		}
		jaws.context.fillRect(this.x, this.y, (this.width / 3.0), this.height);
		jaws.context.fillRect(this.x + ((this.width * 2.0) / 3.0), this.y, (this.width / 3.0), this.height);
	}
}