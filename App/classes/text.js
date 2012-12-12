function Text(x, y, str, size, color) {
	this.x = x;
	this.y = y;
	this.str = str;
	this.size = size;
	this.color = color;
	
	this.draw = function() {
		jaws.context.fillStyle = this.color;
		jaws.context.font = "" + this.size + "px Helvetica";
		jaws.context.fillText(this.str, this.x, this.y);
	}
}