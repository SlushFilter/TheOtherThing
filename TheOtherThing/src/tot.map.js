// For local testing, run chrome with the --allow-file-access-from-files switch.
TOT.MAP = {
	TILE_WIDTH : 16,
	TILE_HEIGHT : 16,
	mapCanvas : null,
	
	load : function(imgUrl) {
		if(this.mapCanvas === null) {
			this.mapCanvas = document.createElement("canvas");
			this.mapCanvas.width = 256;
			this.mapCanvas.height = 256;
		}
		var img = this.loadImage(imgUrl, function() {
			// Image onload callback.
			var map = TOT.MAP.getMapData(this, TOT.MAP.mapCanvas);
			TOT.MAP.buildMap(map);
			Crafty.trigger("MapLoaded");
		});
	},
	
	loadImage : function(imgUrl, onloadCallback) {
		img = new Image();
		img.src = imgUrl;
		img.onload = onloadCallback;
		return img;
	},
	
	getMapData : function(img, canvas) {
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var d = ctx.getImageData(0, 0, img.width, img.height);
		
		var w = d.width;
		var h = d.height;
		var s = w * h;
		var bg = new Uint8Array(s); // Background
		var pf = new Uint8Array(s); // Playfield
		var ol = new Uint8Array(s); // Overlay
		var at = new Uint8Array(s); // Attributes
		
		var len = d.data.length;
		var di = 0;
		
		for(var si = 0; si < len;) {
			bg[di] = d.data[si++] - 1;
			pf[di] = d.data[si++] - 1;
			ol[di] = d.data[si++] - 1;
			at[di++] = d.data[si++]; 
		}
		return { width : w, height : h, size : s, 
			bg: bg, pf : pf, ol : ol, at : at }
	},
	
	buildMap : function(mapData) {
		var width = mapData.width;
		var height = mapData.height;
		var i = 0;
		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) 
			{
				this.placeBackground(mapData.bg[i], x, y);
				this.placePlayfield(mapData.pf[i], x, y);
				this.placeOverlay(mapData.ol[i], x, y);
				i++;
			}
		}
	},
	place : function(ent, x, y) {
		ent.x = x * this.TILE_WIDTH;
		ent.y = y * this.TILE_HEIGHT;
	},
	placeBackground : function(tIndex, x, y) {
		if(tIndex === 255) { return; }
		this.place(Crafty.e("FloorTile, tileset").setTile(tIndex), x, y);
	},
	placePlayfield : function(tIndex, x, y) {
		if(tIndex === 255) { return; }
		this.place(Crafty.e("PlayfieldTile, tileset").setTile(tIndex), x, y);

	},
	placeOverlay : function(tIndex, x, y) {
		if(tIndex === 255) { return; }
		this.place(Crafty.e("OverlayTile, tileset").setTile(tIndex), x, y);
	}
};

TOT.MAP.PATH = [
	{ x: 64, y: 64 },
	{ x: 128, y: 64 },
	{ x: 128, y: 128 },
	{ x: 64, y: 128 }
];

TOT.MAP.TESTPATROL = function(ent) {
	ent.addComponent("AI_Patrol");
	ent.aiSuspend();
	for(var i = 0; i < TOT.MAP.PATH.length; i++) {
		ent.patrolAddWaypoint(TOT.MAP.PATH[i]);
		console.log(TOT.MAP.PATH[i]);
	}
	ent.aiResume();
};

/*
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
	},
	
	// Placea a 'wall' tile with z = the entity's y coordinate 
	// Disclaimer : (might need tweaking)
	placeWall : function(x, y, entity) {
		entity.x = x * this._tWidth;
		entity.y = y * this._tHeight;
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
					this.place(x, y, Crafty.e("FloorTile, tileset").setTile(floor));
				}
				wall = data.wall[y][x];
				if(wall !== 0) {
					this.placeWall(x, y, Crafty.e("OverlayTile, tileset").setTile(wall));
				}
				attr = data.attr[y][x];
				if(attr > 0) {
					TOT.MAP.MAPOBJECTS[attr](x,y);
				}
			}
		}
	}
};*/