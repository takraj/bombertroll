function PauseButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hover = false;
	this.tooltip = new Text(x - 40, y - 14, "Megállítás", 14, "rgb(255, 255, 255)");
	
	this.isInnerPoint = function(x, y) {
		return ((x >= this.x) && (y >= this.y) && (x <= (this.x + this.width + 2)) && (y <= (this.y + this.height + 2)));
	}
	
	this.draw = function() {		
		if (this.hover) {
			jaws.context.fillStyle = "rgb(255,255,255)";
		} else {
			jaws.context.fillStyle = "rgba(255,255,255, 0.5)";
		}
		jaws.context.fillRect(this.x, this.y, (this.width / 3.0), this.height);
		jaws.context.fillRect(this.x + ((this.width * 2.0) / 3.0), this.y, (this.width / 3.0), this.height);
		
		// tooltip
		if (this.hover) {
			jaws.context.fillStyle = "rgba(0,0,0, 0.7)";
			jaws.context.fillRect (this.tooltip.x - 6, this.tooltip.y - 18, 75, 26);
			this.tooltip.draw();
		}
	}
}