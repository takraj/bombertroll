function BackButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hover = false;
	
	this.isInnerPoint = function(x, y) {
		return ((x >= this.x) && (y >= this.y) && (x <= (this.x + this.width + 2)) && (y <= (this.y + this.height + 2)));
	}
	
	this.draw = function() {		
		if (this.hover) {
			jaws.context.fillStyle = "rgb(255,255,255)";
		} else {
			jaws.context.fillStyle = "rgba(255,255,255, 0.5)";
		}
		
		jaws.context.beginPath();
		jaws.context.moveTo(this.x, this.y + (this.height / 2.0));
		jaws.context.lineTo(this.x + this.width, this.y);
		jaws.context.lineTo(this.x + this.width, this.y + this.height);
		jaws.context.fill();
	}
}