const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const Discord = require("discord.js");
const config = require("./config.json");

var prefix = config.prefix;

client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("friends")
});

client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    let user = message.author;

    switch (comand) {
        case "hola":
            message.reply("Hola mi descendencia, estas hablando con el concilio de los dioses");
            break;

        case "adios":
            message.channel.send("Adios no olvides jamas mis ofrendas!");
            break;

        case "mejorvideo":
            let best = new Discord.MessageEmbed()
            .setAuthor(user.username, user.displayAvatarURL())
            .setTitle("Mejor video de youtube")
            .setDescription("Ve el mejor video hijo mio [aqui](https://www.youtube.com/watch?v=aS6s2WOLqLs)")
            .setColor("RANDOM");
            message.channel.send({ embeds: [best] });
            break;

        case "embedtest":
            const embedDatos = new Discord.MessageEmbed() 
            .setTitle("Este es su título, puede contener 256 caracteres")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setColor(0x00AE86)
            .setDescription("Este es el cuerpo principal del texto, puede contener 2048 caracteres.")
            .setFooter("Pie de página, puede contener 1024 caracteres", client.user.avatarURL())
            .setImage(message.author.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setURL("https://github.com/CraterMaik")
            .addField("Este es un título de campo", "Este es un valor de campo puede contener 1024 caracteres.")
            .addField("Campo en línea", "Debajo del campo en línea",  true)
            .addField("Campo en línea 3", "Puede tener un máximo de 25 campos.", true);
            message.channel.send({ embeds: [embedDatos] });
            break;

        case "embedwelcome":
            const user = message.mentions.users.first()
            const embedDatos2 = new Discord.MessageEmbed() 
            .setTitle("RULES:")
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setColor(0x00AE86)
            .setFooter("This is an importan message from the gods.", client.user.avatarURL())
            .setTimestamp()
            .setURL("https://github.com/CraterMaik")
            .addField("Rule 1 - No spamming.", "This includes repeated use of bot commands, misuse of spoiler tags / code blocks / special text, rapidly switching voice channels or tagging people who are not currently active in the chat.")
            .addField("Rule 2 - No advertising or selling.", "This server is not a marketplace: do not ask for money or in-game currency, try to buy / sell / giveaway anything, or ask people to join your Discord server or community. This includes messaging any user on the server.")
            .addField("Rule 3 - Be respectful", "You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.")
            .addField("Rule 4 - No hate speech or trolling.", "Harassment, hate speech, racism, sexism are not allowed here. This server has a zero-tolerance policy for such messages, and you may be banned immediately without warning or recourse.")
            .addField(" REACT WITH ✅ TO GET VERIFIED AND HAVE ACCESS TO THE SERVER!!", "_");
            message.channel.send({ embeds: [embedDatos2] }).then(embedDatos2 => {
                embedDatos2.react("✅");
            });
            message.react.tick
            break;

        case "help":
            message.channel.send("COMANDOS\n- hola \n- adios \n- mejor video \n- embedTest");
            break;
    };
});

client.login(config.token);