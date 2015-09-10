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
		this.requires("Menu, KeyboardControl");
		
		this.bind("SelectionUp", this.selectUp);
		this.bind("SelectionDown", this.selectDown);
		this.bind("SelectionExecute", function(keyPressed){
			if(keyPressed.state){
				this.selection_objects_array[this.selection_current].action_execute(this);
			};
		});
	},
	
	selectUp: function(keyPressed){
		if(keyPressed.state){
			if(this.selection_current > 0){
				this.selection_current--;
			} else {
				this.selection_current = this.selection_max;
			};
			Crafty.audio.play("select_sound");
			this.redrawSelectionText();
		};
	},
	selectDown: function(keyPressed){
		if(keyPressed.state){
			if(this.selection_current < this.selection_max){
				this.selection_current++;
			} else {
				this.selection_current = 0;
			};
			Crafty.audio.play("select_sound");
			this.redrawSelectionText();
		};
	},
	
	// Load the selectionables.
	loadSelectionText: function(text_objects_array){
		for(var i = 0; i < text_objects_array.length; i++){
			this.selection_objects_array.push(text_objects_array[i]);
			this.temp_text = Crafty.e("2D, DOM, Text")
				.attr({
					// TODO: This should be moar dynamic.
					x: this.menu.x + (this.menu.w / 2) - 100,
					y: ((i+1) * 25) + this.primaryTextY + this.primary_text.h,
					w: 200
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
	// ^^^ Should this be in the entity code or menu? I think entity code.s
	text_width: 300,
	cursor : null,
	dialog_tree: [],
	primary_text: null,
	talker: null, // Reference to the entity who is talking.
	assimilating: false, // So we can properly re-enable movement controls when not assimilating.
	
	default_layouts: [
		// TODO: Move to data file?
		// TODO: Add hardpoints for text and sprites.
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
				// this.height = 0.95 * viewport_object._h;
				// this.width = 0.5 * viewport_object._w;
				this.height = 320;
				this.width = 256;
				this.ofsX = viewport_object._w - this.width;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
			}
		},
		{
			// Layout 3: Dialog window takes up entire screen.
			x: null,
			y: null,
			width: null,
			height: null,
			setLayout: function(viewport_object){
				this.height = viewport_object._h;
				this.width = viewport_object._w;
				this.x = viewport_object._x;
				this.y = viewport_object._y;
			}
		},
		{
			// Layout 4: Dialog window height and width each 1/4 of screen. Window positioned in center of bottom half of screen.
			x: null,
			y: null,
			width: null,
			height: null,
			ofsX: null,
			ofsY: null,
			setLayout: function(viewport_object){
				this.height = viewport_object._h / 4;
				this.width = viewport_object._w / 4;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = (viewport_object._h / 2) + (this.height / 2);
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
			}
		},
		{
			// Layout 5: Do we need a blank layout or an invisible menu background?
		}
	],
	current_layout: null,
	
	init: function(){
		console.log("Creating menu.");
		this.requires("2D, DOM, Selectionable");
		Crafty.audio.play("selection_execute_sound");
		
	} ,
	
	setLayout: function(layout_index) {
		// Set current layout
		// TODO: Simplify this.
		this.current_layout = this.default_layouts[layout_index];
		temp_viewport_object = new Object();
		temp_viewport_object._x = Crafty.viewport.rect_object._x;
		temp_viewport_object._y = Crafty.viewport.rect_object._y;
		temp_viewport_object._h = Crafty.viewport.height;
		temp_viewport_object._w = Crafty.viewport.width;
		this.current_layout.setLayout(temp_viewport_object);
		return this;
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
		this.menu = Crafty.e("MenuBackground").setAttr(this.current_layout);//.color("blue");
		this.menu.setBorder();
		this.attach(this.menu);
		
		// Create cursor entity.
		// TODO: Move to selectionable component.
		this.cursor = Crafty.e("MenuSelector");
		this.attach(this.cursor);
		
		
		// TODO: This should be dynamic, not static.
		this.primaryTextY = this.menu.y + (this.menu.h * 0.25); 
		
		// Commence the convo.
		this.nextDialog(0);
	},
	
	// Used for actionables. We need to identify the NPC with whom the player is conversing.
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
			.text(this.dialog_tree[next_index].challenge_text).textColor('white')
			.attr( { x: this.menu.x + ((this.menu.w / 2) - 100), y: this.primaryTextY, w: 200} );
		// this.primary_text.x = this.menu.x + ((this.menu.w / 2) - 100);
		// this.primary_text.y = this.primaryTextY;
		// this.w = 200;
		
		//.attr( { x: this.menu.x + ((this.menu.w / 2) - (this.primary_text.width / 2)), 
			//		 y: this.primaryTextY, w: this.text_width} )
			
		
		// Should this be a child of the background entity? Would that destroy all text when we destroy the background entity?
		// Calling this.menu.destroy() would recursiveley destroy all of its children... so yes ? :)
		// THANK YOU FOR YOUR INPUT!
		this.attach(this.primary_text);
		
		// Display selectable options.
		this.loadSelectionText(this.dialog_tree[next_index].selections);
	},
});

// Component for handling all sprites which are used in the menu system.
Crafty.c("MenuSprite", {
	init: function() {
		this.addComponent("2D, DOM");
	},
	placeSprite(x, y, sprite){
		this.x = x;
		this.y = y;
		console.log(sprite);
		this.addComponent(sprite);
		return this;
	}
});

// So this will eventually load sprites (or just one if it's fixed size) for menu background and borders
Crafty.c("MenuBackground", {
	// TODO: Load background sprites into array
	sprite_list: [],
	sprite_list_2d: [],
	sprite_object: null,
	sprite_width: null,
	sprite_height: null,
	current_sprite_x: 0,
	current_sprite_y: 0,
	ofsY: 0,
	ofsX: 0,
	
	init: function() {
		this.requires("2D, DOM, Color");
		// Build list of sprites.
		// map: 3x3 from left to right and top to bottom:
		// 0, 1, 2
		// 3, 4, 5
		// 6, 7, 8
		this.sprite_object = TOT.DATA.SPRITEDEF.sprites["menu_9.png"];
		this.sprite_list = Object.keys(this.sprite_object.map);
		for(var i = 0; i < 3; i++) {
			this.sprite_list_2d.push(this.sprite_list.splice(0,3));
		};
	},
	
	setAttr: function(layout_object) {
		console.log("Setting attributes.");
		this.w = layout_object.width;
		this.h = layout_object.height;
		this.x = layout_object.x;
		this.y = layout_object.y;
		return this;
	},
	
	// TODO: Change this so it calls a function to create each sprite, instead of creating them inline as it currently is doing. Maybe?
	setBorder: function() {
		// Default border for now
		this.sprite_width = this.sprite_object.tile;
		this.sprite_height = this.sprite_object.tileh;
		this.columns = Math.floor(this.w / this.sprite_width);
		this.rows = Math.floor(this.h / this.sprite_height);
		
		for (var y = 0; y <= this.rows; y++) {
			this.ofsY = 0;
			if(y === 0) {
				this.current_sprite_y = 0;
			} else if (y === this.rows) {
				this.current_sprite_y = 2;
				this.ofsY = this.sprite_height;
			} else {
				this.current_sprite_y = 1;
			};
			for (var x = 0; x <= this.columns; x++) {
				this.ofsX = 0;
				if(x === 0) {
					this.current_sprite_x = 0;
				} else if (x === this.columns) {
					this.current_sprite_x = 2;
					this.ofsX = this.sprite_width;
				} else {
					this.current_sprite_x = 1;
				};
				// Place the sprite and attach it to this so that it is destroyed properly.
				this.attach(Crafty.e("MenuSprite").placeSprite(this.x + (x * this.sprite_width) - this.ofsX, this.y + (y * this.sprite_height) - this.ofsY, this.sprite_list_2d[this.current_sprite_y][this.current_sprite_x]));
			};
		};
	},
	
	drawBorder: function(x, y, tile_index) {
		
	}
});

// Create and position the cursor.
// TODO: Need to set position upon instantiation.
Crafty.c("MenuSelector", {
	init : function() {
		this.requires("2D, DOM, Color");
		this.color(0,255, 128);
		this.w = 8;
		this.h = 8;
	},
});