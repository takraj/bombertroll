function ColorString(red, green, blue) {		// 0..255

	this.red = Math.min(Math.max(0, red), 255);
	this.green = Math.min(Math.max(0, green), 255);
	this.blue = Math.min(Math.max(0, blue), 255);
	this.alpha = 1.0;

	this.toString = function() {
		return "rgb(" + Math.floor(this.red) + "," + Math.floor(this.green) + "," + Math.floor(this.blue) + ")";
	}
	
	this.toAlphaString = function() {
		return "rgba(" + Math.floor(this.red) + "," + Math.floor(this.green) + "," + Math.floor(this.blue) + ", "+ this.alpha +")";
	}
	
	this.mul = function(n) {
		return new ColorString(n * this.red, n * this.green, n * this.blue);
	}
}