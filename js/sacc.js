
$("document").ready(function() {
	var WIDTH = 900;
	var HEIGHT = 500;


	var stage = new PIXI.Stage(0xAAAAAA);
	var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, null, false, true);

	//Sacc shit
	var saccOn = false;
	var damage = 0;
	var masterSacc = [[], [], [], []];
	


	$("#canvas-holder").append(renderer.view);

	// Because Simon hates y-down coordinates
	var gameContainer = new PIXI.DisplayObjectContainer();
	gameContainer.position.y = HEIGHT;
	gameContainer.scale.y = -1;
	gameContainer.scale.x = 2; // iso

	var game = new RT.Game(gameContainer, new RT.Vc(WIDTH*.5, HEIGHT));
	stage.addChild(gameContainer);
	
	requestAnimFrame(render);
	setInterval(update, 33);

	function update() {
		kd.tick();
		game.Update();
		
	}

	function render() {
		requestAnimFrame(render);
		renderer.render(stage);
	}

	function popDatSacc() {
		saccOn = !saccOn;
	}

	function startDatSacc() {
	    if (saccOn) {
		//draw the frame
		//register keys
		
		//add keys to string
		// on first key press
		// start timer
		//string ends with
		// combo calculator
		// when time is zero
		// stop, return number.

	    }
	}



	window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
});
