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
		"labtiles.png" : {
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
		this.requires("jones_default, GfxPlayfield, Canvas, SpriteAnimation");
		// Animation Defs
		this.reel("idle", 1000, [[0,0], [1,0], [2,0], [3,0]]);
		this.animate("idle", -1);
		this.x = -4;
		this.y = -4;
	},
	spriteUpdate: function() {
		return;
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
		this.requires("scientist_default, GfxPlayfield, NpcAnimationController");
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
	init: function() { 
		this.requires("Canvas, SpriteAnimation");
	},
	spriteUpdate: function(self) {
		// Animation affixes.
		var prefix = "";
		var suffix = "";

		// TODO: Are we dead? :)
		
		suffix = TOT.CONST.BEARING_NAMES[self.bearing];
		this._setFlipping(self.bearing);
		
		// Are we moving?
		if(self.vel.x !== 0 || self.vel.y !== 0) {
			prefix = "WALK_";
		} else { 
			prefix = "IDLE_";
		}
		
		var reelName = prefix + suffix;
		if(this.isPlaying(reelName) === false) {
			this.animate(reelName, -1);
		}
	},
	
	_setFlipping: function(bearing) {
		if(bearing === TOT.CONST.BEARING.LEFT) {
			this.flip("X");
		} else {
			this.unflip("X");
		}
	}
});