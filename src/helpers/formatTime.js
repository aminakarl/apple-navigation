export const formatTime = (hour, minutes) => {
	let ampm = "";

	if(hour === 0) {
		hour = 12;
		ampm = "AM";
	} else if(hour === 12) {
		ampm = "PM";
	} else if(hour > 12) {
		hour -= 12;
		ampm = "PM";
	} else {
		ampm = "AM";
	}

	if(hour.toString().length === 1) {
		hour = `0${hour}`;
	}
	
	if(minutes.toString().length === 1) {
		minutes = `0${minutes}`;
	}

	const formattedTime = `${hour}:${minutes} ${ampm}`;
	return formattedTime;
}