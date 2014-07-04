
	$("document").ready(function() {
	var WIDTH = 900;
	var HEIGHT = 500;


	var stage = new PIXI.Stage(0xEEFFFF);
	var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, null, false, true);

	//Sacc shit
	var saccOn = false;
	var damage = 0;
	var masterSacc = [[], [], [], []];

	var menu;
	$("#canvas-holder").append(renderer.view);

	menu = stageMenu(200,500);
	requestAnimFrame(animate);

	// Because Simon hates y-down coordinates
	var gameContainer = new PIXI.DisplayObjectContainer();
	gameContainer.position.y = HEIGHT;
	gameContainer.scale.y = -1;
	gameContainer.scale.x = 2; // iso

	grid = new RT.HexGrid(50, 10, 10);
	gameContainer.addChild(grid.Render());

//	container.rotation = 0.5235987755982988;

	stage.addChild(gameContainer);

	function createHex(scale, x, y) {
		var hex = new PIXI.Graphics();
		hex.beginFill(0xAAAAAA, 1);
		hex.lineStyle(4, 0x666666, 1);
		var h = scale*.5; // scale
		var w = Math.sqrt(.75) * h; // width
		var ih = .5 * h;// inner height
		hex.moveTo(0, h);
		hex.lineTo(w, ih);
		hex.lineTo(w, -ih);
		hex.lineTo(0, -h);
		hex.lineTo(-w, -ih);
		hex.lineTo(-w, ih);
		hex.lineTo(0, h);
		hex.endFill();
		hex.position.x = x * w;
//		hex.position.x = scale * (1.5 * x + (y % 2) * .75);
		hex.position.y = scale * (1.5 * y + (x%2) * .75);
//		hex.position.y = 200 + y * h;
		return hex;
	}

	function animate() {
		kd.tick();

		if (saccOn) {
			if (menu.position.y < 500)
				menu.position.y += 20;
		} else {
			if (menu.position.y > 100)
				menu.position.y -= 20;
		}

		requestAnimFrame(animate);
		renderer.render(stage);
	}

	function stageMenu(x, y) {
		// create a texture from an image path
		var texture = PIXI.Texture.fromImage("img/saccframe.png");
		// create a new Sprite using the texture
		var menu = new PIXI.Sprite(texture);

		// track 2D position
		menu.location = new PIXI.Point(x, y);

		menu.position.y = y;
		menu.position.x = x;
		menu.anchor.x = .5;
		menu.anchor.y = .5;

		stage.addChild(menu);
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
