// Paints the piece at position [x][y] a specified color
function paint_piece(x, y, color) {
	ctx.fillStyle = color;
	if (x % 2 == 0 && y % 2 == 0) {
		paint_corner(Math.floor(y / 2) * (thin_unit_pixels + wide_unit_pixels), Math.floor(x / 2) * (thin_unit_pixels + wide_unit_pixels));
	} else if (x % 2 == 0) {
		paint_horizontal_line(thin_unit_pixels + Math.floor(y / 2) * (thin_unit_pixels + wide_unit_pixels), Math.floor(x / 2) * (thin_unit_pixels + wide_unit_pixels));
	} else if (y % 2 == 0) {
		paint_vertical_line(Math.floor(y / 2) * (thin_unit_pixels + wide_unit_pixels), thin_unit_pixels + Math.floor(x / 2) * (thin_unit_pixels + wide_unit_pixels));
	} else {
		paint_square(thin_unit_pixels + Math.floor(y / 2) * (thin_unit_pixels + wide_unit_pixels), thin_unit_pixels + Math.floor(x / 2) * (thin_unit_pixels + wide_unit_pixels));
	}
}

// Paints a corner at pixel [x][y]
function paint_corner(x, y) {
	ctx.fillRect(x, y, thin_unit_pixels, thin_unit_pixels);
}

// Paints a horizontal line at pixel [x][y]
function paint_horizontal_line(x, y) {
	ctx.fillRect(x, y, wide_unit_pixels, thin_unit_pixels);
}

// Paints a vertical line at pixel [x][y]
function paint_vertical_line(x, y) {
	ctx.fillRect(x, y, thin_unit_pixels, wide_unit_pixels);
}

// Paint a square at pixel [x][y]
function paint_square(x, y) {
	ctx.fillRect(x, y, wide_unit_pixels, wide_unit_pixels);
}
