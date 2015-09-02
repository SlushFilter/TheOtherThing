var TOT = TOT || {};
TOT.DATA = TOT.DATA || {};
Crafty.paths( { images: "gfx/" } );

TOT.DATA.SPRITEDEF = {
	sprites : {
		"placeholder_jones.png" : {
			tile : 30,
			tileh : 60,
			map : { jones_sprite : [0, 0]}
		},
		"placeholder_sprite.png" : {
			tile : 32,
			tileh : 32,
			map : { placeholder_sprite : [0, 0] }
		},
		"jones.png" : {
			tile : 32,
			tileh : 32,
			map : { jones_default : [0, 0] }
		},
		"tileset.png" : {
			tile : 32,
			tileh : 32,
			map : { tileset : [0, 0] }
		},
		"temp_human.png" : {
			tile : 22,
			tileh : 44,
			map : { temp_human : [0, 0] }
		},
		"scientist.png" : {
			tile : 22,
			tileh : 44,
			map : { scientist_default : [0, 0] }
		},
		"title_1.png": {
			tile: 300,
			tileh: 175,
			map: { title_1: [0,0] }
		},
		"instruction_screen.png": {
			tile: 640,
			tileh: 480,
			map: { help_screen: [0,0] }
		}
	}
};

// Animations 
Crafty.c("JONES_SPRITE", {
	init : function() {
		this.requires("Thing, jones_default, SpriteAnimation");
		// Animation Defs
		this.reel("idle", 1000, [[0,0], [1,0], [2,0], [3,0]]);
		this.animate("idle", -1);
	}
});

Crafty.c("TEMP_HUMAN_SPRITE", {
	init : function() {
		this.requires("Thing, temp_human, AnimationController");
		// Animation Defs
		this.reel("IDLE_UP", 1000, [[8, 0]]);
		this.reel("IDLE_DOWN", 1000, [[0, 0]]);
		this.reel("IDLE_LEFT", 1000, [[4, 0]]);
		this.reel("IDLE_RIGHT", 1000, [[4, 0]]);
		this.reel("WALK_UP", 1000, [[0,0], [1, 0], [2, 0], [3, 0]]);
		this.reel("WALK_DOWN", 1000, [[0,0], [1, 0], [2, 0], [3, 0]]);
		this.reel("WALK_LEFT", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
		this.reel("WALK_RIGHT", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
		this.reel("DIE", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
	}
});

Crafty.c("SCIENTIST_SPRITE", {
	init : function() {
		this.requires("scientist_default, NpcAnimationController");
		// Animation Defs
		this.reel("IDLE_UP", 1000, [[8, 0]]);
		this.reel("IDLE_DOWN", 1000, [[0, 0]]);
		this.reel("IDLE_LEFT", 1000, [[4, 0]]);
		this.reel("IDLE_RIGHT", 1000, [[4, 0]]);
		this.reel("WALK_UP", 1000, [[8,0], [9, 0], [10,0], [11,0]]);
		this.reel("WALK_DOWN", 1000, [[0,0], [1, 0], [2, 0], [3, 0]]);
		this.reel("WALK_LEFT", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
		this.reel("WALK_RIGHT", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
		this.reel("DIE", 1000, [[4,0], [5, 0], [6, 0], [7, 0]]);
		// Sprite offset
		this.x = 0;
		this.y = -22;
		this.animate("IDLE_DOWN", -1);
	}
});

// #############################################################################
// CONTROLLERS
// #############################################################################

Crafty.c("NpcAnimationController", {
	command: -1,
	init: function() { 
		this.requires("Canvas, Bearing, SpriteAnimation");
	},
	spriteUpdate: function(a) {
		var CMD = TOT.CONST.ENT_CMD;
		switch(a.cmd) {
			case CMD.MOVE:
				this._animWalk(a.arg[0]);
				break;
			case CMD.IDLE:
				this._animIdle(a.arg[0]);
				break;
			case CMD.DIE:
				this._animDie();
				break;
		}
	},
	
	_animWalk: function(bearing) {
		// Determine if an update is actually needed.
		if(this.command === TOT.CONST.ENT_CMD.MOVE
		&& this.bearing === bearing) { return; }
		
		this.setBearing(bearing);
		this._setFlipping(bearing); // Face the correct direction!
		this.animate("WALK_" + TOT.CONST.BEARING_NAMES[bearing], -1);
		this.command = TOT.CONST.ENT_CMD.MOVE; // Save last command
	},
	
	_animIdle: function(bearing) {
		// Determine if an update is actually needed.
		if(this.command === TOT.CONST.ENT_CMD.IDLE
		&& this.bearing === bearing) { return; }
		
		this.setBearing(bearing);
		this._setFlipping(bearing);
		this.animate("IDLE_" + TOT.CONST.BEARING_NAMES[this.bearing], -1);
	},
	
	_animDie: function() {
		this.animate("DIE", 1);
	},
	
	_setFlipping: function(bearing) {
		if(bearing === TOT.CONST.BEARING.LEFT) {
			this.flip("X");
		} else {
			this.unflip("X");
		}
	}
});