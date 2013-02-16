﻿function AnimatedButton(x, y, width, height, label) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.state = 0.0;
	this.hover = false;
	
	this.textLabel = new Text(this.x + 30, this.y + this.height - 12, label, 24, "rgb(255, 255, 255)");
	this.textLabelShadow = new Text(this.x + 31, this.y + this.height - 11, label, 24, "rgb(0, 0, 0)");
	
	this.isInnerPoint = function(x, y) {
		return ((x > this.x) && (y > this.y) && (x < (this.x + this.width)) && (y < (this.y + this.height)));
	}
	
	this.step = function(diff)
	{
		if (this.hover) {
			this.state = Math.min(this.state + (diff / 300), 1);
		} else {
			this.state = Math.max(this.state - (diff / 300), 0);
		}
	}
	
	this.draw = function() {
		this.textLabelShadow.draw();
		
		if (this.hover) {
			jaws.context.fillStyle = "rgb(128,64,0)";
		} else {
			jaws.context.fillStyle = "rgba(0,0,0, 0.5)";
		}
		jaws.context.fillRect(this.x, this.y, ((this.width - 20) * this.state) + 20, this.height);
		
		this.textLabel.draw();
	}
}