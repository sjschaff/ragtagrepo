$("document").ready(function() {
    var WIDTH = 900;
    var HEIGHT = 500;
   

    var stage = new PIXI.Stage(0xEEFFFF);
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    //Sacc shit
    var saccOn = false;
    var damage = 0;
    var masterSacc = [[], [], [], []];

    var menu;
    $("#canvas-holder").append(renderer.view);


    menu = stageMenu(200,500);
    requestAnimFrame(animate);

    function animate() {
	
        kd.tick();

	if (saccOn) {
	    if (menu.position.y < 500)
		menu.position.y += 20;
	}
	else {
	    if (menu.position.y > 100)
		menu.position.y -= 20;
	}
	
    requestAnimFrame(animate);

        renderer.render(stage);
    }

    function stageMenu(x, y) {
	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("img/frends.jpg");
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
