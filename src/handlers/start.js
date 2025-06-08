const DB = require("../db.js");

async function StartHandler (ctx) {
	const id = ctx.from.id;

	DB.newUser(id);

	await ctx.reply("You have registered. How many cigarettes you smoke daily and how quick you want to quit? Send two digits separated with space, e.g. '20 30'");
}


module.exports = StartHandler;