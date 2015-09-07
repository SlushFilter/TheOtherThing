// Player code!
TOT.SpawnPlayer = function(x, y) {
	Crafty.e("Player").attr( { x:x, y:y } );
};

// Player Entity overhaul
Crafty.c("Player", {
    init : function() {
		this.requires("GfxPlayfield, HitBox, Solid, Velocity, Bearing," +
			"CollidesWithSolid, KeyboardControl, Mobile, SpriteCtrl");
		this.setHitBox(24, 24);
		if(TOT.CONST.DEBUG === true) { this.addComponent("SolidHitBox"); } // DEBUG
		this.spriteCtrl(Crafty.e("SCIENTIST_SPRITE"));
		this.bind("Act", this._handleAct);
    } ,
	_handleAct : function(data) {
		
		if(!data.state) { 
			if(TOT.CONST.DEBUG === true) { 
				console.log( " --- _handleAct(data) ---");
				console.log(data); // Bug watcher.
			} 
			return; 
		};
		//if(data.state === false) { return; }
		
		var hw = this._w / 2;
		var hh = this._h / 2;
		var x = this.x + hw;
		var y = this.y + hh;
		// The new probe code! :)
		if(this.bearing === TOT.CONST.BEARING.UP) {
			y -= this._h;
		} else if (this.bearing == TOT.CONST.BEARING.DOWN) {
			y += this._h;
		} else if(this.bearing === TOT.CONST.BEARING.LEFT) {
			x -= this._w;
		} else if (this.bearing == TOT.CONST.BEARING.RIGHT) {
			x += this._w;
		}
		
		// Fetch a list of all 'Actionable' entities
		var actors = Crafty("Actionable");
		var ent = null;
		for(var i = 0; i < actors.length; i++) {
			ent = Crafty(actors[i]);
			if(ent.intersect(x, y, 1, 1) === true) {
				console.log("Probe @ X:" + x + " Y:" + y);
				ent.actualize(); // Probe them !
			}
		}
	}
});