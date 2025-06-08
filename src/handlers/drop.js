const DB = require("../db.js");
const { create_prefix, seconds_to_format } = require("./common.js");

async function DropHandler (ctx) {
	const id = ctx.from.id;

	DB.dropUser(id);

	await ctx.reply("You data is reset now");
}


module.exports = DropHandler;