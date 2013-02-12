function Airplane(x, y, velocity, player, scene) {
	this.x = x;
	this.y = y;
	this.width = 65;
	this.height = 35;
	this.velocity = velocity;
	this.fallingSpeed = velocity/60.0;
	this.go_right = true;
	this.player = player;
	this.speedup = false;	// gyorsabb zuhanási sebesség bekapcsolása (ha elfogytak a házak)
	this.scene = scene;
	this.stopped = false;
	this.bomb = null;
	
	this.spritesheet = new jaws.SpriteSheet({image: "images/airplane.png", frame_size: [67,50] });
	this.anim = new jaws.Animation({frames: this.spritesheet.frames, frame_duration: 80});
	this.sprite = new jaws.Sprite({image: "images/airplane.png", x: 0, y: 0, scale: 1, anchor: "top_left"});
	this.sprite.flip();
	
	this.dropBomb = function() {
		if ((this.bomb == null) && (!this.stopped)) {
			this.bomb = new Bomb(((2 * this.x) + this.width) / 2.0, this.y + this.height, this);
		}
	}
	
	this.draw = function() {
		if (this.bomb != null) {
			this.bomb.draw();
		}
		
		if (!this.stopped) {
			this.anim.update();
			if (this.anim.atLastFrame()) {
				this.anim.index = 0;
			}
			this.sprite.setImage(this.anim.next());
		}
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		
		if (this.go_right) {
			this.sprite.x += this.width;
		}
		
		this.sprite.draw();
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
			if (this.go_right) {
				this.sprite.flip();
			}
			this.go_right = false;
		}
		else if (this.x < -this.width) {
			if (!this.go_right) {
				this.sprite.flip();
			}
			this.go_right = true;
		}
		
		if (this.go_right) {
			this.x += this.velocity * (diff/1000);
		} else {
			this.x -= this.velocity * (diff/1000);
		}
	}
}

function Bomb(x, y, airplane) {
	this.sprite = new jaws.Sprite({image: "images/bomba.png", x: 0, y: 0, scale: 1, anchor: "center"});
	this.x = x;
	this.y = y;
	this.go_right = airplane.go_right;
	
	this.startY = y;
	
	this.width = 11;
	this.height = 30;
	this.velocity = 100;
	this.hvelocity = (isHardMode ? airplane.velocity : 0);
	
	this.fallState = Math.min((this.y - this.startY) / 300.0, 1);
	
	this.draw = function() {	
		this.sprite.x = this.x + (this.width / 2);
		this.sprite.y = this.y + (this.height / 2);
		this.sprite.angle = (1-this.fallState) * (this.go_right ? -90.0 : 90.0);
		this.sprite.draw();
	}
	
	this.step = function(diff)
	{		
		if (this.hvelocity > 0) {
			if (this.go_right) {
				this.x += this.hvelocity * (diff/900);
			} else {
				this.x -= this.hvelocity * (diff/900);
			}
			this.hvelocity -= 100 * (diff/1000);
		}
		
		this.y += this.velocity * (diff/1000);
		this.velocity += 100 * (diff/1000);
		this.fallState = Math.min((this.y - this.startY) / 300.0, 1);
		
		this.width = (20 + ((30-20) * (1-this.fallState)));
		this.height = (11 + ((30-11) * this.fallState));
	}
}