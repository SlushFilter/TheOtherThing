// Level map placeholder.
var LD33 = LD33 || {};

LD33.Mapper = {
	_tWidth : 32,
	_tHeight : 32,
	_mWidth : 32,
	_mHeight : 32,
	tSize : function (width, height) {
		this._w = width;
		this._h = height;
		return this;
	},
	// Places a 'floor' tile with Z = 0
	place : function (x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
		entity.z = 0;
	},
	// Placea a 'wall' tile with z = the entity's y coordinate 
	// Disclaimer : (might need tweaking)
	placeWall : function(x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
		entity.z = y;
	}
};

w1m1 = {
	loadLevel: function() {
		console.log("Loading level W1M1");
		Crafty.sprite(32, "gfx/placeholder_sprite.png", {bob:[0,0]});
		
		//var map = Crafty.isometric.size(32,32);
		var map = LD33.Mapper.tSize(32, 32);
		
		for(var x = 1; x <= 20; x++)
		{
			for(var y = 1; y < 16; y++)
			{
				console.log("Placing tile at x: " + x + " y: " + y);
				//map.placeWall(x, y, Crafty.e("2D, Canvas, bob"));
				map.place(x, y, Crafty.e("2D, Canvas, bob"));
				
				// Testing walls
				if((x===1 && y !== 10 && y !== 11) || (y===1))
				{
					map.placeWall(x, y - 1, Crafty.e("Wall").attr({w:32, h:64}).color('yellow'));
				}
				else if ((4 < x && x < 10) && (y === 4))
				{
					map.placeWall(x, y - 1, Crafty.e("Wall").attr({w:32, h:64}).color('yellow'));
				}
			}
		}
	}
}