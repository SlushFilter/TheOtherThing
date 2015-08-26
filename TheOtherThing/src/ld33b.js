// Ludum Dare 33 Game: You are the monster.

// This is temp code. No organization, yet.
// TODO: 
//		- Add "scenes": map, menu, dialog?, cutscene?


// Method to load resources, initialize Crafty
function loadFunc() {
	console.log("Initializing Crafty.");
	Crafty.init(640, 480, document.getElementById("gameWindow"));
	Crafty.background("black");
	// Load up them sprites!
	Crafty.load(LD33.DATA.SPRITEDEF);
	
	//w1m1.loadLevel();
	LD33.MAP.Mapper.loadMap(LD33.DATA.MAP.W1M1);
	//Crafty.sprite(30, 60, "gfx/placeholder_jones.png", {jones: [0,0]});
	guy = Crafty.e("Player");
	guy.location(200,200,0);
	Crafty.viewport.follow(guy, 0, 0);
}