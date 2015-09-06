// Player code!
TOT.SpawnPlayer = function(x, y) {
	Crafty.e("Player").attr( { x:x, y:y } );
};

// Player Entity overhaul
Crafty.c("Player", {
    init : function() {
        this.requires("NonPlayerCharacter, KeyboardControl, SCIENTIST_SPRITE");
        //this.addComponent("WiredHitBox");
        //this.w = 24;
        //this.h = 24;
		//this.attach(Crafty.e("JONES_SPRITE").location(-4, -6, 0));
		this.bind("Act", this._handleAct);
    } ,
	_handleAct : function(data) {
		// if(data.state === false) { return; }
		if(!data.state) { return; };
		
		var hw = this._w / 2;
		var hh = this._h / 2;
		var x = this.x + hw;
		var y = this.y + hh;
		// The new probe code! :)
		if(this._bearing === TOT.CONST.BEARING.UP) {
			y -= this._h;
		} else if (this._bearing == TOT.CONST.BEARING.DOWN) {
			y += this._h;
		} else if(this._bearing === TOT.CONST.BEARING.LEFT) {
			x -= this._w;
		} else if (this._bearing == TOT.CONST.BEARING.RIGHT) {
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