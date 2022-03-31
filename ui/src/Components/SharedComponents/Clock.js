import React, { useState, useEffect } from "react";

let clock = () => {
	let currentdate = new Date();
	let hours = currentdate.getHours();
	let minutes = currentdate.getMinutes();

	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;

	return hours + ":" + minutes;
};

let todayDate = () => {
	let currentdate = new Date();
	let format = {
		weekday: "long",
		year: "numeric",
		month: "short",
		day: "numeric",
	};
	let dateString = currentdate.toLocaleDateString("ar-EG", format);
	return dateString;
};


function Clock() {
	// Clock State
	const [time, setTime] = useState(clock);
	const [date, setDate] = useState(todayDate);

	// setInterval(() => {
	// 	setTime(clock);
	// 	setDate(todayDate);
	// }, 1000);

	return (
		<div className="clockContainer">
			<div> {time}</div>
			<div className="clockContainer--date">{date}</div>
		</div>
	);
}

export default Clock;
