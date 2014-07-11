var RT = RT || {};

RT.Game = function(renderParent, size) {
	this.bounds = [
		new RT.Line(new RT.Vc(0, 0), new RT.Vc(1, 0)), // Left Edge
		new RT.Line(new RT.Vc(0, 0), new RT.Vc(0, 1)), // Bottom Edge
		new RT.Line(new RT.Vc(size.x, 0), new RT.Vc(-1, 0)), // Right Edge
		new RT.Line(new RT.Vc(0,size.y), new RT.Vc(0, -1)) // Top Edge
	];
	this.rangeBounds = [];

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

	this.combatMode = false;
	this.playerRange = 2;
	var me = this;
	kd.C.press(function YourFae() { me.ToggleCombat(); });
};

RT.MakeUnit = function(color) {
	var unit = new PIXI.Graphics();
	unit.lineStyle(0, 0, 0);
	unit.beginFill(color);
	unit.drawCircle(0, 0, 12);
	unit.endFill();
	return unit;
}

RT.Game.prototype.ToggleCombat = function() {
	if (this.combatMode) {
		this.combatMode = false;
		this.gridRender.visible = false;
		this.range.clear();
		this.rangeBounds = [];
	} else {
		this.combatMode = true;
		this.gridRender.visible = true;

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
	}
};

RT.Game.prototype.Update = function() {
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

	if (!this.combatMode &&
		new RT.Vc(this.player.position).Add(new RT.Vc(this.enemy.position).Negate()).Len() < 180) {
		this.ToggleCombat();
	}
	console.log(JSON.stringify(new RT.Vc(this.player.position)));
	//console.log(JSON.stringify(this.player.position));
};

RT.Game.prototype.DoCollisions = function(pt, bounds) {
	var len = bounds.length;
	for (var i = 0; i < len; ++i) {
		line = bounds[i];
		var fix = line.TestPoint(pt);
		pt.x += fix.x;
		pt.y += fix.y;
	}
};