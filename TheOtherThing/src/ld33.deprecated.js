// Old Player Component
// Player Components
Crafty.c("Player", {
	// Who am I? What is my motivation?!
	posession : null,
	init: function() {
		this.requires("Thing, Mobile, Feeler, Collision, Controllable");
		if (debug) {
			this.addComponent("WiredHitBox");
		};
		//this.color('green');
		this.w = 24; // Placeholder values <vvv
		this.h = 24;
		this.attach(Crafty.e("JONES_SPRITE").location(-4, -6, 0));
		this.collision();
		this.onHit("Solid", this.handleCollision);
		this.onHit("ExitBlock", function(hit) {
			hit[0].obj.nextScene();
		});
	} ,
	handleCollision : function(hit) {
		for(var i=0; i<hit.length; i++) {
			if(hit[i].normal.y === 1) {
				// Bottom
				this.y = hit[i].obj.y + hit[i].obj.h;
			}
			if(hit[i].normal.y === -1) {
				// Top
				this.y = hit[i].obj.y - this.h;
			}
			if(hit[i].normal.x === 1) {
				// Right-side of entity
				this.x = hit[i].obj.x + hit[i].obj.w;
			}
			if (hit[i].normal.x === -1) {
				// Left-side
				this.x = hit[i].obj.x - this.w;
			}
		}
	}
});