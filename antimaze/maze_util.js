// Takes a number of squares and returns the full array size
function units_to_total(units) {
	return 2 * units + 1;
}

// Evaluates as true half the time
function fifty_percent() {
	return Math.random() < 0.5;
}

// Formats time based on whether or not it's under a minute
function format_time(current_time) {
	if (current_time < 60) {
		return current_time.toFixed(2);
	} else {
		var minutes = parseInt(current_time / 60);
		var seconds = (current_time % 60).toFixed(2);
		if (seconds < 10) {
			return minutes + ":0" + seconds;
		} else {
			return minutes + ":" + seconds;
		}
	}
}
