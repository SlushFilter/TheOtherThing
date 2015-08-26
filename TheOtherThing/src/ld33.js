// Ludum Dare 33 Game: You are the monster.

// This is temp code. No organization, yet.
// TODO: 
//		- Add "scenes": map, menu, dialog?, cutscene?

var debug = false;

// Method to load resources, initialize Crafty
function loadFunc() {
	console.log("Initializing Crafty.");
	Crafty.init(640, 480, document.getElementById("gameWindow"));
	Crafty.background("black");
	// Since we only have a limited resource set and everything is reused, we can load them here.
	// TODO: Need a loading screen.
	Crafty.load(LD33.DATA.SPRITEDEF);
	Crafty.load(LD33.DATA.SFX);
	Crafty.enterScene("MainMenu");
};