// Scenes

Crafty.defineScene("MainMenu", function() {
	console.log("Loading main menu.");
	Crafty.e("TopMenu");
});

// TODO: Create a factory that will load the info for each scene from LD33.DATA.MAP
Crafty.defineScene("W1M1", function() {
	// Scene contents
	LD33.MAP.Mapper.loadMap(LD33.DATA.MAP.W1M1);
	jonesy = Crafty.e("NewPlayer").location(200,256,32000);
	Crafty.viewport.follow(jonesy, 0, 0);
	LD33.ENTS.CreateHud();
});

Crafty.defineScene("W1M2", function() {
	// Scene contents
	LD33.MAP.Mapper.loadMap(LD33.DATA.MAP.W1M2);
	// TODO: Need to remember Jonesy's state between maps. This can be done by giving him the "Persist" Component. We'd need to modify how assimilation works so that player is always controlling the same entity instead of killing off poor Jonesy.
    // TODO: Im working on that today :) 
    
	jonesy = Crafty.e("Player").location(200,256,32000);
	Crafty.viewport.follow(jonesy, 0, 0);
	LD33.ENTS.CreateHud();
});

Crafty.defineScene("EndGame", function() {
	// Final credits scene.
	credit_roll = Crafty.e("CreditRoll").displayText("Thank you for playing our game!<br><br>Unfortunately, we were unable to finish the game due to time constraints. >.< Hopefully you've found yourself at least slightly amused.<br><br>Oh well, better luck next time!<br><br>Credits:<br>Art, good coding: Slush.Filter<br>SFX, bad coding: Anjack");
	
});