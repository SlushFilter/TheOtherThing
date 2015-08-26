var LD33 = LD33 || {};
LD33.DATA = LD33.DATA || {};

/*
	So perhaps dialog should go like this:
		Follow dialog tree until we find a SELECTION which has a RESULT value of 1 (assimilation).
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

LD33.DATA.DIALOG = {
	
	DIALOG_PLACEHOLDER: [
		 {
			NODE: 0,
			TEXT: "THIS IS SOME TEXT. I AM ASKING YOU A QUESTION AND YOU MUST CHOOSE AN ANSWER FROM BELOW.",
			SELECTIONS: [
				{SELECTION_TEXT: "Well that's interesting. Say, what's that on your face... **ASSIMILATE**", NEXT_DIALOG: 0, RESULT: -2},
				{SELECTION_TEXT: "I am a human and we are having a human conversation. How is your human family?", NEXT_DIALOG: 1, RESULT: 0},
				{SELECTION_TEXT: "Is it secret? Is it safe?!", NEXT_DIALOG: 1, RESULT: 0},
				{SELECTION_TEXT: "Look out behind you, a three-headed monkey!", NEXT_DIALOG: 0, RESULT: 2}
			]
		 },
		 {
		 NODE: 1,
			TEXT: "TEST",
			SELECTIONS: [
				{SELECTION_TEXT: "TEST", NEXT_DIALOG: 0, RESULT: 0},
				{SELECTION_TEXT: "TEST", NEXT_DIALOG: 0, RESULT: 0},
				{SELECTION_TEXT: "TEST", NEXT_DIALOG: 0, RESULT: 0},
				{SELECTION_TEXT: "TEST", NEXT_DIALOG: 0, RESULT: 0}
			]
		 }
	],
	
	DIALOG_STANDARD: [
		 {
			NODE: 0,
			TEXT: "Hello there, fellow scientist.",
			SELECTIONS: [
				{SELECTION_TEXT: "Hi, have you seen any strange, squilchy, squashy, blobby... Things around?", NEXT_DIALOG: 1, RESULT: 0},
				{SELECTION_TEXT: "I am a human and we are having a human conversation. How is your human family?", NEXT_DIALOG: 2, RESULT: 1},
				{SELECTION_TEXT: "Is it secret? Is it safe?!", NEXT_DIALOG: 1, RESULT: 0},
			]
		 },
		 {
			NODE: 1,
			TEXT: "Um, no... What a strange question. Why do you ask?",
			SELECTIONS: [
				{SELECTION_TEXT: "Uh, no reason. Say, it looks like you have something on your face. Let me get that for you. **ASSIMILATE**", NEXT_DIALOG: 0, RESULT: -2},
				{SELECTION_TEXT: "Well I heard that someone's science project has escaped. Sounds very dangerous.", NEXT_DIALOG: 3, RESULT: 1},
				{SELECTION_TEXT: "Actually, I'm not sure why I mentioned that. Forget I said anything. What were you talking about?", NEXT_DIALOG: 0, RESULT: 1},
			]
		 },
		 {
			NODE: 2,
			TEXT: "Oh crap. Are you an escaped science experiment?",
			SELECTIONS: [
				{SELECTION_TEXT: "What an odd question. I think we've gotten off on the wrong foot. Let's start over, shall we?", NEXT_DIALOG: 0, RESULT: 0},
				{SELECTION_TEXT: "I am a human and we are having a human conversation. How is your human family?", NEXT_DIALOG: 4, RESULT: 1},
				{SELECTION_TEXT: "Um... Look out behind you, a three-headed monkey!", NEXT_DIALOG: 0, RESULT: 2}
			]
		 },
		 {
			NODE: 3,
			TEXT: "Oh really? Well, that sounds dangerous... Wait, how do know about it?",
			SELECTIONS: [
				{SELECTION_TEXT: "Oh... I... Uh... Fred told me! Yep, good ol' Fred. You do have a Fred working here, right?", NEXT_DIALOG: 4, RESULT: 1},
				{SELECTION_TEXT: "Well, that's an interesting story. You see- **ASSIMILATE**", NEXT_DIALOG: 0, RESULT: -2}
			]
		 },
		 {
		 	NODE: 4,
			TEXT: "Okay, you're definitely the result of some sort of science experiment gone wrong. Just wait here, I'll go get secur- er, I mean candy! Yeah, that's it, I'll go get you some nice, well-armed candy.",
			SELECTIONS: [
				{SELECTION_TEXT: "Oooh! I like candy! I'll wait here for you.", NEXT_DIALOG: 0, RESULT: 2},
				{SELECTION_TEXT: "That sounds like a good idea. You just turn your back and- **ASSIMILATE**", NEXT_DIALOG: 0, RESULT: -2}
			]
		 }
	]
};