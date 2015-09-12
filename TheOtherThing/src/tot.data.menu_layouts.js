var TOT = TOT || {};
TOT.DATA = TOT.DATA || {};

TOT.DATA.MENU_LAYOUTS = {
	DEFAULT_LAYOUTS: [
		// TODO: Add hardpoints for sprites.
		{
			// Layout 0: Dialog window centered and takes up 75% of the screen. Main text centered in top 1/3 of window. Selection text centered in bottom 2/3.
			x: null,
			y: null,
			width: null,
			height: null,
			ofsX: null,
			ofsY: null,
			text_width: null,
			text_x: null,
			text_y: null,
			text_x_padding: null,
			setLayout: function(viewport_object) {
				this.text_x_padding = 20;
				this.height = 0.5 * viewport_object._h;
				this.width = 0.75 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = (viewport_object._h - this.height) / 2;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
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
			text_width: null,
			text_x: null,
			text_y: null,
			text_x_padding: null,
			setLayout: function(viewport_object){
				this.text_x_padding = 20;
				this.height = 0.5 * viewport_object._h;
				this.width = 0.85 * viewport_object._w;
				this.ofsX = (viewport_object._w - this.width) / 2;
				this.ofsY = viewport_object._h - this.height;
				this.x = viewport_object._x + this.ofsX;
				this.y = viewport_object._y + this.ofsY;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
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
			text_width: null,
			text_x: null,
			text_y: null,
			text_x_padding: null,
			setLayout: function(viewport_object){
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
			}
		},
		{
			// Layout 3: Dialog window takes up entire screen.
			x: null,
			y: null,
			width: null,
			height: null,
			text_width: null,
			text_x: null,
			text_y: null,
			text_x_padding: null,
			setLayout: function(viewport_object){
				this.text_x_padding = 20;
				this.height = viewport_object._h;
				this.width = viewport_object._w;
				this.x = viewport_object._x;
				this.y = viewport_object._y;
				this.text_width = this.width - (this.text_x_padding * 2);
				this.text_x = this.x + this.text_x_padding;
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
			text_width: null,
			text_x: null,
			text_y: null,
			text_x_padding: null,
			sprite_x: null,
			sprite_y: null, // These will be the center point of the sprite. So we need to process this on the other end.
			setLayout: function(viewport_object){
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
		},
		{
			// Layout 5: Do we need a blank layout or an invisible menu background?
		}
	],
};