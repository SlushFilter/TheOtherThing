var TOT = {
	DATA : {
		MAP : {},
		SPRITEDEF : {},
		DIALOG : {}
	},
	ENTS :{},
	MAP : {},
	GLOBALS : {},
	
	// Constants . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
    
	CONST : {
		DEBUG : false,
        BEARING : { 
            UP : 0,
            DOWN : 1,
            LEFT : 2,
            RIGHT : 3,
			NONE : 4, // No direction
        },
		BEARING_NAMES : [ // reverse lookup a bearing name by index.
			"UP",
			"DOWN",
			"LEFT",
			"RIGHT",
			"NONE" // No Direction
		],
		GAME_STATE : {
			PAUSED : 0,
			LOADING : 1,
			RUNNING : 2,
			MENU : 3
		},
		BACKGROUND_Z : 0,
		OVERLAY_Z : 65535
    }
}