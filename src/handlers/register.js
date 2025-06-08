const DB = require("../db.js");

async function RegisterHandler (ctx) {
	const id = ctx.from.id;
	const text = ctx.message.text;

	if (text.match(/[0-9]+ [0-9]+/)) {
		const digits = text.split(' ').map(d => {return parseInt(d)});

		DB.fillUserInfo(id, digits[0], digits[1]);

		await ctx.reply(`Ok, you smoke ${digits[0]} cigarettes per day now, and want to quit in ${digits[1]} days. Your timer started, try /cani command.`);
	} else {
		await ctx.reply(`Unknown command. Try /help`);
	}
}


module.exports = RegisterHandler;