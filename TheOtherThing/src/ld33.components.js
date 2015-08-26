// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Components
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Put basic components here. Specific entities will go elsewhere.
// For first implementation, player is a separate component. Should all "living" entities be derived from the same basic "mob" component?

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

Crafty.c("Actionable", {
	// For things which are actionable.
	actualize: function() {
		console.log("HIT!");
	} ,
	takeDamage : function() {
		console.log("DAMAGE!");
	} 
});

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

Crafty.c("Turnable", {
	// For things that can turn.
	facing : "DOWN",
	init : function() { },
	turn : function(direction) {
		facing = direction;
		this.trigger("TurnOld", direction);
	}
});

Crafty.c("Controllable", {
	move_left: Crafty.keys.LEFT_ARROW,
	move_right:  Crafty.keys.RIGHT_ARROW,
	move_up:  Crafty.keys.UP_ARROW,
	move_down: Crafty.keys.DOWN_ARROW,
	probe_button : Crafty.keys.ENTER, // For testing
	attack_button : Crafty.keys.Z,
	talk_button: Crafty.keys.X,
	jump: Crafty.keys.SPACE,
	
	moveSpeed : 0.1,
	enabled: true,
	
	init: function() {
		this.requires("Thing, Mobile, Feeler, Turnable");
		
		this.bind('KeyDown', function(keypress) {
			if(debug) {
				console.log("Key Pressed: " + keypress.key);
			};
			if(keypress.key === Crafty.keys.CAPS && debug){
				Crafty.trigger("ToggleControl");
			};
			if (!this.enabled) { return; }; // Don't do stuff when you're not supposed to.
			if(keypress.key === this.move_left){
				this.vx = -this.moveSpeed;
				this.facing = "LEFT";
			} else if (keypress.key === this.move_right){
				this.vx = this.moveSpeed;
				this.facing = "RIGHT";
			} else if (keypress.key === this.move_up){
				this.vy = -this.moveSpeed;
				this.facing = "UP";
			} else if (keypress.key === this.move_down){
				this.vy = this.moveSpeed;
				this.facing = "DOWN";
			} else if (keypress.key === this.probe_button) {
				this.feelerHitBox.action = "ACTUALIZE";
				this.probe();
			} else if (keypress.key === this.attack_button) {
				this.feelerHitBox.action = "ATTACK";
				this.probe();
			} else if (keypress.key === this.talk_button && debug) {
				console.log("Talking");
				Crafty.e("Menu").loadDialog(LD33.DATA.DIALOG.DIALOG_PLACEHOLDER);
			}
		});
		this.bind('KeyUp', function(keypress) {
			//console.log("Key Released: " + keypress.key);
			if (!this.enabled) { return; }; // Do stuff when you're supposed to.
			if(keypress.key === this.move_left){
				if(this.vx < 0) { this.vx = 0; }
			} else if (keypress.key === this.move_right){
				if(this.vx > 0) { this.vx = 0; }
			} else if (keypress.key === this.move_up){
				if(this.vy < 0) { this.vy = 0; }
			} else if (keypress.key === this.move_down){
				if(this.vy > 0) { this.vy = 0; }
			} else if (keypress.key === this.probe_button
			|| keypress.key === this.attack_button) {
				this.stopProbing();
			}
		});
		this.bind('ToggleControl', function() {
		// TODO: Fix bug where Jonesy keeps moving if in motion when this is called.
			if(this.enabled){
				console.log("Unbinding movement controls.");
				this.movH = 0;
				this.movV = 0;
				this.unbind('EventFrame', this.handleMove);
			} else {
				console.log("Rebindnig movement controls.");
				this.bind('EventFrame', this.handleMove);
			};
			this.enabled = !this.enabled;
		});
	},
});

Crafty.c("Solid", {
	init: function() {
		this.requires("Collision");
		this.collision();
	}
});

Crafty.c("FloorTile", {
	init: function() {
		this.addComponent("Thing"); 
	}
});

Crafty.c("Block", {
	init: function() {
		this.addComponent("Solid, Collision");
	}
	// Define hitbox on entity creation.
});


Crafty.c("ExitBlock", {
	init: function() {
		this.requires("Collision, Thing, placeholder_sprite");
		this.w = 32;
		this.h = 32;
	},
	nextScene: function() {
		// Call this to move to the next scene as indicated by the map.
		Crafty.enterScene(LD33.MAP.Mapper.current_map.exit_to);
	},
	finishGame: function() {
		// Call this to load the end game screen.
	}
});

Crafty.c("Talkative", {  // Unused so far. Maybe this is the component required for entities to be able to talk.
	init: function(){
	},
	dialogChoices: [], // Array of objects.
});

Crafty.c("Selectionable", {
	// TODO: Refactor the shit out of this.
	SELECTION_UP: Crafty.keys.UP_ARROW,
	SELECTION_DOWN: Crafty.keys.DOWN_ARROW,
	SELECTION_EXECUTE: Crafty.keys.ENTER,
	
	SELECTION_OBJECTS_ARRAY: [], // This holds the full objects.
	SELECTION_TEXT_ARRAY: [], // This just holds the text entities.
	SELECTION_CURRENT: 0,
	SELECTION_MAX: 3, // Need to dynamically load this from object?
	
	
	init: function(){
		this.requires("Thing, Menu");
		this.bind("KeyDown", function(keypress){ // Need to unbind on destroy
			if (keypress.key === this.SELECTION_UP){
				// Move the selection indicator up.
				if(this.SELECTION_CURRENT > 0){
					this.SELECTION_CURRENT--;
				} else {
					this.SELECTION_CURRENT = this.SELECTION_MAX;
				};
				Crafty.audio.play("select_sound");
				this.redrawSelectionText();
			}
			if (keypress.key === this.SELECTION_DOWN){
				// Move the selection indicator down.
				if(this.SELECTION_CURRENT < this.SELECTION_MAX){
					this.SELECTION_CURRENT++;
				} else {
					this.SELECTION_CURRENT = 0;
				};
				Crafty.audio.play("select_sound");
				this.redrawSelectionText();
			}
			if (keypress.key === this.SELECTION_EXECUTE){
				Crafty.audio.play("selection_execute_sound");
				// Check for dialog exit.
				// Load next dialog.
				if(this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].RESULT === 2){
					// Exit the conversation.
					this.destroy();
				} else if (this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].RESULT === 1){
					// Increase suspicion level.
					this.nextDialog(this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].NEXT_DIALOG);
				} else if (this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].RESULT === 0){
					// A 0 result means you move to the NEXT_DIALOG node.
					this.nextDialog(this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].NEXT_DIALOG);
				} else if (this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].RESULT === -1) {
					// Decrease suspicion level.
					this.nextDialog(this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].NEXT_DIALOG);
				} else if (this.SELECTION_OBJECTS_ARRAY[this.SELECTION_CURRENT].RESULT === -2) {
					// He fell for it! ASSIMILATE!
					console.log("ASSIMILATE HIM!");
					LD33.ENTS.Assimilate(this.talker);
					this.talker.think = LD33.ENTS.AI_BrainDead;
					this.assimilating = true;
					this.destroy();
				};
			}
		});
	},
	
	// Load the selectionables.
	loadSelectionText: function(text_objects_array){
		for(var i = 0; i < text_objects_array.length; i++){
			this.SELECTION_OBJECTS_ARRAY.push(text_objects_array[i]);
			this.temp_text = Crafty.e("2D, DOM, Text")
				.attr({
					x: this.menu.x + (this.menu.w / 2) - 150,
					y: ((i+1) * 25) + this.primaryTextY + this.primary_text.h,
					w: this.text_width
					})
				.text(text_objects_array[i].SELECTION_TEXT)
				.textColor('white');
			if(i === this.SELECTION_CURRENT){
				this.temp_text.textFont({
					weight: 'bold',
				}).textColor('green');
				this.cursor.x = this.temp_text.x - 10;
				this.cursor.y = this.temp_text.y;
			};
			this.SELECTION_TEXT_ARRAY.push(this.temp_text);
			this.attach(this.temp_text);
		};
		this.SELECTION_MAX = this.SELECTION_TEXT_ARRAY.length - 1;
	},
	
	// Call this before loading a new set of selectionables.
	clearSelectionText: function(){
		for(var i = 0; i < this.SELECTION_TEXT_ARRAY.length; i++){
			this.SELECTION_TEXT_ARRAY[i].destroy();
		};
		this.SELECTION_TEXT_ARRAY = [];
		this.SELECTION_OBJECTS_ARRAY = [];
	},
	
	// Call this for the initial draw and on relevant keypresses to change the "highlighted" text.
	redrawSelectionText: function() {
		// Display selectable options.
		for(var i = 0; i < this.SELECTION_TEXT_ARRAY.length; i++){
			if(i === this.SELECTION_CURRENT){
				this.SELECTION_TEXT_ARRAY[i].textColor('green').textFont({ weight: 'bold' });
				this.cursor.x = this.SELECTION_TEXT_ARRAY[i].x - 10;
				this.cursor.y = this.SELECTION_TEXT_ARRAY[i].y;
			} else {
				this.SELECTION_TEXT_ARRAY[i].textColor('white').textFont({ weight: 'normal' });
			};
		};
	},
	
});

Crafty.c("Menu", {
	// TODO: Make these bastard scientists stop moving when we're talking to them!
	text_width: 300,
	cursor : null,
	dialog_tree: [],
	primary_text: null,
	talker: null, // Reference to the entity who is talking.
	assimilating: false, // So we can properly re-enable movement controls when not assimilating.
	
	init: function(){
		this.requires("Thing, Selectionable");
		Crafty.audio.play("selection_execute_sound");
	} , 
	loadDialog: function(dialogArray) {
		this.dialog_tree = dialogArray;
		Crafty.trigger("ToggleControl"); // Kill movement controls while in menu.
		this.bind("Remove", function() { // Resurrect movement controls when we exit the menu.
			if(!this.assimilating){
				Crafty.trigger("ToggleControl");
			};
			console.log(this.talker);
		});
		// Display menu background.
		this.menu = Crafty.e("MenuBackground").color("blue");
		this.attach(this.menu);
		this.cursor = Crafty.e("MenuSelector");
		this.attach(this.cursor);
		
		// Display primary text on screen. x and y should be functions of the MenuBackground entity, width should be fixed.
		
		this.primaryTextY = this.menu.y + (this.menu.h * 0.25); // For testing, will move.
		
		this.nextDialog(0);
	},
	
	setTalker: function(who_dat) {
		this.talker = who_dat;
		return this;
	},
	
	// Function to load NEXT_DIALOG node.
	nextDialog: function(next_index){
		this.clearSelectionText();
		
		if(this.primary_text){
			this.primary_text.destroy();
		};
		
		this.primary_text = Crafty.e("2D, DOM, Text")
			.attr( { x: this.menu.x + (this.menu.w / 2) - (this.text_width / 2), 
					 y: this.primaryTextY, w: this.text_width} )
			.text(this.dialog_tree[next_index].TEXT)
			.textColor('white'); 
		
		// Should this be a child of the bacground entity? Would that destroy all text when we destroy the background entity?
		// Calling this.menu.destroy() would recursiveley destroy all of its children... so yes ? :)
		// THANK YOU FOR YOUR INPUT!
		this.attach(this.primary_text);
		
		// Display selectable options.
		this.loadSelectionText(this.dialog_tree[next_index].SELECTIONS);
	},
	
});

// So this will eventually load sprites (or just one if it's fixed size) for menu background and borders
Crafty.c("MenuBackground", {
	_ofsX : 0,
	_ofsY : 0,
	init: function() {
		this.requires("2D, DOM, Color");
		// One size fits all.
		var menuWidth = 0.75; // Horizontal percentage of the screen to fill.
		var menuHeight = 0.5; // Vertical percentage of the screen to fill.
		
		// Figure out the dimensions of the menu rectangle.
		var vw = Crafty.viewport._width;
		var vh = Crafty.viewport._height;
		this.w = vw * menuWidth;
		this.h = vh * menuHeight;
		
		// Calculate offsets for center (for now)
		this._ofsX = (vw - this.w) / 2; 
		this._ofsY = (vh - this.h) / 2;
		
 		// Negative offsets, because we want to undo any viewport panning.
		this.x = (-Crafty.viewport.x) + this._ofsX;
		this.y = (-Crafty.viewport.y) + this._ofsY;
	}
});

// Fixed: Leave my DOM alone! ;)
// Seriously, though, I think DOM is better for the menus.
Crafty.c("MenuSelector", {
	init : function() {
		this.requires("2D, DOM, Color");
		this.color(0,255, 128);
		this.w = 8;
		this.h = 8;
	},
});

// TODO: Merge this with Menu component.
Crafty.c("TopMenu", {
	menu: null,
	in_help_screen: false,
	help_screen: null,
	help_text: null,
	
	toggleHelp: function(){
		this.in_help_screen = !this.in_help_screen;
	},
	
	init: function(){
		this.requires("MenuBackground"); // Not really used, but implementation may change.
		this.menu = Crafty.e("MenuBackground").color("black");
		this.title_sprite = Crafty.e("title_1, 2D, DOM");
		this.title_sprite.attr( { x: this.menu.x + (this.menu.w / 2) - (this.title_sprite.w / 2), 
					 y: this.menu.y + 30 } );
		
		this.start_game_text = Crafty.e("2D, DOM, Text");
		// TODO: Center this text.
		this.start_game_text.attr({ x: this.menu.x + (this.menu.w / 2) - (150), y: this.menu.y + 30 + this.title_sprite.h, w: 300 }).text("Press ENTER key to begin.<br>Press I key for instructions.").textColor("red").textFont({size: "23px"});
		
		this.attach(this.start_game_text);
		this.attach(this.menu);
		
		// Keybind.
		// TODO: Move to separate component. Or merge with Selectionable component.
		this.bind("KeyDown", function(keypress) {
			if(!this.in_help_screen){
				if(keypress.key === Crafty.keys.ENTER) {
					console.log("Enter key pressed!");
					Crafty.audio.play("game_start_sound");
					this.unbind("KeyDown");
					this.destroy();
					Crafty.enterScene("W1M1");
				} else if(keypress.key === Crafty.keys.I) {
					// Hax.
					// TODO: Make this better.
					this.help_screen = Crafty.e("2D, DOM, help_screen").attr({x: Crafty.viewport.rect_object._x, y: Crafty.viewport.rect_object._y});
					this.help_text = Crafty.e("Text, 2D, DOM").text("Press any key to return to menu.").textColor("white");
					// Yeah, this needs to be dynamically centered as well.
					this.help_text.attr({ w: 400, x: 150, y: 400 }).textFont({ size: "23px" });
					this.help_screen.attach(this.help_text);
					this.toggleHelp();
				};
			} else {
				this.help_screen.destroy();
				this.toggleHelp();
			};
		});
	},
});

// Ending credits. Doesn't actually scroll, yet.
Crafty.c("CreditRoll", {
	text_width: 400,
	init: function() {
		this.requires("MenuBackground, 2D, DOM");
		this.menu = Crafty.e("MenuBackground").color("black");
	},
	displayText: function(text_to_display) {
		this.text_width = this.menu.w;
		this.credit_text = Crafty.e("2D, DOM, Text")
			.attr( { x: this.menu.x + (this.menu.w / 2) - (this.text_width / 2), 
					 y: this.menu.y, w: this.text_width} )
			.text(text_to_display)
			.textColor('white')
			.textFont({ size: "20px" });
		// Add code to center the text.
	}
});

// COMPONENT REWORK BELOW ##########################################################################

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Keyboard Control Components
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Pressing a key will one-shot fire an event.
// All controller events will pass a
// true or false value indicating if the key was pressed (true) or released (false)
// and a direction ( described in LD33.CONST.BEARING[] )
// example event receiver function :

// actionListen : function(data) {
//		var on = data.state; // was the key just pressed ?
//		var direciton = data.dir; // one of LD33.CONST.BEARING
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
        
        this.keystate = [
            { key:Crafty.keys.UP_ARROW,    event:"MobMove", state:false, dir: LD33.CONST.BEARING.UP },	
            { key:Crafty.keys.DOWN_ARROW,  event:"MobMove", state:false, dir: LD33.CONST.BEARING.DOWN },  
            { key:Crafty.keys.LEFT_ARROW,  event:"MobMove", state:false, dir: LD33.CONST.BEARING.LEFT },  
            { key:Crafty.keys.RIGHT_ARROW, event:"MobMove", state:false, dir: LD33.CONST.BEARING.RIGHT }, 
            { key:Crafty.keys.ENTER,       event:"Act",     state:false, dir:null},
            { key:Crafty.keys.Z,           event:"Attack",  state:false, dir:null},
            { key:Crafty.keys.SPACE,       event:"Jump",    state:false, dir:null}
        ];
	},
	handleKeyDown : function(keyPress) {
		//console.log("Key Pressed: " + keypress.key);
		if(keyPress.key === Crafty.keys.CAPS){
			Crafty.trigger("ToggleControl");
		}
        // Don't do stuff when you're not supposed to.
		if (!this.enabled) { console.log(this.enabled); return; }; 
		
		for(var i = 0; i < this.keystate.length; i++) {
			if(keyPress.key === this.keystate[i].key) {
				this.keystate[i].state = true;
				this.trigger(this.keystate[i].event, this.keystate[i]);
                return;
			}
		}
	},
	handleKeyUp : function(keyPress) {
		for(var i = 0; i < this.keystate.length; i++) {
			if(keyPress.key === this.keystate[i].key) {
				this.keystate[i].state = false;
				this.trigger(this.keystate[i].event, this.keystate[i]);
                return;
			}
		}
	},
	handleToggleControl : function() {
		if(this.enabled){
			console.log("Unbinding 'handleMove' from 'EnterFrame'.");
			// Unpress all keys.
			for(var i = 0; i < this.keystate.length; i++) {
				keyDef = this.keystate[i];
				if(keyDef.state === true) {
					keyDef.state = false;
					this.trigger(keyDef.event, {on:false, dir:keyDef.dir});
				}
			}
		}
		this.enabled = !this.enabled;
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Velocity
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Creates a vel property which is simply an X, Y vector.
// .vel { x:number, y:number }
// Hooks the entity up to "EnterFrame" and updates the x, y position of the entity by Delta t * Vel
// every frame.
Crafty.c("Velocity", {
    init : function() {
        this.requires("2D"); // Must have x and y position to have velocity.
        this.bind("EnterFrame", this._velocityFrameCallback);
        // Create the velocity object.
        this.vel = { x:0 , y: 0 };
    },
    // EnterFrame Callback function
    _velocityFrameCallback : function(data) {
        this.x += (data.dt * this.vel.x);
        this.y += (data.dt * this.vel.y);
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Mobile
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Responds to MobMove events and updates the velocity component.
Crafty.c("Mobile", {
    mobileSpeed : 0.05, // Default move speed
	init : function() {
        this.requires("Velocity, Bearing");
        this._mobileImpulse = [ // Move register
            { s:0, n:-1 }, // Index = LD33.CONST.BEARING.UP
            { s:0, n: 1 }, // LD33.CONST.BEARING.DOWN
            { s:0, n:-1 }, // LD33.CONST.BEARING.LEFT
            { s:0, n: 1 }  // LD33.CONST.BEARING.RIGHT
        ];
		this.bind("MobMove", this._mobileHandleMobMove);
        this.bind("MobIdle", this._mobileHandleMobIdle);
	} ,
    _mobileHandleMobStop : function() {
    } ,
    // Handle a MobMove command
    _mobileHandleMobMove : function(data) {
        console.log(data.dir);
        // Update the move registers.
        var impulseReg = this._mobileImpulse[data.dir];
		var dir = data.dir;
        if(data.state === true) {
            this._mobileImpulse[dir].s = this._mobileImpulse[dir].n * this.mobileSpeed;
        } else {
            this._mobileImpulse[dir].s = 0;
        }
        // Figure out velocity vector.
		this.vel.x = this._mobileImpulse[LD33.CONST.BEARING.LEFT].s +
                     this._mobileImpulse[LD33.CONST.BEARING.RIGHT].s;
        this.vel.y = this._mobileImpulse[LD33.CONST.BEARING.UP].s +
                     this._mobileImpulse[LD33.CONST.BEARING.DOWN].s;
		// Figure out what direction we're facing (favor up and down)
		if(this.vel.y < 0) { dir = LD33.CONST.BEARING.UP;
		} else if (this.vel.y > 0) { 
			dir = LD33.CONST.BEARING.DOWN;
		} else if (this.vel.x < 0) { 
			dir = LD33.CONST.BEARING.LEFT;
		} else if (this.vel.x > 0) { 
			dir = LD33.CONST.BEARING.RIGHT;
		}
		this.setBearing(dir);
    },
    _mobileHandleMobIdle : function() {
        this.vel.x = 0;
        this.vel.y = 0;
        for(var i = 0; i < this._mobileImpulse.length; i++) {
            this._mobileImpulse[i].s = 0;
        }
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Bearing
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component that describes what direction an entity is facing.
// .bearing = one of LD33.CONST.BEARING
Crafty.c("Bearing", {
    init : function() {
        this._bearing = LD33.CONST.BEARING.DOWN;
    },
    setBearing : function(bearing) {
        if(this._bearing !== bearing) { // Did we change orientation?
            this.trigger("Turn", bearing); // Trigger the turn event
        }
        this._bearing = bearing;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// CollidesWithSolid
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component to make an entity act 'solid' when checking hits against other Solid entities
Crafty.c("CollidesWithSolid", {
    init : function() {
        this.requires("Collision");
        this.onHit("Solid", this._handleCollidesWithSolid);
    } , 
    _handleCollidesWithSolid : function(hit) {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// NonPlayerCharacterAI
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component to cause entities to call a swappable think function on regular intervals.
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
