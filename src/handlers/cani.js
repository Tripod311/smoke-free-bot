const DB = require("../db.js");
const { create_prefix, seconds_to_format } = require("./common.js");

async function CanIHandler (ctx) {
	const id = ctx.from.id;

	DB.checkUpdate(id);
	const info = DB.userInfo(id);

	if (info.day_start === 0) {
		await ctx.reply("You haven't registered data yet. How many cigarettes you smoke daily and how quick you want to quit? Send two digits separated with space, e.g. '20 30'");
	} else if (info.cigarettes_daily === 0) {
		await ctx.reply("You already used app and app thinks you've quit smoking. If not, send /drop command and register data again.");
	} else {
		const prefix = create_prefix(info);
		const passed = (Date.now()/1000) - info.last_smoke;

		if (passed >= info.recommended_interval) {
			await ctx.reply(`${prefix}\n\nYou can smoke now`);
		} else {
			await ctx.reply(`${prefix}\n\nWait ${seconds_to_format(info.recommended_interval - passed)}`);
		}
	}
}


module.exports = CanIHandler;