const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const Discord = require("discord.js");
const config = require("./config.json");

var prefix = config.prefix;

client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("god stuffs")
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
            message.author.react
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
                .addField("Rule 1 - No spamming.", "This includes repeated use of bot commands, misuse of spoiler tags / code blocks / special text, rapidly switching voice channels or tagging people who are not currently active in the chat.\n\n")
                .addField("Rule 2 - No advertising or selling.", "This server is not a marketplace: do not ask for money or in-game currency, try to buy / sell / giveaway anything, or ask people to join your Discord server or community. This includes messaging any user on the server.\n\n")
                .addField("Rule 3 - Be respectful", "You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.\n\n")
                .addField("Rule 4 - No hate speech or trolling.", "Harassment, hate speech, racism, sexism are not allowed here. This server has a zero-tolerance policy for such messages, and you may be banned immediately without warning or recourse.\n\n")
                .addField(" REACT WITH ✅ TO GET VERIFIED AND HAVE ACCESS TO THE SERVER!!", "_");
                message.channel.send({ embeds: [embedDatos2] }).then(embedDatos2 => {
                    embedDatos2.react("✅");
                });
                message.react.tick
                break;

        case "embedlenguage":
            const embedDatos3 = new Discord.MessageEmbed() 
            .setTitle("SELECT THE LENGUAGE YOU PREFEER")
            .setColor(0x00AE86)
            .setFooter("This is an importan message from the gods.")
            .setTimestamp()
            .setURL("https://github.com/CraterMaik")
            .addField("🇪🇸 ESPAÑOL", "Reacciona con esta bandera para habilitar los canales en español.")
            .addField("🇬🇧 ENGLISH", "React with this flag to enable English channels.")
            .addField("❗IMPORTANT", "You can react with both flags and you will have access to both channels of each theme.")
            .addField("❗IMPORTANTE", "Puedes reaccionar con ambas banderas y tendrás acceso a ambos canales de cada tematica.")
              message.channel.send({ embeds: [embedDatos3] }).then( embedDatos3 => {
                  embedDatos3.react('🇪🇸');
                  embedDatos3.react('🇬🇧');
              });
            message.react.tick
            break;

        case "help":
            message.channel.send("COMANDOS\n- hola \n- adios \n- mejor video \n- embedTest");
            break;
    };
});

/*--- Reaction zone ---*/


client.on('messageReactionAdd', async (reaction, user) => {

    let lenguageMessage = 927252662821482506;
    let welcomeMessage = 926960221031636993;

    let spanishRol = 927215843274813510;
    let englishRol = 927224462850523156;

	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    if (reaction.message.id == welcomeMessage && reaction.emoji.name === '✅') {
        let commonRole = reaction.message.guild.roles.cache.get("926470689249189918");
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        try {
            reactedUser.roles.add(commonRole);
         } catch {
            console.log(console.error, 'Error : can\'t add the role');
         }
    }

    if (reaction.message.id == lenguageMessage) {
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        
        if (reaction.emoji.name === '🇪🇸') {
            let commonRole = reaction.message.guild.roles.cache.get("927215843274813510");
            console.log(commonRole.name);
            try {
                reactedUser.roles.add(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t add the spanish role');
             }
        }
        
        if (reaction.emoji.name === '🇬🇧') {
            let commonRole = reaction.message.guild.roles.cache.get("927224462850523156");    
                    console.log(commonRole.name);
            try {
                reactedUser.roles.add(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t add the english role');
             }
        }
    }


	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.id}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on('messageReactionRemove', (reaction, user) => {
    
    let lenguageMessage = 927252662821482506;
    let welcomeMessage = 926960221031636993;

    console.log('Reaction removed; current count:', reaction.count);
    if (reaction.message.id == 926960221031636993 && reaction.emoji.name === '✅') {
        console.log("segunda");
        let commonRole = reaction.message.guild.roles.cache.get("926470689249189918");
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        try {
            reactedUser.roles.remove(commonRole);
         } catch {
            console.log(console.error, 'Error : can\'t remove the role');
         }
    }

    if (reaction.message.id == lenguageMessage) {
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        
        if (reaction.emoji.name === '🇪🇸') {
            let commonRole = reaction.message.guild.roles.cache.get("927215843274813510");
            console.log(commonRole.name);
            try {
                reactedUser.roles.remove(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t remove the spanish role');
             }
        }
        
        if (reaction.emoji.name === '🇬🇧') {
            let commonRole = reaction.message.guild.roles.cache.get("927224462850523156");    
                    console.log(commonRole.name);
            try {
                reactedUser.roles.remove(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t remove the english role');
             }
        }
    }
});

    /*--- Moderator zone ---*/
/*
client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();

       if (message.toLocaleLowerCase.content("puto")) {
            console.log("si entre");
            message.delete();
        }

    });
*/
client.login(config.token);


