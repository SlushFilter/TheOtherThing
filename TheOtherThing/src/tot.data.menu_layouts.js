var TOT = TOT || {};
TOT.DATA = TOT.DATA || {};

// Layout constructor.
function layout(set_layout){
	this.x = null;
	this.y = null;
	this.width = null;
	this.height = null;
	this.ofsX = null;
	this.ofsY = null;
	this.text_width = null;
	this.text_x = null;
	this.text_y = null;
	this.text_x_padding = null;
	this.sprite_x = null;
	this.sprite_y = null; // These will be the center point of the sprite. So we need to process this on the other end.
	this.setLayout = set_layout;
};

TOT.DATA.MENU_LAYOUTS = {
	DEFAULT_LAYOUTS: [
		// Layout 0: Dialog window centered and takes up 75% of the screen. Main text centered in top 1/3 of window. Selection text centered in bottom 2/3.
		new layout(
			set_layout = function(viewport_object) {
				this.text_x_padding = 20;
				this.height = 0.5 * viewport_object._h;
				this.width = 0.75 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
				this.sprite_x = viewport_object._x + (viewport_object._w / 2);
				this.sprite_y = viewport_object._y + ((this.y - viewport_object._y) / 2);
			}
		),
		
		// Layout 1: Dialog window centered in bottom 1/2 of screen. Images dynamically positioned in top 1/2 of screen. Text as in Layout 1.
		new layout(
			set_layout = function(viewport_object){
				this.text_x_padding = 20;
				this.height = 0.5 * viewport_object._h;
				this.width = 0.85 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = viewport_object._h - this.height;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
				this.sprite_x = viewport_object._x + (viewport_object._w / 2);
				this.sprite_y = viewport_object._y + ((this.y - viewport_object._y) / 2);
			}
		),
		
		// Layout 2: Dialog window positioned in right or left 1/2 of screen. Images dynamically positioned in opposite 1/2. Text as in other layouts.
		new layout(	
			set_layout = function(viewport_object){
				// this.height = 0.95 * viewport_object._h;
				// this.width = 0.5 * viewport_object._w;
				this.text_x_padding = 20;
				this.height = 320;
				this.width = 256;
				this.ofsX = viewport_object._w - this.width;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
				this.sprite_x = viewport_object._x + ((this.x - viewport_object._x) / 2);
				this.sprite_y = viewport_object._y + (viewport_object._h / 2);
			}
		),
		// Layout 3: Dialog window takes up entire screen.
		new layout(
			set_layout = function(viewport_object){
				this.text_x_padding = 20;
				this.height = viewport_object._h;
				this.width = viewport_object._w;
				this.x = viewport_object._x;
				this.y = viewport_object._y;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
				this.sprite_x = viewport_object._x + (viewport_object._w / 2);
				this.sprite_y = viewport_object._y + ((this.y - viewport_object._y) / 2);
			}
		),
			// Layout 4: Dialog window height and width each 1/4 of screen. Window positioned in center of bottom half of screen.
		new layout(
			set_layout = function(viewport_object){
				this.text_x_padding = 20;
				this.height = viewport_object._h / 4;
				this.width = viewport_object._w / 4;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = (viewport_object._h / 2) + (this.height / 2);
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
				this.sprite_x = viewport_object._x + (viewport_object._w / 2);
				this.sprite_y = viewport_object._y + ((this.y - viewport_object._y) / 2);
			}
		),
		
		// Layout 5: Do we need a blank layout or an invisible menu background?
		new layout(),
	],
};