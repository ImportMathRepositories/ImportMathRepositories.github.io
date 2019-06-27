// On page load
window.onload = function() {
	init_global_variables();
}

// Initialize global variables
function init_global_variables() {
	// Setting shape sizes (hardcoding for now)
	wide_unit_pixels = 24;
	thin_unit_pixels = 6;

	// Setting maze size (hardcoding for now)
	create_maze(8, 8);
}

function create_maze(width, height) {
	// Setting maze size
	units_wide = width;
	units_high = height;
	fault_units = units_wide * units_high - units_wide - units_high + 1;

	// Canvas dimensions
	canv.width = wide_unit_pixels * units_wide + thin_unit_pixels * (units_wide + 1);
	canv.height = wide_unit_pixels * units_high + thin_unit_pixels * (units_high + 1);

	// Generate maze object
	maze = generate_maze(units_wide, units_high);
	paint_maze();
	in_game = false;
}

// Paint the maze object to the canvas
function paint_maze() {
	for (var row = 0; row < maze.length; row++) {
		for (var column = 0; column < maze[row].length; column++) {
			decode_piece_at(row, column);
		}
	}
}

// Handle the user tapping a square
function square_clicked(x, y) {
	if (is_dead_end(x, y)) {
		if (!in_game) {
			in_game = true;
			user_fault = 0;
			start_time = Date.now();
		}

		close_edge(x - 1, y);
		close_edge(x, y - 1);
		close_edge(x + 1, y);
		close_edge(x, y + 1);
		
		maze[x][y] = SQUARE_FAULT_CLOSED;
		paint_piece(x, y, line_color)
		fault_units--;

		if (fault_units == 0) {
			reveal_solution();
			end_game();
		}
	} else if (in_game && maze[x][y] != SQUARE_FAULT_CLOSED) {
		user_fault++;
	}
}

function close_edge(x, y) {
	maze[x][y] = EDGE_CLOSED;
	paint_piece(x, y, line_color);
}

function is_dead_end(x, y) {
	var open_count = 0;
	open_count += maze[x - 1][y] == EDGE_OPEN;
	open_count += maze[x][y - 1] == EDGE_OPEN;
	open_count += maze[x + 1][y] == EDGE_OPEN;
	open_count += maze[x][y + 1] == EDGE_OPEN;
	return open_count == 1;
}

function reveal_solution() {
	for (var row = 1; row < maze.length; row += 2) {
		for (var column = 1; column < maze[row].length; column += 2) {
			if (maze[row][column] == SQUARE_SOLUTION) {
				paint_piece(row, column, solution_color);
			}
		}
	}
}

function end_game() {
	var total_time = user_fault + (Date.now() - start_time) / 1000.0;
	var formatted_time = format_time(total_time);
	in_game = false;

	alert("Completion Time: " + formatted_time + "\nMisclicks: " + user_fault);
}

// Paint piece of maze
function decode_piece_at(x, y) {
	switch(maze[x][y]) {
		case CORNER:
		case EDGE_CLOSED:
			paint_piece(x, y, line_color);
			break;
		case EDGE_OPEN:
			paint_piece(x, y, open_color);
			break;
		case SQUARE_FAULT_OPEN:
		case SQUARE_SOLUTION:
			paint_piece(x, y, tile_color);
			break;
		default:
			break;
	}
}

// Handling the click of the generate button
function generate_click() {
	var raw_width = parseInt(width_input.value);
	var raw_height = parseInt(height_input.value);

	if (isNaN(raw_width) || isNaN(raw_height)) {
		alert("Invalid input. Please enter only integers ranging from 3 to 20.");
	} else if (raw_width < 3 || raw_width > 20 || raw_height < 3 || raw_height > 20) {
		alert("Out of range. Please enter only integers ranging from 3 to 20.");
	} else {
		// Reset inputs to raw integers in case of float rounding
		width_input.value = raw_width;
		height_input.value = raw_height;

		create_maze(raw_width, raw_height);
	}
}

// Left click listener
canv.addEventListener('click', function(event) {
	// Retrieving the pixels
	var x_pixel = event.pageX - canv.offsetLeft;
	var y_pixel = event.pageY - canv.offsetTop;

	// Converting to units
	var x_unit = Math.floor(Math.abs(x_pixel - thin_unit_pixels / 2) / (thin_unit_pixels + wide_unit_pixels));
	var y_unit = Math.floor(Math.abs(y_pixel - thin_unit_pixels / 2) / (thin_unit_pixels + wide_unit_pixels));

	// Handle the click
	square_clicked(units_to_total(y_unit), units_to_total(x_unit));
}, false);
