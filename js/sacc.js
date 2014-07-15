
$("document").ready(function() {
	var WIDTH = 900;
	var HEIGHT = 500;


	var stage = new PIXI.Stage(0xAAAAAA);
	var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, null, false, true);

	//Sacc shit
	var saccOn = false;
	var damage = 0;
	var masterSacc = [[], [], [], []];
	var menu;
	
	var saccBox = new PIXI.DisplayObjectContainer(); 

	$("#canvas-holder").append(renderer.view);

	// Because Simon hates y-down coordinates
	var gameContainer = new PIXI.DisplayObjectContainer();
	gameContainer.position.y = HEIGHT;
	gameContainer.scale.y = -1;
	gameContainer.scale.x = 2; // iso

	var game = new RT.Game(gameContainer, new RT.Vc(WIDTH*.5, HEIGHT));

	menu = stageMenu(0,0);
	stage.addChild(gameContainer);
	stage.addChild(saccBox);
	saccBox.position.x = 400;
	saccBox.position.y = 750;
	
	requestAnimFrame(render);
	setInterval(update, 33);

	function update() {
		kd.tick();
		game.Update();
		
		if (saccOn) {
			if (saccBox.position.y > 300)
				saccBox.position.y -= 20;
		} else {
			if (saccBox.position.y < 750)
				saccBox.position.y += 20;
		}
	}

	function render() {
		requestAnimFrame(render);
		renderer.render(stage);
	}

	function stageMenu(x, y) {
		// create a texture from an image path
		var texture = PIXI.Texture.fromImage("img/saccframe.png");
		// create a new Sprite using the texture
		menu = new PIXI.Sprite(texture);


		var back_texture = PIXI.Texture.fromImage("img/saccbg.png");
		// create a new Sprite using the texture
		var saccBG = new PIXI.Sprite(back_texture);

		// track 2D position
		menu.location = new PIXI.Point(x, y);

		menu.position.y = y;
		menu.position.x = x;
		menu.anchor.x = .5;
		menu.anchor.y = .5;

		// track 2D position
		saccBG.location = new PIXI.Point(x, y);

		saccBG.position.y = y;
		saccBG.position.x = x;
		saccBG.anchor.x = .5;
		saccBG.anchor.y = .5;
		saccBox.addChild(saccBG);
		saccBox.addChild(menu);
	    
		return menu;
	}

	function popDatSacc() {
		saccOn = !saccOn;
	}

	function startDatSacc() {

	}


	function closeDatSacc() {
	}

	function countDatSacc() {
		damage++;
	}

	function moveMenu(byX, byY) {
		alert("derr");
	}

	function moveDown(e) {
		true ? moveMenu(0, 2) : moveMenu(2, 2);
	}

	function moveLeft(e) {
		true ? moveMenu(-2, 0) : moveMenu(-2, 2);
	}

	function moveRight(e) {
		true ? moveMenu(2, 0) : moveMenu(2, -2);
	}

	// game loop optimized keyboard handling
	kd.ENTER.press(popDatSacc);
	kd.DOWN.down(moveDown);
	kd.LEFT.down(moveLeft);
	kd.RIGHT.down(moveRight);

	window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
});
