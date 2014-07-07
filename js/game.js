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

	grid = this.grid = new RT.HexGrid(41, 10, 10); // 40 bad, 39 bad ..., wth
	container.addChild(grid.Render());

	this.range = new PIXI.Graphics();
	container.addChild(this.range);

	player = this.player = new PIXI.Graphics();
	player.lineStyle (0, 0x000000, 0);
	player.beginFill(0xBB0000);
	player.drawCircle(0, 0, 10);
	player.endFill();
	container.addChild(player);

	this.combatMode = false;
	this.playerRange = 2;
	var me = this;
	kd.C.press(function YourFae() { me.ToggleCombat(); });
};

RT.Game.prototype.ToggleCombat = function() {
	if (this.combatMode) {
		this.combatMode = false;
		this.range.clear();
		this.rangeBounds = [];
	} else {
		this.combatMode = true;

		// Render movement range
		var hx = this.playerCenter = this.grid.GetGridCoord(this.player.position);

		var rg = this.playerRange;
		for (var x = -rg; x <= rg; ++x) {
			for (var y = -rg; y <= rg; ++y) {
				if (Math.abs(x + y) <= rg) {
					this.range.beginFill(0x0000FF, 1);
					this.range.lineStyle(4, 0x000066, 1);
					this.grid.RenderHex({x:hx.x+x, y:hx.y+y}, this.range);
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