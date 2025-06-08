require("dotenv").config();
const { Telegraf } = require("telegraf");
const DB = require("./db.js");
const StartHandler = require("./handlers/start.js");
const HelpHandler = require("./handlers/help.js");
const CanIHandler = require("./handlers/cani.js");
const DropHandler = require("./handlers/drop.js");
const SmokeHandler = require("./handlers/smoke.js");
const UndoHandler = require("./handlers/undo.js");
const RegisterHandler = require("./handlers/register.js");

DB.setup();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("start", StartHandler);
bot.command("help", HelpHandler);
bot.command("cani", CanIHandler);
bot.command("drop", DropHandler);
bot.command("smoke", SmokeHandler);
bot.command("undo", UndoHandler);
bot.on("text", RegisterHandler);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;