﻿function Explosion(obj) {
	this.maxLife = 1000.0;		// Life in ms
	this.life = 0.0;
	this.centerX = (obj.x + (obj.x + obj.width)) / 2.0;
	this.centerY = (obj.y + (obj.y + obj.height)) / 2.0;
	this.minRadius = 10;
	this.maxRadius = 100;
	
	this.step = function(diff) {
		this.life += diff;
	}
	
	this.isDead = function() {
		return (this.life >= this.maxLife);
	}
	
	this.draw = function() {
		r = ((this.maxRadius - this.minRadius) * (this.life/this.maxLife)) + this.minRadius;
		ctx = jaws.context;
	
		ctx.beginPath();
		rad = ctx.createRadialGradient(this.centerX, this.centerY, 1, this.centerX, this.centerY, r);
		rad.addColorStop(0, 'rgba(255, 0, 0 , ' + (1-(0.5 + (0.5 * (this.life / this.maxLife)))) + ' )');
		rad.addColorStop(1, 'rgba(255, 255, 0 , ' + (1-(this.life / this.maxLife)) + ')');
		ctx.fillStyle = rad;
		ctx.arc(this.centerX, this.centerY, r, 0, Math.PI*2, false);
		ctx.fill();
	}
}