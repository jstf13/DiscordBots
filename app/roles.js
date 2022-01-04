const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});


client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    let user = message.author;

    switch (comand) {
        case "gg":
            message.reply("Hola mi descendencia, estas hablando con el concilio de los dioses");
            break;
    }
});

//module.exports = function(client){};