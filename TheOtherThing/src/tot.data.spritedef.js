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
		this.requires("Thing, scientist_default, NPCAnimationController");
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
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// NPC Animation Controller
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Rigged to change animations based on the entity's state using the magic of events.
// This should be inherited from something that works with SpriteAnimation

// This works ... trust me.
Crafty.c("NPCAnimationController", {
	_animationControllerEnabled : true,
	init : function() {
		this.requires("NonPlayerCharacter, SpriteAnimation");
		this._animationControllerAction = "IDLE";
		this._animationControllerBearing = TOT.CONST.BEARING.DOWN;
		this.bind("Turn", this._animationControllerTurn);
		this.bind("MobMove", this._animationControllerMobMove);
		this.bind("MobStop", this._animationControllerMobStop);
		this.bind("Die", this._animationControllerDie);
		
	} ,
	toggleAnimationController : function() {
		this._animationControllerEnabled = !this._animationControllerEnabled;
	} ,
	_animationControllerUpdate : function() {
		if(this._animationControllerEnabled === false) { return; }
		if(this._bearing < TOT.CONST.BEARING.NONE) {
			var reelName = this._animationControllerAction + "_" + 
				TOT.CONST.BEARING_NAMES[this._bearing];
				console.log("Animation_Reel : " + reelName);
				if(this._bearing === TOT.CONST.BEARING.LEFT) {
					this.flip("X");
				} else {
					this.unflip("X");
				}
			this.animate( reelName, -1 );
		} else {
			console.log("Animation_Reel : " + this._animationControllerAction);
			this.animate( this._animationControllerAction, -1 );
		}
	},
	_animationControllerTurn : function(bearing) {
        this._bearing = bearing;
		this._animationControllerUpdate();
	},
	_animationControllerMobMove : function(moveInfo) {
		if(this.vel.x === 0 && this.vel.y === 0) {
			this._animationControllerAction = "IDLE";
		} else {
			this._animationControllerAction = "WALK";
		}
		this._animationControllerUpdate();
	},
    _animationControllerMobStop : function() {
		this._animationControllerAction = "IDLE";
		this._animationControllerUpdate();
    },
	_animationControllerDie : function(dieInfo) {
		this._animationControllerAction = "DIE";
		this._animationConrollerBearing = TOT.CONST.BEARING.NONE;
		this._animationControllerUpdate();
	}
});