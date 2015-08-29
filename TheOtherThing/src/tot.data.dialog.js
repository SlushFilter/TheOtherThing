var TOT = TOT || {};
TOT.DATA = TOT.DATA || {};

/*
	So perhaps dialog should go like this:
		Follow dialog tree until we find a selection which has a result value of 1 (assimilation).
		Check current suspicion level: If above a threshold, choosing this option will cause assimilation to fail and Scientist will run away (dialog menu closes). 
		
	We can make the text red and/or add a parenthetical note stating that suspicion level is too high. Or even make option unselectable until suspicion is low enough. We could then implement loops in the dialog tree to return to this option later. Or the player can just walk away and do something else to lower suspicion.
*/

/*
	Result codes:
		-2	-	Assimilate!
		-1	-	Suspicion decreate, move to next dialog.
		0	-	No suspicion change, move to next dialog.
		1	-	Suspicion increase, move to next dialog.
		2	-	Exit dialog.
*/

// TODO: Need to dynamically load dialog array.

// DialogNode prototype
function DialogNode(node_index, challenge_text, selections){
	this.node_index = node_index;
	this.challenge_text = challenge_text;
	this.selections = selections;
};

// Selection prototype
function Selection(selection_text, next_dialog, result){
	this.selection_text = selection_text;
	this.next_dialog = next_dialog;
	this.result = result;
	this.actionExecute = function(menu_object) {
		// Normal behavior is to move to the next dialog node or exit dialog.
		// TODO: Insert code to increase/decrease suspicion level.
		if(Math.abs(this.result) < 2){
			menu_object.nextDialog(this.next_dialog);
		} else {
			// A value of +/-2 means the conversation is over.
			if(this.result > 0){
				// Exit dialog.
				menu_object.destroy;
			} else {
				// Assimilate.
				console.log("ASSIMILATE HIM!");
				TOT.ENTS.Assimilate(menu_object.talker);
				menu_object.talker.think = TOT.ENTS.AI_BrainDead;
				menu_object.assimilating = true;
				menu_object.destroy();
			};
		};
	};
};

TOT.DATA.DIALOG = {
	
	DIALOG_PLACEHOLDER: [
		 new DialogNode(
			node_index = 0,
			challenge_text = "THIS IS SOME TEXT. I AM ASKING YOU A QUESTION AND YOU MUST CHOOSE AN ANSWER FROM BELOW.",
			selections = [
				new Selection(selection_text = "Well that's interesting. Say, what's that on your face... **ASSIMILATE**", next_dialog = 0, result = -2),
				new Selection(selection_text = "I am a human and we are having a human conversation. How is your human family?", next_dialog = 1, result = 0),
				new Selection(selection_text = "Is it secret? Is it safe?!", next_dialog = 1, result = 0),
				new Selection(selection_text = "Look out behind you, a three-headed monkey!", next_dialog = 0, result = 2)
			]
		 ),
		 new DialogNode(
		 node_index = 1,
			challenge_text = "TEST",
			selections = [
				new Selection(selection_text = "TEST", next_dialog = 0, result = 0),
				new Selection(selection_text = "TEST", next_dialog = 0, result = 0),
				new Selection(selection_text = "TEST", next_dialog = 0, result = 0),
				new Selection(selection_text = "TEST", next_dialog = 0, result = 0)
			]
		 )
	],
	
	DIALOG_STANDARD: [
		 new DialogNode(
			node_index = 0,
			challenge_text = "Hello there, fellow scientist.",
			selections = [
				new Selection(selection_text = "Hi, have you seen any strange, squilchy, squashy, blobby... Things around?", next_dialog = 1, result = 0),
				new Selection(selection_text = "I am a human and we are having a human conversation. How is your human family?", next_dialog = 2, result = 1),
				new Selection(selection_text = "Is it secret? Is it safe?!", next_dialog = 1, result = 0),
			]
		 ),
		 new DialogNode(
			node_index = 1,
			challenge_text = "Um, no... What a strange question. Why do you ask?",
			selections = [
				new Selection(selection_text = "Uh, no reason. Say, it looks like you have something on your face. Let me get that for you. **ASSIMILATE**", next_dialog = 0, result = -2),
				new Selection(selection_text = "Well I heard that someone's science project has escaped. Sounds very dangerous.", next_dialog = 3, result = 1),
				new Selection(selection_text = "Actually, I'm not sure why I mentioned that. Forget I said anything. What were you talking about?", next_dialog = 0, result = 1),
			]
		 ),
		 new DialogNode(
			node_index = 2,
			challenge_text = "Oh crap. Are you an escaped science experiment?",
			selections = [
				new Selection(selection_text = "What an odd question. I think we've gotten off on the wrong foot. Let's start over, shall we?", next_dialog = 0, result = 0),
				new Selection(selection_text = "I am a human and we are having a human conversation. How is your human family?", next_dialog = 4, result = 1),
				new Selection(selection_text = "Um... Look out behind you, a three-headed monkey!", next_dialog = 0, result = 2)
			]
		 ),
		 new DialogNode(
			node_index = 3,
			challenge_text = "Oh really? Well, that sounds dangerous... Wait, how do know about it?",
			selections = [
				new Selection(selection_text = "Oh... I... Uh... Fred told me! Yep, good ol' Fred. You do have a Fred working here, right?", next_dialog = 4, result = 1),
				new Selection(selection_text = "Well, that's an interesting story. You see- **ASSIMILATE**", next_dialog = 0, result = -2)
			]
		 ),
		 new DialogNode(
		 	node_index = 4,
			challenge_text = "Okay, you're definitely the result of some sort of science experiment gone wrong. Just wait here, I'll go get secur- er, I mean candy! Yeah, that's it, I'll go get you some nice, well-armed candy.",
			selections = [
				new Selection(selection_text = "Oooh! I like candy! I'll wait here for you.", next_dialog = 0, result = 2),
				new Selection(selection_text = "That sounds like a good idea. You just turn your back and- **ASSIMILATE**", next_dialog = 0, result = -2)
			]
		 )
	]
};