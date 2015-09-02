// Level map placeholder.
TOT.MAP.MAPOBJECTS = [
	null, 
	function(x, y) { TOT.MAP.Mapper.placeBlock(x, y); }, // 01 - Place a block
	function(x, y) { // 02 - Place a test entity
		TOT.MAP.Mapper.placeThing(x, y, Crafty.e("Scientist"));
	},  
	function(x, y) { // 03 - Place an ExitBlock
		exit_block = Crafty.e("ExitBlock");
		TOT.MAP.Mapper.placeThing(x, y, exit_block);
	},
	function(x, y) { // 04 - New and improved science!
		TOT.MAP.Mapper.placeThing(x, y, Crafty.e("TestMob"));
	}
	
];

// Utility class for setting tiles on the map.
TOT.MAP.Mapper = {
	current_map: null,
	_tWidth : 32,
	_tHeight : 32,
	tSize : function (width, height) {
		this._w = width;
		this._h = height;
		return this;
	},
	
	// Places a 'floor' tile with Z = 0
	place : function (x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
		entity.z = -16;
	},
	
	// Placea a 'wall' tile with z = the entity's y coordinate 
	// Disclaimer : (might need tweaking)
	placeWall : function(x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
		entity.z = y + 32; // Temporary change for 2xtile-height walls
	},
	placeThing : function(x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
	},
	// Places a blocking tile on the map.
	placeBlock : function(x, y) {
		tempThis = Crafty.e("Canvas, Block") // WiredHitBox
			.attr( {x : x * this._tWidth, 
					y : y * this._tHeight,
					w : 32,
					h : 32 } );
		if (debug){
			tempThis.addComponent("WiredHitBox");
		};
	},
	loadMap : function(data) {
		this.current_map = data;
		var w = data.width;
		var h = data.height;
		var floor;
		var wall;
		var attr;
		var row;
		for(var y = 0; y < h; y++) {
			for(var x = 0; x < w; x++) {
				floor = data.floor[y][x];
				if(floor !== 0) {
					// Pick the appropriate tile
					this.place(x, y, Crafty.e("Tile, tileset").setTile(floor));
				}
				wall = data.wall[y][x];
				if(wall !== 0) {
					this.placeWall(x, y, Crafty.e("Tile, tileset").setTile(wall));
				}
				attr = data.attr[y][x];
				if(attr > 0) {
					TOT.MAP.MAPOBJECTS[attr](x,y);
				}
			}
		}
	}
};