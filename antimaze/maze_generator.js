// Generates a random maze with the given size
function generate_maze(maze_width, maze_height) {
	var clean_board = generate_clean_board(units_to_total(maze_width), units_to_total(maze_height));
	var bounded_board = add_boundaries(clean_board);
	var solved_board = add_solution(bounded_board);
	return add_edges(solved_board);
}

// Generates a blank maze object with corners and unknowns
function generate_clean_board(array_width, array_height) {
	var clean_board = Array(array_height);
	for (var row = 0; row < array_height; row++) {
		clean_board[row] = Array(array_width);
		if (row % 2 == 0) {
			for (var column = 0; column < array_width; column++) {
				if (column % 2 == 0) {
					clean_board[row][column] = CORNER;
				} else {
					clean_board[row][column] = UNKNOWN;
				}
			}
		} else {
			clean_board[row].fill(UNKNOWN);
		}
	}
	return clean_board;
}

// Adds the outer edges to a clean board
function add_boundaries(clean_board) {
	// Top wall
	for (var i = 3; i < clean_board[0].length; i += 2) {
		clean_board[0][i] = EDGE_CLOSED;
	}
	// Bottom wall
	for (var i = 1; i < clean_board[0].length - 2; i += 2) {
		clean_board[clean_board.length - 1][i] = EDGE_CLOSED;
	}
	// Left and right walls
	for (var i = 1; i < clean_board.length; i += 2) {
		clean_board[i][0] = EDGE_CLOSED;
		clean_board[i][clean_board[0].length - 1] = EDGE_CLOSED;
	}
	return clean_board;
}

// Identifies the solution squares and corresponding open edges
function add_solution(bounded_board) {
	// Initially mark all of the squares as faults
	for (var x = 1; x < bounded_board.length; x += 2) {
		for (var y = 1; y < bounded_board[0].length; y += 2) {
			bounded_board[x][y] = SQUARE_FAULT_OPEN;
		}
	}
	// Opening solution edges
	bounded_board[0][1] = EDGE_OPEN;
	bounded_board[bounded_board.length - 1][bounded_board[0].length - 2] = EDGE_OPEN;
	// Open initial square
	var current_row = 1;
	var current_column = 1;
	bounded_board[current_row][current_column] = SQUARE_SOLUTION;
	// Loop through every square of the solution
	while (!(current_row == bounded_board.length - 2 && current_column == bounded_board[0].length - 2)) {
		// Open the current edge
		if (current_row == bounded_board.length - 2) {
			bounded_board[current_row][current_column + 1] = EDGE_OPEN;
			current_column += 2;
		} else if (current_column == bounded_board[0].length - 2 || fifty_percent()) {
			bounded_board[current_row + 1][current_column] = EDGE_OPEN;
			current_row += 2;
		} else {
			bounded_board[current_row][current_column + 1] = EDGE_OPEN;
			current_column += 2;
		}
		// Open the current square
		bounded_board[current_row][current_column] = SQUARE_SOLUTION;
	}
	return bounded_board;
}

// Adds the remaining edges to the board
function add_edges(solved_board) {
	var result;
	while (true) {
		result = edge_round(solved_board, false);
		if (result == false) {
			solved_board = edge_round(solved_board, true);
			break;
		} else {
			solved_board = result;
		}
	}
	return solved_board;
}

// Takes a board and a saturation boolean, returns a board if edges are added, false otherwise
function edge_round(solved_board, should_saturate) {
	var edge_added = false;
	for (var row = 1; row < solved_board.length - 1; row++) {
		for (var column = 1; column < solved_board[0].length - 1; column++) {
			if (solved_board[row][column] == UNKNOWN) {
				if (can_add_edge(solved_board, row, column)) {
					if (should_saturate || fifty_percent()) {
						solved_board[row][column] = EDGE_CLOSED;
						edge_added = true;
					}
				} else {
					solved_board[row][column] = EDGE_OPEN;
				}
			}
		}
	}
	// Only return the board if an edge were added (indicate false otherwise)
	if (edge_added || should_saturate) {
		return solved_board;
	} else {
		return false;
	}
}

// Returns a boolean for whether or not an edge can be added to the board
function can_add_edge(solved_board, row, column) {
	// Deep copy the solved board to a test board
	var test_board = Array(solved_board.length);
	for (var x = 0; x < solved_board.length; x++) {
		test_board[x] = Array(solved_board[0].length);
		for (var y = 0; y < solved_board[0].length; y++) {
			test_board[x][y] = solved_board[x][y];
		}
	}
	// Assume the edge is closed (also contain the boundaries for testing)
	test_board[row][column] = EDGE_CLOSED;
	test_board[0][1] = EDGE_CLOSED;
	test_board[test_board.length - 1][test_board[0].length - 2] = EDGE_CLOSED;
	// Attempt to parse the entire maze
	parse_maze(test_board, 1, 1);
	// Return false if any squares have not been reached
	for (var x = 1; x < test_board.length; x += 2) {
		for (var y = 1; y < test_board[0].length; y += 2) {
			if (test_board[x][y] != SQUARE_FAULT_CLOSED) {
				return false;
			}
		}
	}
	// Return true otherwise
	return true;
}

// Fills every square that can be reached from the given square
function parse_maze(test_board, row, column) {
	test_board[row][column] = SQUARE_FAULT_CLOSED;
	if (test_board[row - 1][column] != EDGE_CLOSED && test_board[row - 2][column] != SQUARE_FAULT_CLOSED) {
		parse_maze(test_board, row - 2, column);
	}
	if (test_board[row][column - 1] != EDGE_CLOSED && test_board[row][column - 2] != SQUARE_FAULT_CLOSED) {
		parse_maze(test_board, row, column - 2);
	}
	if (test_board[row + 1][column] != EDGE_CLOSED && test_board[row + 2][column] != SQUARE_FAULT_CLOSED) {
		parse_maze(test_board, row + 2, column);
	}
	if (test_board[row][column + 1] != EDGE_CLOSED && test_board[row][column + 2] != SQUARE_FAULT_CLOSED) {
		parse_maze(test_board, row, column + 2);
	}
}
