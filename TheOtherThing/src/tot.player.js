// Player code!
TOT.SpawnPlayer = function(x, y) {
	Crafty.e("NewPlayer").attr( { x:x, y:y } );
};

// Player Entity overhaul
Crafty.c("NewPlayer", {
    init : function() {
        this.requires("NonPlayerCharacter, KeyboardControl, SCIENTIST_SPRITE");
        //this.addComponent("WiredHitBox");
        //this.w = 24;
        //this.h = 24;
		//this.attach(Crafty.e("JONES_SPRITE").location(-4, -6, 0));
    }
});