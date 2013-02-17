function MuteButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hover = false;
	this.tooltip = new Text(x + 4, y - 14, "Némítás", 14, "rgb(255, 255, 255)");
	
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
		// mágnes felső része
		jaws.context.moveTo(this.x, this.y + (this.height / 3.0));
		jaws.context.lineTo(this.x + (this.width / 4.0), this.y + (this.height / 3.0));
		
		// membrán
		jaws.context.lineTo(this.x + this.width * 0.8, this.y);
		jaws.context.lineTo(this.x + this.width * 0.8, this.y + this.height);
		
		// mágnes alsó része
		jaws.context.lineTo(this.x + (this.width / 4.0), this.y + (2 * this.height / 3.0));
		jaws.context.lineTo(this.x, this.y + (2 * this.height / 3.0));
		
		jaws.context.fill();
		
		// áthúzás
		if (!soundsEnabled) {
			jaws.context.beginPath();
			jaws.context.moveTo(this.x, this.y + this.height);
			jaws.context.lineTo(this.x + this.width, this.y);
			jaws.context.lineTo(this.x + this.width, this.y + (this.height / 4.0));
			jaws.context.lineTo(this.x + (this.width / 4.0), this.y + this.height);
			jaws.context.fill();
		}
		
		// tooltip
		if (this.hover) {
			jaws.context.fillStyle = "rgba(0,0,0, 0.7)";
			jaws.context.fillRect (this.tooltip.x - 6, this.tooltip.y - 18, 65, 26);
			this.tooltip.draw();
		}
	}
}