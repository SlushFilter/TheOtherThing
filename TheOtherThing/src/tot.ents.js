// TODO: Deprecate me
TOT.ENTS.CreateHud = function() {
	var hud = Crafty.e("HUD");
	var hudText = Crafty.e("2D, Canvas, Text").attr({ x: 8, y: 8, z:512 }).text("SUSPICION").textColor('white');
	hud.attach(hudText);
}

TOT.ENTS.Assimilate = function(target) {
	var player = Crafty("Feeler");
	console.log(player);
	console.log(player.posession);
	if(player.posession !== null) {
		player.posession.die();
	}
	target.addComponent("Feeler, Thing, Collision, Controllable");
	if (debug) {
		target.addComponent("WiredHitBox");
	};
	target.posession = target;
	player.destroy(); // So sad. Poor jonesy.
	Crafty.viewport.follow(target);
	target.onHit("ExitBlock", function(hit) {
		hit[0].obj.nextScene();
	});
};

TOT.SpawnCorpse = function(spriteSheet, x, y) {
	Crafty.e("2D, Canvas, " + spriteSheet).attr( { x:x, y:y, z:-10 } ).animate("DIE");
};

Crafty.c("NonPlayerCharacter", {
	init : function() {
		this.requires("Thing, Mobile, Bearing, CollidesWithSolid, WiredHitBox");
	}
});

Crafty.c("NewScientist", {
	init : function() {
		this.requires("NonPlayerCharacter, Actionable, AI_Wander, SCIENTIST_SPRITE");
        this.setBearing(TOT.CONST.BEARING.DOWN);
		// Temp code for testing dialog. Remove this before commit.
		this.actualize = function() {
			Crafty.e("Menu").setLayout(1).setTalker(this).loadDialog(TOT.DATA.DIALOG.DIALOG_STANDARD);
		};
	} ,
});

/////////////////////////////////////////
// SCIENTIST
/////////////////////////////////////////
Crafty.c("Scientist", 
{
	currentAction : "WALK",
	sprite : null,
	thinkTimer : 0,
	thinkInterval : 2000,
	walkspeed : 0.05,
	
	init : function() {
		this.addComponent("Thing, Solid, Collision, Turnable, Mobile, SCIENTIST_SPRITE, Actionable");
		this.flip("X");
		this.animate("WALK_LEFT", -1);
		this.actualize = this.actScience;
		this.takeDamage = this.die;
		this.bind("Turn", this.updateAnimation);
		this.bind("EnterFrame", this.checkThink);
		this.onHit("Solid", this.handleCollision);
		this.onHit("Player", this.handleCollision);
		this.speed = this.walkspeed;
	},
	handleCollision : function(hit) {
		this.think();
		for(var i=0; i<hit.length; i++) {
			if(hit[i].normal.y === 1 && this.vy < 0) {
				this.move_stop();
			}
			if(hit[i].normal.y === -1 && this.vy > 0) {
				this.move_stop();
			}
			if(hit[i].normal.x === 1 && this.vx < 0) {
				this.move_stop();
			}
			if (hit[i].normal.x === -1 && this.vx > 0) {
				this.move_stop();
			}
		}

	},
	updateAnimation : function(direction) {
		var animString = "IDLE_";
		if(this.currentAction === "WALK") {
			animString = "WALK_";
		}
		animString += direction;
		this.animate(animString, -1);
		if(direction === "LEFT") {
			this.flip("X");
		} else {
			this.unflip("X");
		}
	},
	checkThink : function(data) {
		this.thinkTimer -= data.dt;
		if(this.thinkTimer <= 0) {
			this.think(data);
			this.thinkTimer = this.thinkInterval;
		}
	},
	
	think : TOT.ENTS.AI_Wander,
	
	actScience: function() {
		console.log("I am a scientist. Please do not be a monster!");
		if(this.think !== TOT.ENTS.AI_BrainDead){ // Temporary hack to stop player talking to itself.
			Crafty.e("Menu").setTalker(this).loadDialog(TOT.DATA.DIALOG.DIALOG_STANDARD);
		};
		// TOT.ENTS.Assimilate(this);
		// this.think = TOT.ENTS.AI_BrainDead;
	},
	die : function() {
		console.log("OH YOU HAVE KILLED ME!");
		this.animate("IDLE", -1);
		TOT.SpawnCorpse("TEMP_HUMAN_SPRITE", this.x, this.y);
		this.destroy();
		
	}
}); 



// #############################################################################
// TEST MOB                                                                     
// #############################################################################
Crafty.c("TestMob", {
	init: function() {
		this.requires("GfxPlayfield, HitBox, Solid, Velocity, Bearing," +
			"CollidesWithSolid, AI_Wander, Mobile, SpriteCtrl, Actionable," +
			"Mortal");
		this.setHitBox(24, 24);
		//if(TOT.CONST.DEBUG === true) { this.addComponent("SolidHitBox"); } // DEBUG
		this.spriteCtrl(Crafty.e("SCIENTIST_SPRITE"));
		this.actualize = this.actScience;
	},
	actScience: function() {
		Crafty.e("Menu").setLayout(1).setTalker(this).loadDialog(TOT.DATA.DIALOG.DIALOG_STANDARD);
		console.log("I am a scientist. Please do not be a monster!");
		if(this.think !== TOT.ENTS.AI_BrainDead){ // Temporary hack to stop player talking to itself.
			Crafty.e("Menu").setTalker(this).loadDialog(TOT.DATA.DIALOG.DIALOG_STANDARD);
		};
		// TOT.ENTS.Assimilate(this);
		// this.think = TOT.ENTS.AI_BrainDead;
	}
});

