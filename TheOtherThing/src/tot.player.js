// Player code!
TOT.SpawnPlayer = function(x, y) {
	Crafty.e("Player").attr( { x:x, y:y } );
};

// Player Entity overhaul
Crafty.c("Player", {
    init : function() {
		this.requires("GfxPlayfield, HitBox, Solid, Velocity, Bearing," +
			"CollidesWithSolid, KeyboardControl, Mobile, SpriteCtrl," +
			"Actor, Assimilator, Mortal");
		this.setHitBox(24, 24);
		//if(TOT.CONST.DEBUG === true) { this.addComponent("SolidHitBox"); } // DEBUG
		this.spriteCtrl(Crafty.e("JONES_SPRITE"));
    }
});