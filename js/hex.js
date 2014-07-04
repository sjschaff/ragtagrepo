var RT = RT || {};

RT.HexGrid = new function(scale, width, height) {
		this.scale = scale;
		this.width = width;
		this.height = height;
		this.tiles = [];
		for (var x = 0; x < width; ++x) {
			this.tiles[x] = [];
			for (var y = 0; y < height; ++y)
				this.tiles[x][y] = {type: null, height:0};
		}

		this.Render = new function() {
			var grid = new PIXI.Graphics();

			// Fill Style
			grid.beginFill(0xAAAAAA, 1);

			// Line Style
			grid.lineStyle(4, 0x666666, 1);

			// Render Hexes
			var h = scale*.5; // scale
			var w = Math.sqrt(.75) * h; // width
			var ih = .5 * h;// inner height

			for (var x = 0; x < this.width; ++x) {
				for (var y = 0; y < this.height; ++y) {
					xofs = x * w;
					yofs = scale * (1.5 * y + (x%2) * .75);
					
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
	}