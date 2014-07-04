var RT = RT || {};

RT.HexGrid = function(scale, width, height) {
	this.scale = scale;
	this.width = width;
	this.height = height;
	this.tiles = [];
	for (var x = 0; x < width; ++x) {
		this.tiles[x] = [];
		for (var y = 0; y < height; ++y)
			this.tiles[x][y] = {type: null, height:0};
	}
};

RT.HexGrid.prototype.Render = function() {
	var grid = new PIXI.Graphics();
	grid.position.x = 80;
	grid.position.y = 80;

	// Fill Style
	grid.beginFill(0xAAAAAA, 1);

	// Line Style
	grid.lineStyle(4, 0x666666, 1);

	// Render Hexes
	var h = this.scale*.5; // scale
	var w = Math.sqrt(.75) * h; // width
	var ih = .5 * h;// inner height

	// Basis Vectors
	basis_x = {x: 1.0, y: 0.0 };
	basis_y = {x: .5, y: Math.sqrt(3) * .5 };

	for (var x = 0; x < this.width; ++x) {
		for (var y = 0; y < this.height; ++y) {
			xofs = x * basis_x.x + y * basis_y.x;
			yofs = x * basis_x.y + y * basis_y.y;
			xofs *= w * 2;
			yofs *= w * 2;
			
			// Fill Style
			grid.beginFill(0xAAAAAA, 1);

			// Line Style
			grid.lineStyle(4, 0x666666, 1);

			grid.moveTo(xofs,			yofs + h);
			grid.lineTo(xofs + w,	yofs + ih);
			grid.lineTo(xofs + w,	yofs - ih);
			grid.lineTo(xofs,			yofs - h);
			grid.lineTo(xofs - w,	yofs - ih);
			grid.lineTo(xofs - w,	yofs + ih);
			grid.lineTo(xofs,			yofs + h);
			grid.endFill();
		}
	}

	return grid;
}