function Cloud(x, y) {
	this.sprite = new jaws.Sprite({image: "images/cloud-th.png", x: 0, y: 0, scale: 1, anchor: "top_left"});
	this.sprite.x = x;
	this.sprite.y = y;
	this.velocity = 30 + Math.random() * 120;
	
	this.step = function(diff)
	{
		if (this.sprite.x > 800) {
			this.sprite.x = -100;
			this.velocity = 30 + Math.random() * 120;
		}
		
		this.sprite.x += this.velocity * (diff/1000);
	}
	
	this.draw = function() {
		this.sprite.draw();
	}
}

function DarkCloud(x, y) {
	this.sprite = new jaws.Sprite({image: "images/cloud-th-dark.png", x: 0, y: 0, scale: 1, anchor: "top_left"});
	this.sprite.x = x;
	this.sprite.y = y;
	this.velocity = 30 + Math.random() * 120;
	
	this.step = function(diff)
	{
		if (this.sprite.x > 800) {
			this.sprite.x = -100;
			this.velocity = 30 + Math.random() * 120;
		}
		
		this.sprite.x += this.velocity * (diff/1000);
	}
	
	this.draw = function() {
		this.sprite.draw();
	}
}
