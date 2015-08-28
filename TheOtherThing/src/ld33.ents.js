LD33.ENTS.CreateHud = function() {
	var hud = Crafty.e("HUD");
	var hudText = Crafty.e("2D, Canvas, Text").attr({ x: 8, y: 8, z:512 }).text("SUSPICION").textColor('white');
	hud.attach(hudText);
}

LD33.ENTS.AI_BrainDead = function() {
	
};

LD33.ENTS.AI_Wander = function() {
    // Pick a random direction ...
    console.log("AI_Wander");
    var bearing = Crafty.math.randomInt(0, 7);
    if(bearing >= LD33.CONST.BEARING.NONE)  { // Causes the mob to idle.
        //this.trigger("MobIdle");
    } else { // Otherwise make the mob move in a direction.
        this.trigger("MobIdle");
        this.trigger("MobMove", { state:true, dir:bearing });
    }
};

/* Deprecated - Old wander function.
LD33.ENTS.AI_Wander = function() { 
	this.currentAction = "WALK";
	var dx = Crafty.math.randomInt(-1, 1);
	var dy = 0;
	if(dx === 0) {
		var dy = Crafty.math.randomInt(-1, 1);
	}
	if(dy < 0) { 
		this.turn("UP");
	} else if (dy > 0) {
		this.turn("DOWN");
	}
	if(dx < 0) {
		this.turn("LEFT");
	} else if (dx > 0) {
		this.turn("RIGHT");
	}
	this.vx = (dx * this.walkspeed);
	this.vy = (dy * this.walkspeed);
};*/

LD33.ENTS.Assimilate = function(target) {
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

Crafty.c("Tile", {
	init: function() {
		this.addComponent("Thing"); 
	},
	setTile : function(tileIndex) {
		var x = tileIndex % 20; // 640 / 32
		var y = (tileIndex / 20) | 0; // 640 / 32
		this.sprite(x, y, 0);
		return this;
	}
});

LD33.SpawnCorpse = function(spriteSheet, x, y) {
	Crafty.e("2D, Canvas, " + spriteSheet).attr( { x:x, y:y, z:-10 } ).animate("DIE");
};

Crafty.c("NonPlayerCharacter", {
	init : function() {
		this.requires("Thing, Mobile, Solid, Bearing, CollidesWithSolid, WiredHitBox");
	}
});

Crafty.c("NewScientist", {
	init : function() {
		this.requires("NonPlayerCharacter, AI, SCIENTIST_SPRITE");
        this.aiSetThink(LD33.ENTS.AI_Wander);
        this.setBearing(LD33.CONST.BEARING.DOWN);
	}
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
	
	think : LD33.ENTS.AI_Wander,
	
	actScience: function() {
		console.log("I am a scientist. Please do not be a monster!");
		if(this.think !== LD33.ENTS.AI_BrainDead){ // Temporary hack to stop player talking to itself.
			Crafty.e("Menu").setTalker(this).loadDialog(LD33.DATA.DIALOG.DIALOG_STANDARD);
		};
		// LD33.ENTS.Assimilate(this);
		// this.think = LD33.ENTS.AI_BrainDead;
	},
	die : function() {
		console.log("OH YOU HAVE KILLED ME!");
		this.animate("IDLE", -1);
		LD33.SpawnCorpse("TEMP_HUMAN_SPRITE", this.x, this.y);
		this.destroy();
		
	}
});