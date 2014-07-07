var RT = RT || {};

RT.Vc = function(x, y) {
	if (x == undefined)
		this.x = 0;
	else
		this.x = x;

	if (y == undefined)
		this.y = 0;
	else
		this.y = y;
}

RT.Vc.prototype.Normalize = function() {
	var v = this;
	var mag = v.x*v.x + v.y*v.y;
	mag = Math.sqrt(mag);
	if (mag == 0)
		mag = 1;

	return new RT.Vc(v.x / mag, v.y / mag);
}

RT.Vc.prototype.Len = function() {
	var v = this;
	return Math.sqrt(v.x*v.x + v.y*v.y);
}

RT.Vc.prototype.Dot = function(b) {
	var a = this;
	return a.x*b.x + a.y*b.y;
}

RT.Vc.prototype.Mult = function(m) {
	var v = this;
	return new RT.Vc(m*v.x, m*v.y);
}

RT.Vc.prototype.Add = function(b) {
	var a = this;
	return new RT.Vc(a.x + b.x, a.y + b.y);
}

RT.Vc.prototype.Negate = function() {
	var a = this;
	return new RT.Vc(-a.x, -a.y);
}

RT.Vc.prototype.Rotate90_CCW = function() {
	var v = this;
	return new RT.Vc(-v.y, v.x);
}

RT.Vc.prototype.Rotate90_CW = function() {
	var v = this;
	return new RT.Vc(v.y, -v.x);
}

RT.Line = function(pt, dir) {
	this.pt = pt;
	this.dir = dir.Normalize();
}

RT.Line.prototype.TestPoint = function(pt) {
	// Rotate
	var line = this.dir.Rotate90_CW();
	var test = new RT.Vc(pt.x - this.pt.x, pt.y - this.pt.y);

	var cos = line.Dot(test.Normalize());
	var sin = Math.sqrt(1 - cos*cos);
	var dist = sin * test.Len();
	//return dist;

	var val = (line.x * test.y) - (line.y * test.x);
	if (val < 0)
		return this.dir.Mult(dist);
	else
		return new RT.Vc();
}

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
	// Basis Vcs
RT.HexGrid.bases = [
	new RT.Vc(1.0, 0.0),
	new RT.Vc(0.5, Math.sqrt(3) * .5),
	new RT.Vc(0.5, Math.sqrt(3) * -.5)
];

RT.HexGrid.prototype.GetBasis = function(i) {
	return RT.HexGrid.bases[i].Mult(this.scale * Math.sqrt(.75));
}

RT.HexGrid.prototype.GetGridCoord = function(pt) {
	var radius = this.scale / 2;

	// Get coords in hex basis Vcs
	var x = (1/3*Math.sqrt(3) * pt.x - 1/3 * pt.y) / radius;
	var y = 2/3 * pt.y / radius;

	// Now perform hex rounding
	var z = -x - y;
	var rx = Math.round(x);
	var ry = Math.round(y);
	var rz = Math.round(z);

	xdif = Math.abs(rx - x);
	ydif = Math.abs(ry - y);
	zdif = Math.abs(rz - z);

	if (xdif > ydif && xdif > zdif)
		rx = -ry-rz;
	else if (ydif > zdif)
		ry = -rx-rz;
	else
		rz = -rx-ry;

	return new RT.Vc(rx, ry);
};

RT.HexGrid.prototype.GetRealCoord = function(hx) {
	var xofs = this.GetBasis(0).Mult(hx.x);
	var yofs = this.GetBasis(1).Mult(hx.y);
	return xofs.Add(yofs);
};

RT.HexGrid.prototype.RenderHex = function(hx, graphics) {
	var h = this.scale*.5; // scale
	var w = Math.sqrt(.75) * h; // width
	var ih = .5 * h;// inner height

	var ofs = this.GetRealCoord(hx);
	/*var xofs = hx.x * RT.HexGrid.bases[0].x + hx.y * RT.HexGrid.bases[1].x;
	var yofs = hx.x * RT.HexGrid.bases[0].y + hx.y * RT.HexGrid.bases[1].y;
	xofs *= w * 2;
	yofs *= w * 2;*/

	graphics.moveTo(ofs.x,			ofs.y + h);
	graphics.lineTo(ofs.x + w,	ofs.y + ih);
	graphics.lineTo(ofs.x + w,	ofs.y - ih);
	graphics.lineTo(ofs.x,			ofs.y - h);
	graphics.lineTo(ofs.x - w,	ofs.y - ih);
	graphics.lineTo(ofs.x - w,	ofs.y + ih);
	graphics.lineTo(ofs.x,			ofs.y + h);
	graphics.endFill();
};

RT.HexGrid.prototype.Render = function() {
	var grid = new PIXI.Graphics();

	for (var x = 0; x < this.width; ++x) {
		for (var y = 0; y < this.height; ++y) {
			// Fill Style
			grid.beginFill(0xAAAAAA, 1);

			// Line Style
			grid.lineStyle(4, 0x666666, 1);
			this.RenderHex(new RT.Vc(x,y), grid);
		}
	}

	return grid;
}
