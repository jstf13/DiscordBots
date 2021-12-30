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
        case "help":
            message.channel.send("COMANDOS\n- hola \n- adios \n- mejor video \n- embedTest");
            break;
    };
});

client.login(config.token);