const DB = require("../db.js");

async function HelpHandler (ctx) {
	const id = ctx.from.id;

	const info = DB.userInfo(id);

	if (info.day_start === 0) {
		await ctx.reply("You haven't registered data yet. How many cigarettes you smoke daily and how quick you want to quit? Send two digits separated with space, e.g. '20 30'");
	} else if (info.cigarettes_daily === 0) {
		await ctx.reply("You already used app and app thinks you've quit smoking. If not, send /drop command and register data again.");
	} else {
		await ctx.reply("This bot helps you quit smoking by increasing intervals between cigarettes. Send /smoke to register smoked cigarette, /undo to reset last registered smoke. Send /cani to get info about last smoe time and check if you can smoke another. Send /drop to drop your info, after that you can register once more.");
	}
}


module.exports = HelpHandler;