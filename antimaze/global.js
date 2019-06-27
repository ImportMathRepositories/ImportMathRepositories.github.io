// Piece constants
var UNKNOWN = "?";
var CORNER = "X";
var EDGE_CLOSED = "L";
var EDGE_OPEN = "O";
var SQUARE_FAULT_OPEN = "F";
var SQUARE_FAULT_CLOSED = "Z";
var SQUARE_SOLUTION = "S";

// Color constants
var	line_color = "#000044";
var	tile_color = "#82CAFA";
var open_color = "#94D4FF";
var solution_color = "#00FF00";

// Canvas variables
var canv = document.getElementById("gc");
var	ctx = canv.getContext("2d");

// Dimen inputs
var width_input = document.getElementById("widthInput");
var height_input = document.getElementById("heightInput");

// State variables
var in_game;
var start_time;
var user_fault;

// Pixels for drawing shapes
var wide_unit_pixels;
var thin_unit_pixels;

// Maze dimensions
var units_wide;
var units_high;
var fault_units;

// Maze object
var maze;
