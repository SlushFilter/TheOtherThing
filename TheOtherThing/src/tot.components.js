/**#############################################################################
 Components
################################################################################

/** Graphics Modification Components
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// GfxBackground 	 - Render a sprite on the background.
// GfxOverlay	 	 - Render a sprite on top of everything.
// GfxPlayfield	 	 - Render a sprite following Y overlapping rules.

/** Game Mechanics Properties
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// HitBox			 - Hitbox for scanning operations. 
// Solid			 - Modifier to make it act as a solid.
// Velocity			 - Vector that applies movement per frame.
// Bearing			 - Direction that the entity is facing.
// CollidesWithSolid - Its what it sounds like.
// ClassInfo		 - Describes an entity's job and gender eg: Male, Scientist
// Actionable		 - Something that can be acted upon.

/** Controllers 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// SpriteCtrl		 - Notifies an attached sprite to update.
// Mobile			 - Interperates 'MobMove' commands
// KeyboardControl	 - Generates local entity events from keystrokes.
// AI				 - Generic AI update framework.

/** Map Components
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// ExitBlock		 - ** BROKEN **
// FloorTile		 - 
// OverlayTile		 -
// Block		 	 - Invisible 

/** AI Components
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// AI_BrainDead
// AI_Wander
// AI_Patrol

/**#############################################################################
 GRAPHICS MODIFICATION COMPONENTS
##############################################################################*/

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

/**#############################################################################
 GAME MECHANIC PROPERTIES
##############################################################################*/

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
	},
	// Returns a coordinate at the center of mass as an array [x, y]
	getCenter: function() {
		return [this.x + (this.w / 2), this.y + (this.h / 2)];
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
            this.trigger("Turn", newBearing); 
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ClassInfo
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// A property that tells game-specific class information about this entity.
Crafty.c("ClassInfo", {
	classInfo: null,
	init: function(){
		this.classInfo = { 
			job: "NONE",
			gender: "NONE"
		}
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Actionable
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Actionable entities have an actualize function. The argument passed is the
// entity that activated it.
Crafty.c("Actionable", {
	// For things which are actionable.
	// Override this function in the entity code.
	actualize: function(actor) {
		console.log("Actualize : [" + actor.getId() + "]-act->[" + this.getId() + "]");
	}
});


/**#############################################################################
 CONTROLLERS
##############################################################################*/

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
		this.bind("MobMove", this._spriteCtrlUpdate);
		this.bind("MobStop", this._spriteCtrlUpdate);
		this.bind("MobIdle", this._spriteCtrlUpdate);
		this.bind("Turn", this._spriteCtrlUpdate);
	} ,
	_spriteCtrlUpdate: function() {
		// Forward the EntCtrl arguments to the sprite.
		if(this._spriteCtrlTarget !== null) {
			this._spriteCtrlTarget.spriteUpdate(this);
		}
	} ,
	spriteCtrl: function(sprite) {
		this._spriteCtrlTarget = sprite;
		this.attach(sprite);
		return this;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Mobile
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
		// console.log("Key Pressed: " + keyPress.key);
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
// AI
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

/**#############################################################################
 MAP COMPONENTS
##############################################################################*/

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

Crafty.c("FloorTile", {
	init: function() {
		this.addComponent("2D, Canvas, Color, GfxBackground");
	},
	setTile : function(tileIndex) {
		var x = tileIndex % 20; // 640 / 32
		var y = (tileIndex / 20) | 0; // 640 / 32
		this.sprite(x, y);
		return this;
	}
});

Crafty.c("OverlayTile", {
	init: function() {
		this.addComponent("2D, Canvas, Color, GfxOverlay");
	},
	setTile : function(tileIndex) {
		var x = tileIndex % 20; // 640 / 32
		var y = (tileIndex / 20) | 0; // 640 / 32
		this.sprite(x, y);
		return this;
	}
});

Crafty.c("Block", {
	init: function() {
		this.addComponent("HitBox, Solid");
	}
	// Define hitbox on entity creation.
});

/**#############################################################################
 AI COMPONENTS
##############################################################################*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// AI_Braindead
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Makes an entity do nothing, however it does NOT make them un-actionable.
Crafty.c("AI_BrainDead", {
	init : function() {
		this.requires("AI");
		this.aiSetThink(function() { }); // Derp Im Braindead
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// AI_Wander
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Makes an entity wander aimlessly.
Crafty.c("AI_Wander", {
	init: function() {
		this.requires("AI");
        this.aiSetThink(this._AI_Wander);
		this.bind("CollisionSolid", this._handleCollisionSolid);
	} ,
	// Behavior when running into a wall.
	_handleCollisionSolid : function(hit) { 
		this.trigger("MobStop");
	} ,
	_AI_Wander : function() {
		var bearing = Crafty.math.randomInt(0, 7);
		if(bearing >= TOT.CONST.BEARING.NONE)  { // Causes the mob to idle.
			this.trigger("MobStop");
		} else { // Otherwise make the mob move in a direction.
			this.trigger("MobIdle");
			this.trigger("MobMove", { state:true, args:bearing });
		}
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// AI_Patrol
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// (Untested)
// Causes an entity to walk to a given coordinate list, pausing briefly at 
// each waypoint. This code is extremely dumb, so, its best if the waypoints
// are all in line of sight.
Crafty.c("AI_Patrol", {
	// An array of x y coordinate pairs: [ [x, y], [x, y], ... ]
	// Marking a patrol route
	_patrolWaypoints: null,
	_patrolIndex: 0,
	
	init: function() {
		this.requires("AI, Mobile");
        this.aiSetThink(this._AI_Patrol);
		this._patrolWaypoints = [];
	},
	
	_AI_Patrol: function() {
		var wx, wy; // waypoint coords.
		
		if(_patrolWaypoints.length === 0) {
				console.log("AI_Patrol : No waypoints!"); 
				return;
			}
		wx = this._patrolWaypoints[_patrolIndex][0];
		wy = this._patrolWaypoints[_patrolIndex][1];
		// Are we there yet ?
		if(this.contains(wx, wy, 1, 1) === true) {
			this._patrolNextWaypoint();
			wx = this._patrolWaypoints[_patrolIndex][0];
			wy = this._patrolWaypoints[_patrolIndex][1];
		}
		// Adjust our heading (if needed)
		this.vel.x = wx - this.x;
		this.vel.y = wy - this.y;
		this.vel.normalize();
		this.vel.scale(this.mobileSpeed);
		// Finally, adjust our bearing.
		var bearing = 0;
		if(Crafty.math.abs(this.vel.x) > Crafty.math.abs(this.vel.y)) { // Moving horizontally.
			if(this.vel.x < 0) {// moving left
				bearing = TOT.CONST.BEARING.LEFT;
			} else { // moving right
				bearing = TOT.CONST.BEARING.RIGHT;
			}
		} else {
			if(this.vel.y < 0) { // moving up
				bearing = TOT.CONST.BEARING.UP;
			} else { // moving down
				bearing = TOT.CONST.BEARING.DOWN;
			}
		}
	},
	_patrolNextWaypoint: function() {
		this._patrolIndex = (this._patrolIndex + 1) % this._patrolWaypoints.length;
	},
	patrolAddWaypoint: function(waypoint) {
		this._patrolWaypoints.push(waypoint);
	}
});