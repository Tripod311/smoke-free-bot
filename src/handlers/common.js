function seconds_to_format (time) {
	const seconds_ls = time % 60;
	time -= seconds_ls;
	time /= 60;
	const minutes_ls = time % 60;
	time -= minutes_ls;
	time /= 60;

	return `${Math.floor(time)}:${Math.floor(minutes_ls)}:${Math.floor(seconds_ls)}`;
}

function create_prefix (info) {
	let from_last_smoke = (new Date() - new Date(info.last_smoke * 1000))/1000;
	let iso = new Date(info.day_start*1000).toISOString();
	const index = iso.indexOf('T');
	`Today's counting started at: ${iso.slice(index+1, index+9)}`;


	return `Last smoke was: ${seconds_to_format(from_last_smoke)} ago

Recommended interval: ${seconds_to_format(info.recommended_interval)}

Cigarettes today: ${info.cigarettes_today}/${info.cigarettes_daily}`;
}

module.exports = {
	seconds_to_format,
	create_prefix
}