var {client} = require("./commands_file")
const Discord = require("discord.js");
const db = require('megadb');

let levels_db = new db.crearDB('levels');
let invites_db = new db.crearDB('invites');

const config = require("../config.json");

var prefix = config.prefix;

client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();
    var botChannels = ['938181854077530163', '938181904153346129', '926489224541257748']

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    if(!botChannels.includes(message.channel.id))
    {
        const spanishRol = '927215843274813510'; 
        var messageReply = 'Emty response';
        if (message.member.roles.cache.find(rol => rol == spanishRol)) {
            messageReply = await (message.reply('Las peticiones al bot solo en los canales dedicados bots.'));
        }
        else{
            messageReply = await (message.reply('The queries for the bot only in dedicated channels.'));
        }
        setTimeout(() => {
            messageReply.delete();
            message.delete();
            }, 5000); 
    }
    else
    {
        switch (comand) {
            case "hola":
                message.reply("Hola mi descendencia, estas hablando con el concilio de los dioses");
                break;

            case "adios":
                message.channel.send("Adios no olvides jamas mis ofrendas!");
                break; 

            case "invites":         
            try {
                let valInvites;
                let leavInvites;
                let inv = invites_db.find(`${message.guild.id}`, thisUser => thisUser.userId === message.author.id)
                .then(thisUser => { 
                     valInvites = thisUser.validInvites;
                     leavInvites = thisUser.leaves;
                     
                const embedDatosInv = new Discord.MessageEmbed() 
                .setTitle("We the concil of gods have all the control in these server and your invitations are:")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor(0x00AE86)
                
                .addField("-------------------- \n ✅ Total valid invites -> " + valInvites, "--------------------")
                .addField("❌ leaves -> " + leavInvites, "--------------------")
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter("Message from the concil", client.user.avatarURL())
                message.channel.send({ embeds: [embedDatosInv] });
                message.author.react;
                
            
                    });
                if (inv === undefined) {
                    console.log("undefined");
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

            case "level":
                if (!levels_db.tiene(message.guild.id)) levels_db.establecer(message.guild.id, {})
                if (!levels_db.tiene(`${message.guild.id}.${message.author.id}`))  levels_db.establecer(`${message.guild.id}.${message.author.id}`, {xp: 0, nivel: 1})
    
                let { xp, nivel } = await levels_db.obtener(`${message.guild.id}.${message.author.id}`);
                let levelup = 5 * (nivel ** 2) + 50 * nivel + 100;
                let levelPorcentage = ((xp * 100)/levelup);
                let barSize = 30;
                if(levelPorcentage >= 50) barSize = 25;
                if(levelPorcentage >= 70) barSize = 22;
                
                const actualLevel = new Discord.MessageEmbed() 
                .setTitle("LEVEL VIEW")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor("GOLD")
                .setFooter("Your level is not worthy of the gods", client.user.avatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .addField("Nombre", message.author.username,  true)
                .addField("XP", `${xp}/${levelup}`, true)
                .addField("Level", `${nivel}`, true)
                .addField("Level", '```' + progressBar(levelPorcentage, 100, barSize) + '```');
                message.reply({ embeds: [actualLevel] });
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

            case "help":
                const helpEmbed = new Discord.MessageEmbed() 
                .setTitle("COMANDS")
                .setColor(0x00AE86)
                .setDescription(" !hola \n !adios \n !mejorvideo \n " +
                " !invites \n  !level")
                .setFooter("The gods only will answer these questions", client.user.avatarURL())
                .setTimestamp()
                message.reply({ embeds: [helpEmbed] });
                message.author.react
                break;
        };   
    }
});