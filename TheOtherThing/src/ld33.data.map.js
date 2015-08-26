var LD33 = LD33 || {};
LD33.DATA = LD33.DATA || {};

// To be used with LD33.MAP.Mapper.loadMap
LD33.DATA.MAP = {
	W1M1 : {
		exit_to: "W1M2", // The next scene to load when player exits this map.
		width : 16,
		height : 16,
		floor : [ 
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01] ,
					[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21] ,
					[43,44,43,44,43,44,43,44,43,44,43,44,43,44,43,44] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
				],
		wall : [
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[07,07,07,07,07,07,07,07,07,07,07,07,07,07,07,07] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21,07,07,07,07,07,07,07,07,07,07,07,07,07,07,21] ,
					[01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01] ,
					[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21]
				],
		attr : [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] 
				]
	},
	W1M2 : {
		exit_to: "EndGame",
		width : 16,
		height : 16,
		floor : [ 
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01] ,
					[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21] ,
					[43,44,43,44,43,44,43,44,43,44,43,44,43,44,43,44] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[63,64,63,64,63,64,63,64,63,64,63,64,63,64,63,64] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
				],
		wall : [
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[07,07,07,07,07,07,07,07,07,07,07,07,07,07,07,07] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21] ,
					[21,07,07,07,07,07,07,07,07,07,07,07,07,07,07,21] ,
					[01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01] ,
					[21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21]
				],
		attr : [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ,
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ,
					[1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1] ,
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ,
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] 
				]
	}
};