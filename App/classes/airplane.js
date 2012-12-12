function Airplane(x, y, width, height, velocity, player, scene) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.velocity = velocity;
	this.fallingSpeed = velocity/60.0;
	this.go_right = true;
	this.player = player;
	this.speedup = false;	// gyorsabb zuhanási sebesség bekapcsolása (ha elfogytak a házak)
	this.scene = scene;
	this.stopped = false;
	
	this.bomb = null;
	
	this.dropBomb = function() {
		if ((this.bomb == null) && (!this.stopped)) {
			this.bomb = new Bomb(((2 * this.x) + this.width) / 2.0, this.y + this.height);
		}
	}
	
	this.draw = function() {
		if (this.bomb != null) {
			this.bomb.draw();
		}
		jaws.context.fillStyle = "rgb(150,29,28)";
		jaws.context.fillRect (this.x, this.y, this.width, this.height);
	}
	
	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}
	
	this.step = function(diff)
	{
		if (this.stopped) {
			return;
		}
	
		this.y += this.fallingSpeed * (diff/1000) * (this.speedup ? 20.0 : 1.0);
		
		if (this.bomb != null) {
			this.bomb.step(diff);
			
			if (this.bomb.y >= jaws.context.canvas.height - 20) {
				this.scene.addExplosion(this.bomb);
				this.bomb = null;
				this.player.currentScore -= 500;
			}
		}
	
		if (this.x > 800) {
			this.go_right = false;
		}
		else if (this.x < -this.width) {
			this.go_right = true;
		}
		
		if (this.go_right) {
			this.x += this.velocity * (diff/1000);
		} else {
			this.x -= this.velocity * (diff/1000);
		}
	}
}

function Bomb(x, y) {
	this.x = x;
	this.y = y;
	
	this.width = 10;
	this.height = 10;
	this.velocity = 100;
	
	this.draw = function() {
		jaws.context.fillStyle = "rgb(150,29,28)";
		jaws.context.fillRect (this.x, this.y, this.width, this.height);
	}
	
	this.step = function(diff)
	{	
		this.y += this.velocity * (diff/1000);
		this.velocity += 100 * (diff/1000);
	}
}