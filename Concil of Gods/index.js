//require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'PRESENCES', 'MEMBERS'],
});

const memberCounter = require("./counters/member_counter")
const Discord = require("discord.js");
const config = require("./config.json");
var prefix = config.prefix;

/**
             * Create a text progress bar
             * @param {Number} value - The value to fill the bar
             * @param {Number} maxValue - The max value of the bar
             * @param {Number} size - The bar size (in letters)
             * @return {String} - The bar
             */
 global.progressBar = (value, maxValue, size) => {
    const percentage = value / maxValue; // Calculate the percentage of the bar
    const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

    const progressText = '▇'.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
    const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar

    const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```'; // Creating the bar
    return bar;
};

client.invites = [];
client.usersInvitesRegister = [];

// Initialize the invite cache
const invites = new Map();
let serverId = '926465898582253618';
let TestServerId = '919766844385136650';
let botMessageChannel = "new-people";
let testBotMessageChannel = "probando-bots";

client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("gods stuffs")
    //memberCounter(client);

    // Traslade this code to member_counter.js
    const guild = client.guilds.cache.get("926465898582253618");
        setInterval(() =>{
            const memberCount = guild.memberCount;
            const channel = guild.channels.cache.find(channel => channel.id === '937133345932980224');
            channel.setName(`Total Members: ${memberCount}`);
            console.log('Updating Member Count');
        }, 5000);   
    // Traslade this code to member_counter.js
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

            case "i":         
            try {
                let inv = client.usersInvitesRegister.find(inv => inv.ownerId === message.author.id);
                if (inv === undefined) {
                    console.log("undefined");
                }
                else{
                //message.channel.send(`${message.author.tag} have ${inv.uses} inviterd people.`);
                const embedDatosInv = new Discord.MessageEmbed() 
                .setTitle("We the concil of gods have all the control in these server and your invitations are:")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor(0x00AE86)
                .setDescription("✅ arrives -> " + inv.uses + "\n ❌ leaves -> " + inv.leaves + "\n \n Total valid invites -> " + inv.totalValidInvites )
                //.addField("Total valid invites -> " + inv.totalValidInvites, " ")
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter("Message from the concil", client.user.avatarURL())
                message.channel.send({ embeds: [embedDatosInv] });
                message.author.react;
                }
            } catch (error) {
                console.log(error);
            }
            break;

        case "mejorvideo":
            let best = new Discord.MessageEmbed()
            //.setAuthor(user.username, user.displayAvatarURL())
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
            .addField("Este es un título de campo", "Este es un valor de campo puede contener 1024 caracteres.")
            .addField("Campo en línea", "Debajo del campo en línea",  true)
            .addField("Campo en línea 3", "Puede tener un máximo de 25 campos.", true);
            message.channel.send({ embeds: [embedDatos] });
            message.author.react
            break;
            case "lore1":
                client.on('messageCreate', message =>{
                    message.channel.send({files: ["images/lore1.png"]});
                });
                break;
            case "lore2":
                client.on('messageCreate', message =>{
                    message.channel.send({files: ["images/lore2.png"]});
                });
                break;

            case "embedwelcome-spanish":
                const user = message.mentions.users.first()
                const embedDatos2 = new Discord.MessageEmbed() 
                .setTitle("REGLAS:")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setColor(0x00AE86)
                .setFooter("Este es un importante mensaje de los dioses.", client.user.avatarURL())
                .setTimestamp()
                .addField("Regla 1 - No espamear.", "This includes repeated use of bot commands, misuse of spoiler tags / code blocks / special text, rapidly switching voice channels or tagging people who are not currently active in the chat.\n\n")
                .addField("Regla 2 - No avisos ni ventas. "," Este servidor no es un mercado: no pidas dinero o monedas de juegos, no intentes comprar / vender / regalar nada, ni pedirle a la gente que se una a tu servidor o comunidad de Discord. Esto incluye enviar mensajes a cualquier usuario del servidor.\n\n")
                .addField("Regla 3 - Se respetuoso", "Debes respetar a todos los usuarios, independientemente de tu agrado hacia ellos. Trata a los demás como quieres ser tratado.\n\n")
                .addField("Regla 4 - Sin discursos de odio ni trolling.", "El acoso, el discurso de odio, el racismo, el sexismo no están permitidos aquí. Este servidor tiene una política de tolerancia cero para dichos mensajes y es posible que se le prohíba el acceso al servidor inmediatamente sin previo aviso.\n\n")
                .addField(" REACT WITH ✅ IF YOU UNDERSTUND THE RULES!!", "_");
                message.channel.send({ embeds: [embedDatos2] }).then(embedDatos2 => {
                    embedDatos2.react("✅");
                });
                message.react.tick
                break;

                case "embedwelcome-english":
                const embedDatos7 = new Discord.MessageEmbed() 
                .setTitle("RULES:")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setColor(0x00AE86)
                .setFooter("This is an importan message from the gods.", client.user.avatarURL())
                .setTimestamp()
                .addField("Rule 1 - No spamming.", "This includes repeated use of bot commands, misuse of spoiler tags / code blocks / special text, rapidly switching voice channels or tagging people who are not currently active in the chat.\n\n")
                .addField("Rule 2 - No advertising or selling.", "This server is not a marketplace: do not ask for money or in-game currency, try to buy / sell / giveaway anything, or ask people to join your Discord server or community. This includes messaging any user on the server.\n\n")
                .addField("Rule 3 - Be respectful", "You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.\n\n")
                .addField("Rule 4 - No hate speech or trolling.", "Harassment, hate speech, racism, sexism are not allowed here. This server has a zero-tolerance policy for such messages, and you may be banned immediately without warning or recourse.\n\n")
                .addField(" REACT WITH ✅ TO GET VERIFIED AND HAVE ACCESS TO THE SERVER!!", "_");
                message.channel.send({ embeds: [embedDatos7] }).then(embedDatos7 => {
                    embedDatos7.react("✅");
                });
                message.react.tick
                break;

        case "embedlenguage":
            const embedDatos3 = new Discord.MessageEmbed() 
            .setTitle("SELECT YOUR LANGUAGE")
            .setColor(0x00AE86)
            .setFooter("This is an importan message from the gods.")
            .setTimestamp()
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

        case "embedfaq-english":
            const embedDatos4 = new Discord.MessageEmbed() 
            .setTitle("FAQ")
            .setColor(0x00AE86)
            .setFooter("This is a clarification from the gods.")
            .setTimestamp()
            .addField("What is the web?", "🔥🔥  [sonsofgods.io](https://sonsofgods.io/)  🔥🔥")
            .addField("When is the mint date?", "The mint date will be on February 9.")
            .addField("When is the white list mint?", "We will share the link through the discord with the people who are there.")
            .addField("Where is the mint?", "The link of the mint page will be shared in our official discord and twitter when the timer hit 0: 0: 0: 0")
            .addField("How can I know that you are reliable?", "The entire team of this project is sharing who each one is in real life, in this way we intend to take responsibility for what happens with this project.")
            .addField("How can I protect my money on the chaotic mint day?", "We highly recommend to make a burn wallet, it is just a wallet with the amount of the price of all NFTs that you will mint and the gas fees for all the transactions.")
            .addField("On which blockchain the NFTs are on?", "These collection and the upcoming will exist in solana network.")
            .addField("How are made the sons of gods??", "Our professional designer made the layers in Blender, ..., ... and our programmers mixed it with a custom candy machine, except for the gods who are made manually each of them.")
                message.channel.send({ embeds: [embedDatos4] }).then( embedDatos4 => {
                    embedDatos4.react('🔥');
                });
            message.react.tick
            break;

        case "embedfaq-spanish":
            const embedDatos5 = new Discord.MessageEmbed() 
            .setTitle("FAQ")
            .setColor(0x00AE86)
            .setFooter("Estas son aclaraciones de los dioses.")
            .setTimestamp()
            .addField("Cual es la web?", "🔥🔥  [sonsofgods.io](https://sonsofgods.io/)  🔥🔥")
            .addField("Cuando es el minteo?", "El minteo sera el 9 de Febrero.")
            .addField("Cuando es el minteo de la whitlist?", "Compartiremos el link de ese minteo por nuestro discord con la gente dentro de la whitlist.")
            .addField("Donde es el minteo?", "El enlace de la página de minteo se compartirá en nuestro servidor de discord y en nuestro Twitter oficial cuando el temporizador llegue a 0: 0: 0: 0")
            .addField("Como puedo saber que el proyecto es fiable?", "Todo el equipo de este proyecto está compartiendo abiertamente su identidad, de esta manera pretendemos responsabilizarnos de todo lo que suceda con este proyecto.")
            .addField("Como puedo protejerme de estafas el dia del minteo?", "Recomendamos encarecidamente hacer una burn wallet, esto es solamente una billetera con el monto del precio de todos los NFT que comprara en el minteo y las tarifas de gas fee para todas las transacciones.")
            .addField("En que blockchain existiran los NFTs de sons of gods?", "Esta colección y las próximas existirán en la red de solana.")
            .addField("Como son hechos los NFTs de sons of gods?", "Nuestro diseñador profesional hizo las distintas capas en Blender, ..., ... y nuestros programadores lo mezclaron con una version de Candy Machine, a excepción de los dioses que se hacen manualmente cada uno de ellos.")
                message.channel.send({ embeds: [embedDatos5] }).then( embedDatos5 => {
                    embedDatos5.react('🔥');
                });
            message.react.tick
            break;

        case "progressbar":
            message.channel.send(progressBar(99, 100, 10));
            break;
            case "level":
            message.channel.send("Nivel 1 Muchacho!");
            break;

        case "help":
            message.channel.send("COMANDOS\n- hola \n- adios \n- mejor video \n- embedTest");
            break;
    };
});

/*--- Reaction zone ---*/

client.on('messageReactionAdd', async (reaction, user) => {

    let lenguageMessage = 927573907760881665;
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
    
    let lenguageMessage = 927573907760881665;
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

/*--- Close Reaction zone ---*/

/*--- Moderator zone ---*/

client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();

    let blacklistedSpanish = ['puto', 'puta', 'hijo de puta', 'la puta que te pario', 'la concha de tu madre',
     'hijo de remil pute', 'chupamela', 'chupa pija', 'sos una pija', 'pija']; 
     
    let blacklistedEnglish = ['son of a bitch', 'fuck you', 'asshole' ,'ashole', 'asole', 'fu', 'son of a bitch', 
    'pussy', 'cock', 'dick', 'bastard', 'motherfucker', 'nigga', 'nigger'];

    let foundInTextSpanish = false;
    let foundInTextEnglish = false;

    for (var i in blacklistedSpanish) {
      if (message.content.toLowerCase().includes(blacklistedSpanish[i].toLowerCase())) foundInTextSpanish = true;
    }

    for (var j in blacklistedEnglish) {
      if (message.content.toLowerCase().includes(blacklistedEnglish[j].toLowerCase())) foundInTextEnglish = true;
    }

    if (foundInTextSpanish) {
        message.channel.send(`${message.author} Si puteas mucho te baneamos`);
        message.delete();
    } 

    if (foundInTextEnglish) {
        message.channel.send(`${message.author} Don't use bad words or you will get banned`);
        message.delete();
    }
});

/*---Close Moderator zone ---*/

/*--- Level zone ---*/



// A pretty useful method to create a delay without blocking the whole script.
const wait = require("timers/promises").setTimeout;

client.on("ready", async () => {
  // "ready" isn't really ready. We need to wait a spell.
  await wait(1000);

  // Loop over all the guilds
  client.guilds.cache.forEach(async (guild) => {
    // Fetch all Guild Invites
    const firstInvites = await guild.invites.fetch();
    // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
   // inviteUsers.set(firstInvites.map((invite) => [invite.uses]), users);
   if(guild.id == TestServerId)
    allTimeUsers = new Array();
    invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, 
        allTimeUsers = new Array()])));
  });
});

client.on("inviteCreate", (invite) => {
    var userInvites = new Object();
    userInvites.ownerId = user.id;
    userInvites.ownerTag = invite.inviter.tag;
    userInvites.users = [];
    userInvites.uses = 0;
    userInvites.leaves = 0;
    userInvites.totalValidInvites = 0;

    //userInvites.invites.push(invite.code);
    client.usersInvitesRegister.push(userInvites);
    client.invites[invite.code] = invite.uses
});

client.on("inviteDelete", (invite) => {
    // Delete the Invite from Cache
    invites.get(invite.guild.id).delete(invite.code);
});
  
client.on("guildCreate", (guild) => {
    // We've been added to a new Guild. Let's fetch all the invites, and save it to our cache
    guild.invites.fetch().then(guildInvites => {
      // This is the same as the ready event
      invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, 
        allTimeUsers = new Array()])));
    })
});
  
client.on("guildDelete", (guild) => {
    // We've been removed from a Guild. Let's delete all their invites
    invites.delete(guild.id);
});


function createUserInvitesSpace(usedInvite) {
    var userInvites = new Object();
    userInvites.ownerId = usedInvite.inviterId;
    userInvites.ownerTag = usedInvite.inviterTag;
    userInvites.users = [];
    userInvites.uses = 0;
    userInvites.leaves = 0;
    userInvites.totalValidInvites = 0;

    client.usersInvitesRegister.push(userInvites);
    return userInvites;
}


function setUserInvitesRegister(usedInvite) {
    try {
         let inv = client.usersInvitesRegister.find(inv => inv.ownerId === usedInvite.inviterId);
         if(inv === undefined){
            createUserInvitesSpace(usedInvite);
            inv = client.usersInvitesRegister.find(inv => inv.ownerId === usedInvite.inviterId);
         }
        inv.users.push(usedInvite.invited);
        inv.uses++;
        inv.totalValidInvites++;
    } catch (error) {
        console.log(error);
    }
   
};

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.find(channel => channel.name === testBotMessageChannel);
    let usedInvite = new Object();

    member.guild.invites.fetch().then(guildInvites => { //get all guild invites
        guildInvites.each(invite => { //basically a for loop over the invites:
            if(invite.uses != client.invites[invite.code]) { //if it doesn't match what we stored
                channel.send(`${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter.tag}.`)

                client.invites[invite.code] = invite.uses;

                usedInvite.invite = invite;
                usedInvite.inviterId = invite.inviter.id;
                usedInvite.inviterTag = invite.inviter.tag;
                usedInvite.invited = member.user.id;
                setUserInvitesRegister(usedInvite);
                
                console.log("==============");
                console.log(client.usersInvitesRegister);
            }
        })
    })
    return undefined;
});

client.on('guildMemberRemove', async (member) => {
    inv = client.usersInvitesRegister.find(inv => inv.users.includes(member.user.id));
    if (inv != undefined) {
        inv.users = inv.users.filter((user) => user !== member.user.id);
        inv.uses--;
        inv.totalValidInvites--;
        inv.leaves++;

        console.log(inv);
        console.log("==============");
        console.log(client.usersInvitesRegister);
    }
    else{
        console.log(member.user.tag + "Leaves");
    }
});

/*---Close Level zone ---*/

client.login(config.token);


