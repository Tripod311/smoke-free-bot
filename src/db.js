const Database = require("better-sqlite3");

let db = null;
const seconds_in_day = (24 * 60 * 60);

function checkUpdate (tg_id) {
	const info = userInfo(tg_id);
	const now = new Date()/1000;

	if (now - info.day_start > seconds_in_day) {
		const day_start = info.day_start + seconds_in_day;

		const cigarettes_daily = Math.round(info.cigarettes_start - info.cigarettes_start * ((info.days_passed+1)/info.days_total));
		const recommended_interval = cigarettes_daily > 0 ? Math.floor(seconds_in_day/cigarettes_daily) : 0;

		const stmt = db.prepare(`UPDATE users SET
			day_start=?,
			last_smoke_undo=?,
			last_smoke=?,
			cigarettes_daily=?,
			recommended_interval=?,
			days_passed=days_passed+1,
			cigarettes_today=0,
			WHERE tg_id=?
		`);
		stmt.run(day_start, day_start, cigarettes_daily, recommended_interval, tg_id);
	}
}

function setup () {
	db = new Database(process.env.DB_PATH);

	db.exec(`CREATE TABLE IF NOT EXISTS users (
		tg_id INTEGER PRIMARY KEY,
		day_start INTEGER DEFAULT 0,
		last_smoke_undo INTEGER DEFAULT 0,
		last_smoke INTEGER DEFAULT 0,
		cigarettes_today INTEGER DEFAULT 0,
		cigarettes_daily INTEGER DEFAULT 0,
		cigarettes_start INTEGER DEFAULT 0,
		recommended_interval INTEGER DEFAULT 0,
		days_passed INTEGER DEFAULT 0,
		days_total INTEGER DEFAULT 0
	)`);
}

function newUser (tg_id) {
	db.prepare(`INSERT INTO users (tg_id) VALUES (?)`).run([tg_id]);
}

function fillUserInfo (tg_id, cigarettes_daily, days_total) {
	const day_start = new Date()/1000;
	const recommended_interval = Math.floor(seconds_in_day/cigarettes_daily);
	const stmt = db.prepare(`UPDATE users SET
		day_start=?,
		last_smoke=?,
		last_smoke_undo=?,
		cigarettes_daily=?,
		cigarettes_start=?,
		recommended_interval=?,
		days_total=?,
		days_passed=0,
		cigarettes_today=0
		WHERE tg_id=?
	`);
	stmt.run([day_start, day_start, day_start, cigarettes_daily, cigarettes_daily, recommended_interval, days_total, tg_id]);
}

function userInfo (tg_id) {
	const stmt = db.prepare(`SELECT * FROM users WHERE tg_id=?`);
	const result = stmt.all([tg_id]);

	if (result.length === 0) {
		newUser(tg_id);
		return userInfo(tg_id);
	} else {
		return result[0];
	}
}

function dropUser (tg_id) {
	const stmt = db.prepare(`UPDATE users SET
		day_start=0,
		last_smoke=0,
		last_smoke_undo=0,
		cigarettes_daily=0,
		recommended_interval=0,
		days_total=0,
		days_passed=0,
		cigarettes_today=0
		WHERE tg_id=?
	`);
	stmt.run([tg_id]);
}

function registerSmoke (tg_id) {
	checkUpdate(tg_id);

	const now = new Date()/1000;

	const stmt = db.prepare(`UPDATE users SET last_smoke_undo=last_smoke, last_smoke=?, cigarettes_today=cigarettes_today+1 WHERE tg_id=?`);
	stmt.run([now, tg_id]);
}

function undoSmoke (tg_id) {
	const stmt = db.prepare(`UPDATE users SET last_smoke=last_smoke_undo, cigarettes_today=cigarettes_today-1 WHERE tg_id=?`);
	stmt.run([tg_id]);
}

module.exports = {
	setup,
	newUser,
	fillUserInfo,
	checkUpdate,
	userInfo,
	dropUser,
	registerSmoke,
	undoSmoke
}