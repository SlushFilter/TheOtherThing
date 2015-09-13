// Menus


// In order to implement this, we'll have to redesign the Menu and Selectionables components.
// TODO: Later.
Crafty.c("AnimatedText", {
	
	time_elapsed: 0, // Time elapsed since the last animation change. Resets each second, approx.
	substring_len: 0, // How much of the text to display.
	substring_thing: "", // The text to animate.
	
	init: function(){
		this.requires("2D, DOM, Text");
	},
	// TODO: Add parameters to control animation. (Change speed, skippable, add SFX, etc)
	animate: function(text_input){
		// console.log("Binding to EnterFrame");
		this.bind("EnterFrame", function(data) {
			this.time_elapsed += data.dt / 1000;
			if (this.time_elapsed >= 0.05) {
				// console.log(`Text: ${this.substring_thing}`);
				this.substring_thing += text_input.substring(this.substring_len - 1, this.substring_len);
				this.alpha = 1;
				this.text(this.substring_thing);
				this.time_elapsed = 0;
				this.substring_len += 1;
			};
			if (this.substring_len > text_input.length) {
				this.time_elapsed = 0;
				this.substring_len = 0;
				this.unbind("EnterFrame");
				this._parent.trigger("TextAnimationComplete");
				// console.log("Text animation complete!");
			};
		});
		return this;
	},
	
});

// TODO: Refactor the shit out of this.
Crafty.c("Selectionable", {
	SELECTION_UP: Crafty.keys.UP_ARROW,
	SELECTION_DOWN: Crafty.keys.DOWN_ARROW,
	SELECTION_EXECUTE: Crafty.keys.ENTER,
	
	selection_objects_array: [], // This holds the full objects.
	selection_text_array: [], // This just holds the text entities.
	selection_current: 0,
	selection_max: 3, // Need to dynamically load this from object?
	
	previous_text_height: 0, // Combined height of all text above text currently being drawn.
	total_selection_text_height: 0, // Just the height of the selectionables.
	
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
		this.total_selection_text_height = 0;
		for(var i = 0; i < text_objects_array.length; i++){
			this.selection_objects_array.push(text_objects_array[i]);
			this.temp_text = Crafty.e("2D, DOM, Text")
				.attr({
					// TODO: This should be moar dynamic.
					x: this.current_layout.text_x,
					y: ((i+1) * 25) + this.primaryTextY + this.primary_text.h,
					w: 200,
					alpha: 0
					})
				.text(text_objects_array[i].selection_text)
				.textColor('white');
			this.selection_text_array.push(this.temp_text);
			this.attach(this.temp_text);
			// Hack to fix text layout.
			// Perhaps the text area should be pre-calculated?
			// Or, each layout should have a max string size.
			this.temp_text.one("PostRender", function() {
				this._parent.total_selection_text_height += this._element.scrollHeight;
				this._parent.redrawSelectionText();
			});
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
	
	// Note: Text is given an alpha value of 0 when first created so that we don't get text jumping all over the screen when we initially center everything. On redraw, text alpha is set to 1.
	// Call this for the initial draw and on relevant keypresses to change the "highlighted" text.
	redrawSelectionText: function() {
		// TODO: Make these run only the first time.
		this.centerText();
		this.previous_text_height = this.primaryTextY + this.primary_text._element.scrollHeight;
		this.primary_text.y = this.primaryTextY;
		this.primary_text.attr({alpha: 1}); // More hackery.
		
		// Display selectable options.
		for(var i = 0; i < this.selection_text_array.length; i++){
			this.selection_text_array[i].attr({
			h: this.selection_text_array[i]._element.scrollHeight,
			y: this.previous_text_height,
			alpha: 1,
			});
			this.previous_text_height += this.selection_text_array[i].h;
			if(i === this.selection_current){
				this.selection_text_array[i].textColor('green');//.textFont({ weight: 'bold' });
				this.cursor.x = this.selection_text_array[i].x - 10;
				this.cursor.y = this.selection_text_array[i].y;
			} else {
				this.selection_text_array[i].textColor('white').textFont({ weight: 'normal' });
			};
		};
		this.previous_text_height = 0;
	},
	
	centerText: function() {
		// Center text and set primaryTextY based on height of all menu text.
		this.primaryTextY = this.current_layout.y + ((this.current_layout.height / 2) - ((this.total_selection_text_height + this.primary_text_height) / 2));
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
	primary_text_height: 0,
	current_layout: null,
	
	init: function(){
		console.log("Creating menu.");
		this.requires("2D, DOM, Selectionable");
		Crafty.audio.play("selection_execute_sound");
	} ,
	
	setLayout: function(layout_index) {
		// Set current layout
		// TODO: Simplify this.
		// this.current_layout = this.default_layouts[layout_index];
		this.current_layout = TOT.DATA.MENU_LAYOUTS.DEFAULT_LAYOUTS[layout_index];
		this.temp_viewport_object = new Object();
		this.temp_viewport_object._x = Crafty.viewport.rect_object._x;
		this.temp_viewport_object._y = Crafty.viewport.rect_object._y;
		this.temp_viewport_object._h = Crafty.viewport.height;
		this.temp_viewport_object._w = Crafty.viewport.width;
		this.current_layout.setLayout(this.temp_viewport_object);
		return this;
	},
	
	// TODO: Make it dynamically place multiple sprites based on sprites_array length.
	// Maybe this should be moved to a separate component.
	// Bug: This will break if the sprites are too large.
	loadSprites: function(sprites_array) {
		this.num_sprites = sprites_array.length;
		
		this.sprite_column_width = Crafty.viewport.width / this.num_sprites;
		this.sprite_x_padding = this.sprite_column_width / 2;
		
		for(var i = 0; i < sprites_array.length; i++) {
			this.temp_x = Crafty.viewport.rect_object._x + (this.sprite_column_width * i) + this.sprite_x_padding - (sprites_array[i].tile / 2);
			// this.temp_x = this.current_layout.sprite_x - (sprites_array[i].tile / 2);
			this.temp_y = this.current_layout.sprite_y - (sprites_array[i].tileh / 2);
			this.attach(Crafty.e("2D, DOM").attr({x: this.temp_x, y: this.temp_y}).addComponent(Object.keys(sprites_array[i].map)));
		};
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
		
		return this;
	},
	
	// Used for actionables. We need to identify the NPC with whom the player is conversing.
	setTalker: function(who_dat) {
		this.talker = who_dat;
		return this;
	},

	// Function to load NEXT_DIALOG node.
	nextDialog: function(next_index){
		
		this.clearSelectionText();
		
		// Remove old text.
		if(this.primary_text){
			this.primary_text.destroy();
		};
		
		// Set new text.
		this.primary_text = Crafty.e("2D, DOM, Text")
			.text(this.dialog_tree[next_index].challenge_text).textColor('white')
			.attr( { x: this.current_layout.text_x, y: this.primaryTextY, w: 200, alpha: 0} );
		this.primary_text.one("PostRender", function(){
			this._parent.primary_text_height += this._element.scrollHeight;
		});
		
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
		this.addComponent(sprite);
		return this;
	}
});

Crafty.c("MenuBackground", {
	sprite_list: [],
	sprite_list_2d: [],
	sprite_object: null,
	sprite_width: null,
	sprite_height: null,
	current_sprite_x: 0,
	current_sprite_y: 0,
	// Use the offset on bottom and right side to account for imperfect menu
	// "resolution".
	ofsY: 0,
	ofsX: 0,
	
	init: function() {
		this.requires("2D, DOM, Color");
		// Build list of sprites.
		// map: 3x3 from left to right and top to bottom:
		// 0, 1, 2
		// 3, 4, 5
		// 6, 7, 8
		// This is hard-coded for now. Need to allow for sprite selection.
		this.sprite_object = TOT.DATA.SPRITEDEF.sprites["menu_9.png"];
		this.sprite_list = Object.keys(this.sprite_object.map);
		for(var i = 0; i < 3; i++) {
			this.sprite_list_2d.push(this.sprite_list.splice(0,3));
		};
	},
	
	setAttr: function(layout_object) {
		// Configure attributes.
		this.w = layout_object.width;
		this.h = layout_object.height;
		this.x = layout_object.x;
		this.y = layout_object.y;
		return this;
	},
	
	// Default border for now
	// Need to add parameter to specify sprite tileset.
	setBorder: function() {
		this.sprite_width = this.sprite_object.tile;
		this.sprite_height = this.sprite_object.tileh;
		this.columns = Math.floor(this.w / this.sprite_width);
		this.rows = Math.floor(this.h / this.sprite_height);
		for (var y = 0; y <= this.rows; y++) {
			this.ofsY = 0;
			this.current_sprite_y = 1;
			if(y === 0) {
				this.current_sprite_y = 0;
			} else if (y === this.rows) {
				this.current_sprite_y = 2;
				this.ofsY = this.sprite_height;
			};
			for (var x = 0; x <= this.columns; x++) {
				this.ofsX = 0;
				this.current_sprite_x = 1;
				if(x === 0) {
					this.current_sprite_x = 0;
				} else if (x === this.columns) {
					this.current_sprite_x = 2;
					this.ofsX = this.sprite_width;
				};
				this.attach(Crafty.e("MenuSprite").placeSprite(this.x + (x * this.sprite_width) - this.ofsX, this.y + (y * this.sprite_height) - this.ofsY, this.sprite_list_2d[this.current_sprite_y][this.current_sprite_x]));
			};
		};
		return this;
	},
});

// Create and position the cursor.
// TODO: Need to set position upon instantiation.
Crafty.c("MenuSelector", {
	init : function() {
		this.requires("2D, DOM, Color");
		this.color(0,255, 128);
		this.w = 8;
		this.h = 10;
	},
});