var RT = RT || {};

RT.GS = {
	Roam: "roam",
	Move: "move",
	ChooseFirst: "choose_first",
	ChooseFullAttack: "choose_full_attack",
	ChooseAttack: "choose_attack",
};


RT.Game = function(renderParent, size) {
	// Render stuff
	container = this.container = new PIXI.DisplayObjectContainer();
	renderParent.addChild(container);

	grid = this.grid = new RT.HexGrid(41, 14, 17); // 40 bad, 39 bad ..., wth
	gridRender = this.gridRender = grid.Render();
	gridRender.visible = false;
	container.addChild(gridRender);

	this.range = new PIXI.Graphics();
	container.addChild(this.range);

	player = this.player = RT.MakeUnit(0x00BB00);
	player.position.x = player.position.y = 20;
	container.addChild(player);

	enemy = this.enemy = RT.MakeUnit(0xBB0000);
	enemy.position.x = 400;
	enemy.position.y = 400;
	container.addChild(enemy);

	// Game State
	this.TransitionState(RT.GS.Roam);
	this.bounds = [
		new RT.Line(new RT.Vc(0, 0), new RT.Vc(1, 0)), // Left Edge
		new RT.Line(new RT.Vc(0, 0), new RT.Vc(0, 1)), // Bottom Edge
		new RT.Line(new RT.Vc(size.x, 0), new RT.Vc(-1, 0)), // Right Edge
		new RT.Line(new RT.Vc(0,size.y), new RT.Vc(0, -1)) // Top Edge
	];
	this.rangeBounds = [];
	this.playerRange = 3;

	// Action Hooks
	this.BindKeys();
};

RT.MakeUnit = function(color) {
	var unit = new PIXI.Graphics();
	unit.lineStyle(0, 0, 0);
	unit.beginFill(color);
	unit.drawCircle(0, 0, 12);
	unit.endFill();
	return unit;
}

RT.Game.prototype.TransitionState = function(newState) {
	/*
	 *  Actions Upon Exiting Previous State
	 */

	// Roaming
	if (this.currentState == RT.GS.Roam) {
		this.gridRender.visible = true;
	}
	// Move
	else if (this.currentState == RT.GS.Move) {
		this.range.clear();
		this.rangeBounds = [];
	}

	/*
	 *  Actions Upon Entering New State
	 */

	// Roaming
	if (newState == RT.GS.Roam) {
		this.SetMessage("Just Saccin' Around");
		this.SetAction("&nbsp;");
		this.ButtonHandler = null;

		// Remove combat overlay grid
		this.gridRender.visible = false;
	}
	// Choose First
	else if (newState == RT.GS.ChooseFirst) {
		this.SetMessage("You have entered combat!");
		this.SetAction("Press 'M' to move or 'F' for a full attack");
		this.ButtonHandler = "ChooseFirstHandler";
	}
	// Move
	else if (newState == RT.GS.Move) {
		this.SetAction("Press 'Spacebar' When Done");
		this.ButtonHandler = "MoveHandler";

		this.ShowBounds();
	}
	// Choose Attack
	else if (newState == RT.GS.ChooseFullAttack || newState == RT.GS.ChooseAttack) {
		this.SetAction("Choose Your Attack!");
		this.ButtonHandler = null;
	}

	this.currentState = newState;
}

RT.Game.prototype.ChooseFirstHandler = function(btn) {
	if ('m' == btn) {
		this.TransitionState(RT.GS.Move);
	} else if ('f' == btn) {
		this.TransitionState(RT.GS.ChooseFullAttack);
	}
}

RT.Game.prototype.MoveHandler = function(btn) {
	if (btn == 'space') {
		this.TransitionState(RT.GS.ChooseAttack);
	}
}

RT.Game.prototype.Update = function() {
	if (this.currentState == RT.GS.Roam || this.currentState == RT.GS.Move) {
		var speed = 5;
		var dir = new RT.Vc();

		if (kd.W.isDown()) dir.y += 1;
		if (kd.A.isDown()) dir.x -= 1;
		if (kd.S.isDown()) dir.y -= 1;
		if (kd.D.isDown()) dir.x += 1;

		dir = dir.Normalize();

		this.player.position.x += dir.x * speed;
		this.player.position.y += dir.y * speed;

		this.DoCollisions(this.player.position, this.bounds.concat(this.rangeBounds));

		if (this.currentState == RT.GS.Roam) {
			var p = new RT.Vc(this.player.position);
			var e = new RT.Vc(this.enemy.position);
			if (p.Add(e.Negate()).Len() < 180)
				this.TransitionState(RT.GS.ChooseFirst);
		}
	}
	//console.log(JSON.stringify(this.player.position)); becomes null at some point?
};

RT.Game.prototype.ShowBounds = function() {
	// Render movement range
	var hx = this.playerCenter = this.grid.GetGridCoord(this.player.position);

	var rg = this.playerRange;
	for (var x = -rg; x <= rg; ++x) {
		for (var y = -rg; y <= rg; ++y) {
			if (Math.abs(x + y) <= rg) {
				this.range.beginFill(0x0000FF, 1);
				this.range.lineStyle(4, 0x000066, 1);
				this.grid.RenderHex(new RT.Vc(hx.x+x, hx.y+y), this.range);
			}
		}
	}

	// Update movement bounds
	var axes = [
		this.grid.GetBasis(0).Add( this.grid.GetBasis(1) ),
		this.grid.GetBasis(0).Add( this.grid.GetBasis(2) ),
		this.grid.GetBasis(1).Add( this.grid.GetBasis(2).Negate() )
	];

	for (var i = 0; i < 3; ++i) {
		var axis = axes[i];
		axis = axis.Mult(.5*this.playerRange);
		dir = axis.Normalize();
		var center = this.grid.GetRealCoord(hx);

		this.rangeBounds.push(
			new RT.Line(center.Add(axis), dir.Negate())
		);
		this.rangeBounds.push(
			new RT.Line(center.Add(axis.Negate()), dir)
		);
	}

	console.log("bunds: " + JSON.stringify(this.rangeBounds));
}

RT.Game.prototype.DoCollisions = function(pt, bounds) {
	var len = bounds.length;
	for (var i = 0; i < len; ++i) {
		line = bounds[i];
		var fix = line.TestPoint(pt);
		pt.x += fix.x;
		pt.y += fix.y;
	}
};

RT.Game.prototype.SetMessage = function(msg) {
	document.getElementById('message').innerHTML = msg;
}

RT.Game.prototype.SetAction = function(msg) {
	document.getElementById('action').innerHTML = msg;
}

RT.Game.prototype.ButtonPress = function(btn) {
	if (this.ButtonHandler != null) {
		this[this.ButtonHandler](btn);
	}
}

RT.Game.prototype.BindKeys = function() {
	var me = this;
	kd.C.press(function() { me.ButtonPress('c'); });
	kd.M.press(function() { me.ButtonPress('m'); });
	kd.F.press(function() { me.ButtonPress('f'); });
	kd.ENTER.press(function() { me.ButtonPress('enter'); });
	kd.SPACE.press(function() { me.ButtonPress('space'); });
}