// Menus



Crafty.c("Selectionable", {
	// TODO: Refactor the shit out of this.
	SELECTION_UP: Crafty.keys.UP_ARROW,
	SELECTION_DOWN: Crafty.keys.DOWN_ARROW,
	SELECTION_EXECUTE: Crafty.keys.ENTER,
	
	selection_objects_array: [], // This holds the full objects.
	selection_text_array: [], // This just holds the text entities.
	selection_current: 0,
	selection_max: 3, // Need to dynamically load this from object?
	
	
	init: function(){
		this.requires("Thing, Menu");
		
		this.bind("SelectionUp", function(){
			if(this.selection_current > 0){
				this.selection_current--;
			} else {
				this.selection_current = this.selection_max;
			};
			Crafty.audio.play("select_sound");
			this.redrawSelectionText();
		});
		this.bind("SelectionDown", function(){
			if(this.selection_current < this.selection_max){
				this.selection_current++;
			} else {
				this.selection_current = 0;
			};
			Crafty.audio.play("select_sound");
			this.redrawSelectionText();
		});
		this.bind("SelectionExecute", function(){
			this.selection_objects_array[this.selection_current].actionExecute(this);
		});
		
		// this.bind("KeyDown", function(keypress){
			// if (keypress.key === this.SELECTION_UP){
				// Move the selection indicator up.
				// if(this.selection_current > 0){
					// this.selection_current--;
				// } else {
					// this.selection_current = this.selection_max;
				// };
				// Crafty.audio.play("select_sound");
				// this.redrawSelectionText();
			// }
			// if (keypress.key === this.SELECTION_DOWN){
				// Move the selection indicator down.
				// if(this.selection_current < this.selection_max){
					// this.selection_current++;
				// } else {
					// this.selection_current = 0;
				// };
				// Crafty.audio.play("select_sound");
				// this.redrawSelectionText();
			// }
			// if (keypress.key === this.SELECTION_EXECUTE){
				// Crafty.audio.play("selection_execute_sound");
				// Check for dialog exit.
				// Load next dialog.
				// if(this.selection_objects_array[this.selection_current].RESULT === 2){
					// Exit the conversation.
					// this.destroy();
				// } else if (this.selection_objects_array[this.selection_current].RESULT === 1){
					// Increase suspicion level.
					// this.nextDialog(this.selection_objects_array[this.selection_current].NEXT_DIALOG);
				// } else if (this.selection_objects_array[this.selection_current].RESULT === 0){
					// A 0 result means you move to the NEXT_DIALOG node.
					// this.nextDialog(this.selection_objects_array[this.selection_current].NEXT_DIALOG);
				// } else if (this.selection_objects_array[this.selection_current].RESULT === -1) {
					// Decrease suspicion level.
					// this.nextDialog(this.selection_objects_array[this.selection_current].NEXT_DIALOG);
				// } else if (this.selection_objects_array[this.selection_current].RESULT === -2) {
					// He fell for it! ASSIMILATE!
					// console.log("ASSIMILATE HIM!");
					// TOT.ENTS.Assimilate(this.talker);
					// this.talker.think = TOT.ENTS.AI_BrainDead;
					// this.assimilating = true;
					// this.destroy();
				// };
				// this.selection_objects_array[this.selection_current].actionExecute(this);
			// }
		// });
	},
	
	// Load the selectionables.
	loadSelectionText: function(text_objects_array){
		for(var i = 0; i < text_objects_array.length; i++){
			this.selection_objects_array.push(text_objects_array[i]);
			this.temp_text = Crafty.e("2D, DOM, Text")
				.attr({
					x: this.menu.x + (this.menu.w / 2) - 150,
					y: ((i+1) * 25) + this.primaryTextY + this.primary_text.h,
					w: this.text_width
					})
				.text(text_objects_array[i].selection_text)
				.textColor('white');
			if(i === this.selection_current){
				this.temp_text.textFont({
					weight: 'bold',
				}).textColor('green');
				this.cursor.x = this.temp_text.x - 10;
				this.cursor.y = this.temp_text.y;
			};
			this.selection_text_array.push(this.temp_text);
			this.attach(this.temp_text);
		};
		this.selection_max = this.selection_text_array.length - 1;
	},
	
	// Call this before loading a new set of selectionables.
	clearSelectionText: function(){
		for(var i = 0; i < this.selection_text_array.length; i++){
			this.selection_text_array[i].destroy();
		};
		this.selection_text_array = [];
		this.selection_objects_array = [];
	},
	
	// Call this for the initial draw and on relevant keypresses to change the "highlighted" text.
	redrawSelectionText: function() {
		// Display selectable options.
		for(var i = 0; i < this.selection_text_array.length; i++){
			if(i === this.selection_current){
				this.selection_text_array[i].textColor('green').textFont({ weight: 'bold' });
				this.cursor.x = this.selection_text_array[i].x - 10;
				this.cursor.y = this.selection_text_array[i].y;
			} else {
				this.selection_text_array[i].textColor('white').textFont({ weight: 'normal' });
			};
		};
	},
	
});

Crafty.c("Menu", {
	// TODO: Make these bastard scientists stop moving while we're talking to them!
	text_width: 300,
	cursor : null,
	dialog_tree: [],
	primary_text: null,
	talker: null, // Reference to the entity who is talking.
	assimilating: false, // So we can properly re-enable movement controls when not assimilating.
	
	default_layouts: [ // TODO: Prototype for layout object.
		{
			// Layout 0: Dialog window centered and takes up 75% of the screen. Main text centered in top 1/3 of window. Selection text centered in bottom 2/3.
			x: null,
			y: null,
			width: null,
			height: null,
			ofsX: null,
			ofsY: null,
			setLayout: function(viewport_object) {
				this.height = 0.5 * viewport_object._h;
				this.width = 0.75 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
			}
		},
		{
			// Layout 1: Dialog window centered in bottom 1/2 of screen. Images dynamically positioned in top 1/2 of screen. Text as in Layout 1.
			x: null,
			y: null,
			width: null,
			height: null,
			ofsX: null,
			ofsY: null,
			setLayout: function(viewport_object){
				this.height = 0.5 * viewport_object._h;
				this.width = 0.85 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = viewport_object._h - this.height;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				
			}
		},
		{
			// Layout 2: Dialog window positioned in right or left 1/2 of screen. Images dynamically positioned in opposite 1/2. Text as in other layouts.
			x: null,
			y: null,
			width: null,
			height: null,
			ofsX: null,
			ofsY: null,
			setLayout: function(viewport_object){
				this.height = 0.95 * viewport_object._h;
				this.width = 0.5 * viewport_object._w;
				this.ofsX = viewport_object._w - this.width;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
			}
		},
	],
	current_layout: null,
	
	init: function(){
		console.log("Creating menu.");
		this.requires("Thing, Selectionable");
		Crafty.audio.play("selection_execute_sound");
		
		// Generate layout.
		this.setLayout(1);
		
	} ,
	
	setLayout: function(layout_index) {
		// Set current layout
		
		this.current_layout = this.default_layouts[layout_index];
		this.current_layout.setLayout(Crafty.viewport.rect_object);
	},
	
	loadDialog: function(dialogArray) {
		this.dialog_tree = dialogArray;
		Crafty.trigger("ToggleControl"); // Kill movement controls while in menu.
		this.bind("Remove", function() { // Resurrect movement controls when we exit the menu.
			if(!this.assimilating){
				Crafty.trigger("ToggleControl");
			};
		});
		
		// Create MenuBackground entity and set dimensions & color
		this.menu = Crafty.e("MenuBackground").setAttr(this.current_layout).color("blue");
		this.attach(this.menu);
		
		// this.menu = Crafty.e("MenuBackground").color("blue");
		this.cursor = Crafty.e("MenuSelector");
		this.attach(this.cursor);
		
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
			.text(this.dialog_tree[next_index].challenge_text)
			.textColor('white'); 
		
		// Should this be a child of the background entity? Would that destroy all text when we destroy the background entity?
		// Calling this.menu.destroy() would recursiveley destroy all of its children... so yes ? :)
		// THANK YOU FOR YOUR INPUT!
		this.attach(this.primary_text);
		
		// Display selectable options.
		this.loadSelectionText(this.dialog_tree[next_index].selections);
	},
});

// So this will eventually load sprites (or just one if it's fixed size) for menu background and borders
Crafty.c("MenuBackground", {
	_ofsX : 0,
	_ofsY : 0,
	// Need to store sprites for borders and background.
	border_sprites: [],
	background_sprite: null,
	
	init: function() {
		this.requires("2D, DOM, Color");
		// One size fits all.
		// var menuWidth = 0.75; // Horizontal percentage of the screen to fill.
		// var menuHeight = 0.5; // Vertical percentage of the screen to fill.
		
		// Figure out the dimensions of the menu rectangle.
		// var vw = Crafty.viewport._width;
		// var vh = Crafty.viewport._height;
		// this.w = vw * menuWidth;
		// this.h = vh * menuHeight;
		
		// Calculate offsets for center (for now)
		// this._ofsX = (vw - this.w) / 2; 
		// this._ofsY = (vh - this.h) / 2;
		
 		// Negative offsets, because we want to undo any viewport panning.
		// this.x = (-Crafty.viewport.x) + this._ofsX;
		// this.y = (-Crafty.viewport.y) + this._ofsY;
	},
	
	setAttr: function(layout_object) {
		console.log("Setting attributes.");
		this.w = layout_object.width;
		this.h = layout_object.height;
		this.x = layout_object.x;
		this.y = layout_object.y;
		return this;
	}
});

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
		this.requires("MenuBackground, KeyboardControl"); // Not really used, but implementation may change.
		this.menu = Crafty.e("MenuBackground").color("black");
		this.title_sprite = Crafty.e("title_1, 2D, DOM");
		this.title_sprite.attr( { x: this.menu.x + (this.menu.w / 2) - (this.title_sprite.w / 2), 
					 y: this.menu.y + 30 } );
		
		this.start_game_text = Crafty.e("2D, DOM, Text");
		// TODO: Center this text.
		this.start_game_text.attr({ x: this.menu.x + (this.menu.w / 2) - (150), y: this.menu.y + 30 +this.title_sprite.h, w: 300 }).text("Press ENTER key to begin.<br>Press I key for instructions.").textColor("red").textFont({size: "23px"});
		
		this.attach(this.start_game_text);
		this.attach(this.menu);
		
		// Keybind.
		// TODO: Move to separate component. Or merge with Selectionable component.
		this.bind("Act", function(keypress) {
			if(!this.in_help_screen){
				Crafty.audio.play("game_start_sound");
				this.unbind("Act");
				this.destroy();
				Crafty.enterScene("W1M1"); // Should this be before destroy()?
			};
		});
		this.bind("KeyDown", function(keypress) {
			if(keypress.key === Crafty.keys.I && !this.in_help_screen) {
				// Hax.
				// TODO: Make this better.
				this.help_screen = Crafty.e("2D, DOM, help_screen").attr({x: Crafty.viewport.rect_object._x, y: Crafty.viewport.rect_object._y});
				this.help_text = Crafty.e("Text, 2D, DOM").text("Press any key to return to menu.").textColor("white");
				// Yeah, this needs to be dynamically centered as well.
				this.help_text.attr({ w: 400, x: 150, y: 400 }).textFont({ size: "23px" });
				this.help_screen.attach(this.help_text);
				this.toggleHelp();
			} else if (this.in_help_screen){
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