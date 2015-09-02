// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Components
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Put basic components here. Specific entities will go elsewhere.
// For first implementation, player is a separate component. Should all "living"
// entities be derived from the same basic "mob" component?

// #############################################################################
// GRAPHICS MODIFICATION COMPONENTS
// #############################################################################

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// GfxBackground
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Sets z to always render the tile on the background layer.
Crafty.c("GfxBackground", {
	init: function() {
		this.z = TOT.CONST.BACKGROUND_Z;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// GfxOverlay
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Sets z to always render the tile on the overlay layer.
Crafty.c("GfxOverlay", {
	init: function() {
		this.z = TOT.CONST.OVERLAY_Z;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// GfxPlayfield
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dynamically modifies z to (hopefully) make ents with lesser Y coordinates be 
// rendered first. This will always override GfxBackground and GfxOverlay 
// modifiers.
Crafty.c("GfxPlayfield", {
	init: function() {
		this.bind("PreRender", this._gfxPlayfieldPreRender);
	} ,
	_gfxPlayfieldPreRender : function() {
		this.z = this.y | 0;
	}
});

// #############################################################################
// SPACIAL / PHYSICS COMPONENTS
// #############################################################################

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// HitBox
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Defines a scannable hitbox - Generally this should be used to define an 
// entity's size in the game.
Crafty.c("HitBox", {
	init: function() { this.requires("2D"); } ,
	setHitBox: function(width, height) {
		this.w = width;
		this.h = height;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Solid
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// More of a property than anything, this component defines an entity as being 
// 'Solid'. Entities with CollidesWithSolid will treat these as ... well a 
// solid.
Crafty.c("Solid", {
	init: function() {
		this.requires("HitBox, Collision");
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Velocity
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Creates a vel property which is simply a Crafty.math.Vector2D
// Causes an entity to move every frame depending on what its velocity is set 
// at.
Crafty.c("Velocity", {
	vel: null, // Crafty.math.Vector2D
    init : function() {
        this.requires("2D");
        this.bind("EnterFrame", this._velocityFrameCallback);
        // Create the velocity object.
        this.vel = new Crafty.math.Vector2D();
    },
    // EnterFrame Callback function
    _velocityFrameCallback : function(data) {
        this.x += (data.dt * this.vel.x);
        this.y += (data.dt * this.vel.y);
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Bearing
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component that describes what direction an entity is facing.
// bearing = one of TOT.CONST.BEARING
Crafty.c("Bearing", {
	bearing : 0,
    init : function() { 
		this.bearing = TOT.CONST.BEARING.DOWN;
	},
    setBearing : function(newBearing) {
        if(this.bearing !== newBearing) { // Did we change orientation?
			// Trigger the turn command.
            this.trigger("EntCmd", 
				{ cmd: TOT.CONST.ENT_CMD.TURN,
				  arg: [ newBearing ]}); 
        }
        this.bearing = newBearing;
    }
});

// TODO: Refactor me :)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// CollidesWithSolid
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component to make an entity act 'solid' when checking hits against other 
// Solid entities
Crafty.c("CollidesWithSolid", {
    init : function() {
        this.requires("HitBox, Collision");
        this.onHit("Solid", this._handleCollidesWithSolid);
    } , 
    _handleCollidesWithSolid : function(hit) {
		var normal = null;
		var mbr = null;
		var sMbr = this.mbr();
		for(var i=0; i < hit.length; i++) {
			normal = hit[i].normal;
			mbr = hit[i].obj.mbr();
			if(normal.y === 1) { // Vertical collision
				this.y = (mbr._y + mbr._h) + (this.y - sMbr._y);
			} else if(normal.y === -1) {
				this.y = mbr._y - sMbr._h;
			}
			if(normal.x === 1) { // Vertical collision
				this.x = mbr._x + mbr._w;
			} else if(normal.x === -1) {
				this.x = mbr._x - sMbr._w;
			}
		}
		this.trigger("CollisionSolid");
	}
});

// #############################################################################
// CONTROLLERS
// #############################################################################

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SpriteCtrl
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Used for forwarding EntCtrl messages to an attached sprite.
// Valid sprites should contain an update function that selects an appropriate
// animation based on the arguments passed. (see the tot.spritedef.js for
// lots of valid controllable sprites!)
Crafty.c("SpriteCtrl", {
	_spriteCtrlTarget: null,
	
	init: function() {
		this.bind("EntCtrl", this._spriteCtrlHandler);
	} ,
	
	spriteCtrl: function(sprite) {
		this._spriteCtrlTarget = sprite;
		this.attach(sprite);
		return this;
	} ,
	
	_spriteCtrlHandler: function(eventArgs) {
		// Forward the EntCtrl arguments to the sprite.
		if(this._spriteCtrlTarget !== null) {
			this._spriteCtrlTarget.spriteUpdate(eventArgs);
		}
	}
});

// TODO: Refactor this more
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Keyboard Control Components
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Pressing a key will one-shot fire an event.
// All controller events will pass a
// true or false value indicating if the key was pressed (true) or released 
// (false) and a direction ( described in TOT.CONST.BEARING[] )
// example event receiver function :

// actionListen : function(data) {
//		var on = data.state; // was the key just pressed ?
//		var direciton = data.dir; // one of TOT.CONST.BEARING
// }

// ------------------------------
// Entity Event Names
// ------------------------------
// MobMove  // Had to change this because Move is already an event
// Act
// Attack
// Jump
// ------------------------------
Crafty.c("KeyboardControl", {
	enabled : true,
    
	init : function()  {
		this.bind('KeyDown', this.handleKeyDown); 
		this.bind('KeyUp', this.handleKeyUp);
		// Not sure how this is going to behave on toggle control.
		this.bind('ToggleControl', this.handleToggleControl);
		
		// Auxillary keystate setup for throwing menu selection events.
        this.auxKeyState = [
            { key:Crafty.keys.UP_ARROW,    event:"SelectionUp", 	 state:false, args: null },	
            { key:Crafty.keys.DOWN_ARROW,  event:"SelectionDown", 	 state:false, args: null },  
            { key:Crafty.keys.ENTER,       event:"SelectionExecute", state:false, args: null},
		];
		
		// Default keystate, setup for throwing Mob controls.
        this.keyState = [
            { key:Crafty.keys.UP_ARROW,    event:"MobMove", state:false, args: TOT.CONST.BEARING.UP },  
            { key:Crafty.keys.DOWN_ARROW,  event:"MobMove", state:false, args: TOT.CONST.BEARING.DOWN },  
            { key:Crafty.keys.LEFT_ARROW,  event:"MobMove", state:false, args: TOT.CONST.BEARING.LEFT },  
            { key:Crafty.keys.RIGHT_ARROW, event:"MobMove", state:false, args: TOT.CONST.BEARING.RIGHT }, 
            { key:Crafty.keys.ENTER,       event:"Act",     state:false, args: null},
            { key:Crafty.keys.Z,           event:"Attack",  state:false, args: null},
            { key:Crafty.keys.SPACE,       event:"Jump",    state:false, args: null}
        ];
	},
	handleKeyDown : function(keyPress) {
		console.log("Key Pressed: " + keypress.key);
		if(keyPress.key === Crafty.keys.CAPS){
			Crafty.trigger("ToggleControl");
		}
        // Don't do stuff when you're not supposed to.
		if (!this.enabled) { console.log(this.enabled); return; }; 
		
		for(var i = 0; i < this.keyState.length; i++) {
			if(keyPress.key === this.keyState[i].key) {
				this.keyState[i].state = true;
				this.trigger(this.keyState[i].event, this.keyState[i]);
                return;
			}
		}
	},
	handleKeyUp : function(keyPress) {
		for(var i = 0; i < this.keyState.length; i++) {
			if(keyPress.key === this.keyState[i].key) {
				this.keyState[i].state = false;
				this.trigger(this.keyState[i].event, this.keyState[i]);
                return;
			}
		}
	},
	handleToggleControl : function() {
		// Clear the current keystate array.
		for(var i = 0; i < this.keyState.length; i++) {
			keyDef = this.keyState[i];
			if(keyDef.state === true) {
				keyDef.state = false;
				this.trigger(keyDef.event, { on:false, args:keyDef.args} );
			}
		}
		// Swap out the keystate with the auxKeyState
		var swap = this.keyState;
		this.keyState = this.auxKeyState;
		this.auxKeyState = swap;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Mobile
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// TODO: Refactor more - this is more or less a controller component.
// Responds to MobMove events and updates the velocity component.
Crafty.c("Mobile", {
    mobileSpeed : 0.05, // Default move speed
	init : function() {
        this.requires("Velocity, Bearing");
        this._mobileImpulse = [ // Move register
            { s:0, n:-1 }, // Index = TOT.CONST.BEARING.UP
            { s:0, n: 1 }, // TOT.CONST.BEARING.DOWN
            { s:0, n:-1 }, // TOT.CONST.BEARING.LEFT
            { s:0, n: 1 }  // TOT.CONST.BEARING.RIGHT
        ];
		this.bind("MobMove", this._mobileHandleMobMove);
        this.bind("MobStop", this._mobileHandleMobStop);
	} ,
    _mobileHandleMobStop : function() {
    } ,
    // Handle a MobMove command
    _mobileHandleMobMove : function(data) {
        // Update the move registers.
        var impulseReg = this._mobileImpulse[data.args];
		var dir = data.args;
		
        if(data.state === true) {
            this._mobileImpulse[dir].s = this._mobileImpulse[dir].n * this.mobileSpeed;
        } else {
            this._mobileImpulse[dir].s = 0;
        }
        // Figure out velocity vector.
		this.vel.x = this._mobileImpulse[TOT.CONST.BEARING.LEFT].s +
                     this._mobileImpulse[TOT.CONST.BEARING.RIGHT].s;
        this.vel.y = this._mobileImpulse[TOT.CONST.BEARING.UP].s +
                     this._mobileImpulse[TOT.CONST.BEARING.DOWN].s;
		// Figure out what direction we're facing (favor up and down)
		if(this.vel.y < 0) { dir = TOT.CONST.BEARING.UP;
		} else if (this.vel.y > 0) { 
			dir = TOT.CONST.BEARING.DOWN;
		} else if (this.vel.x < 0) { 
			dir = TOT.CONST.BEARING.LEFT;
		} else if (this.vel.x > 0) { 
			dir = TOT.CONST.BEARING.RIGHT;
		}
		this.setBearing(dir);
    },
    _mobileHandleMobStop : function() {
        this.vel.x = 0;
        this.vel.y = 0;
        for(var i = 0; i < this._mobileImpulse.length; i++) {
            this._mobileImpulse[i].s = 0;
        }
    }
});




// TODO: Refactor more - is there an easier way to do this ?
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// NonPlayerCharacterAI
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component to cause entities to call a swappable think function on regular 
// intervals.
// aiSuspend - call thsi on the entity to suspend its think function
// aiResume  - call this to resume a suspended think function
// aiToggle - toggles the ai think function on and off
// aiSetInterval - Sets how often the think function fires (in milliseconds)
// aiSetThink - Sets the think routine of the ai.
Crafty.c("AI", {
    _aiSuspend : false, // Suspended flag
    _aiInterval : 1000, // Interval to reset to
    _aiTimer : 0, // The timer register
    _aiFrameCallback : function (data) {
        this._aiTimer -= data.dt;
        if(this._aiTimer <= 0) {
            this._aiThink(); // Fire off the think function every frame
            this._aiTimer = this._aiInterval;
        }
    },
    init : function() {
        this._aiThink = function() { return; } // AI Braindead
        this.bind("EnterFrame", this._aiFrameCallback);
    } ,
    aiSetInterval : function(interval) {
        if(interval < 0) { interval = 0; }
        this._aiInterval = interval;
    } ,
    aiSetThink : function(thinkFunction) {
        this._aiThink = thinkFunction;
    } ,
    aiToggle : function() {
        this._aiSuspend = !_aiSuspend;
        if(this._aiSuspend === false) {
            this.unbind("EnterFrame", this._aiFrameCallback);
        } else {
            this.bind("EnterFrame", this._aiFrameCallback);
        }
    } ,
    aiSuspend : function() {
        if(this._aiSuspend === true) { return; }
        this.aiToggle();
    } ,
    aiResume : function() {
        if(this._aiSuspend === false) { return; }
        this.aiToggle();
    }
});

// #############################################################################
// MAP COMPONENTS
// #############################################################################

Crafty.c("ExitBlock", {
	init: function() {
		this.requires("Collision, Thing, placeholder_sprite");
		this.w = 32;
		this.h = 32;
	},
	nextScene: function() {
		// Call this to move to the next scene as indicated by the map.
		Crafty.enterScene(TOT.MAP.Mapper.current_map.exit_to);
	},
	finishGame: function() {
		// Call this to load the end game screen.
	}
});

Crafty.c("Tile", {
	init: function() {
		this.addComponent("Thing"); 
	},
	setTile : function(tileIndex) {
		var x = tileIndex % 20; // 640 / 32
		var y = (tileIndex / 20) | 0; // 640 / 32
		this.sprite(x, y, 0);
		return this;
	}
});

Crafty.c("Block", {
	init: function() {
		this.addComponent("HitBox, Solid");
	}
	// Define hitbox on entity creation.
});


// #############################################################################
// DEPRECATE EVERYTHING BELOW THIS LINE :O
// #############################################################################

// TODO: Deprecate me.
Crafty.c("HUD", {
	init: function() {
		this.addComponent("2D, Canvas, Color");
		this.color(64, 64, 64);
		this.x = 0;
		this.y = 0;
		this.w = 128;
		this.h = 64;
		this.z = 512;
		this.bind("ViewportScroll", this.update);
	} ,
	update : function() {
		this.x = -(Crafty.viewport.x) + 32;
		this.y = -(Crafty.viewport.y) + 32;
		
	}
});

// TODO: Deprecate me.
Crafty.c("Thing", {
	init: function () {
		this.addComponent("2D, Canvas, Color");
	},
	location: function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
});

// Siigh,, we'll keep it as is 
Crafty.c("Actionable", {
	// For things which are actionable.
	actualize: function() {
		console.log("HIT!");
	} ,
	takeDamage : function() {
		console.log("DAMAGE!");
	} 
});

// TODO: Deprecate me.
// Need a feeler in order to feel things.
Crafty.c("Feeler", {
	feelerHitBox : null,
	init: function() {
		this.requires("Thing");
		this.feelerHitBox = Crafty.e("Thing, Collision").location(0,0,0);
		this.feelerHitBox.action = "NONE";
		
		this.feelerHitBox.bind("HitOn", function(hit) {
				for(var i = 0; i < hit.length; i++) {
					if(this.action === "ACTUALIZE") {
						hit[i].obj.actualize();
					} else if (this.action === "ATTACK") {
						hit[i].obj.takeDamage();
					}
				}
				this.ignoreHits();
			}
		);
		this.attach(this.feelerHitBox);
		this.feelerHitBox.w = 4;
		this.feelerHitBox.h = 4;
	},
	// Generate hit box out from face.
	probe: function() {
		console.log("PROBING " + this.facing);
		var probeLength = 24;
		var dx = this.x + (this.w / 2) | 0;
		var dy = this.y + (this.h / 2) | 0;
		if(this.facing === "LEFT") {
			dx = dx - probeLength;
		} else if (this.facing === "RIGHT") {
			dx = dx + probeLength;
		} else if (this.facing === "UP") {
			dy = dy - probeLength;
		} else if (this.facing === "DOWN") {
			dy = dy + probeLength;
		}
		this.feelerHitBox.x = dx;
		this.feelerHitBox.y = dy;
		console.log(this.feelerHitBox.w);
		console.log("X: " + this.x + " Y:" + this.y + " FeelerX :" + this.feelerHitBox.x + " FeelerY :" + this.feelerHitBox.y);
		this.feelerHitBox.checkHits("Actionable");
	},
	stopProbing : function() {
		console.log("STOP THE PROBE");
		this.feelerHitBox.ignoreHits();
	}
});

