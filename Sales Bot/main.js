require("dotenv").config();
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'PRESENCES'],
});

const index = require('../Sales Bot/src/index');
const memberCounter = require('../Sales Bot/counters/member_counter');

client.on("ready", () => {
console.log("Bueno vamos");
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("gods stuffs");
    index(client)
     //memberCounter(client)
});