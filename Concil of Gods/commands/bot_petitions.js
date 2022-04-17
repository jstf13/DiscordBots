var { client } = require("./commands_file");
const Discord = require("discord.js");
const db = require("megadb");

let levels_db = new db.crearDB("levels");
let invites_db = new db.crearDB("invites");
let invites_poll_db = new db.crearDB("invites_poll");

const config = require("../config.json");

var prefix = config.prefix;
var giveawayPrefix = "!g";

client.on("message", async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const comand = args.shift().toLocaleLowerCase();
  var botChannels = config.botChannels;

  if (message.content.startsWith(giveawayPrefix)) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;
  const spanishRol = config.roles.spanish;
  let realLenguageRol = message.member.roles.cache.find(
    (rol) => rol == spanishRol
  );
  let isAdmin = false;
  for (let i = 0; i < config.ignoredIds.length; i++) {
    if (message.author.id === config.ignoredIds[i].id) {
      isAdmin = true;
    }
  }

  if (!isAdmin && !botChannels.includes(message.channel.id)) {
    var messageReply = "Emty response";
    if (realLenguageRol) {
      messageReply = await message.reply(
        "Las peticiones al bot solo en los canales dedicados."
      );
    } else {
      messageReply = await message.reply(
        "The queries for the bot only in dedicated channels."
      );
    }
    setTimeout(() => {
      messageReply.delete();
      message.delete();
      return;
    }, 5000);
  } else {
    switch (comand) {
      case "hola":
        message.reply(
          "Hola mi descendencia, estas hablando con el concilio de los dioses"
        );
        break;

      case "adios":
        message.channel.send("Adios no olvides jamas mis ofrendas!");
        break;

      case "invites":
        try {
          let valInvites;
          let inv = invites_db
            .find(
              `${message.guild.id}`,
              (thisUser) => thisUser.userId === message.author.id
            )
            .then((thisUser) => {
              if (!thisUser) {
                valInvites = 0;
              } else {
                valInvites = thisUser.validInvites;
              }

              const embedDatosInv = new Discord.MessageEmbed()
                .setTitle(
                  "We the concil of gods have all the control in these server and your invitations are:"
                )
                .setAuthor(
                  message.author.username,
                  message.author.displayAvatarURL()
                )
                .setColor(0x00ae86)

                .addField(
                  "-------------------- \n ✅ Total valid invites -> " +
                    valInvites,
                  "--------------------"
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter("Message from the concil", client.user.avatarURL());
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

      case "invites-from":
        try {
          const args = message.content
            .slice(prefix.length + comand.length)
            .trim()
            .split(/ +/g);
          const domain = args.shift().toLocaleLowerCase();
          console.log(domain);

          let valInvites;
          let inv = invites_db
            .find(
              `${message.guild.id}`,
              (thisUser) => thisUser.userId === domain
            )
            .then((thisUser) => {
              console.log(thisUser);
              if (!thisUser) {
                valInvites = 0;
              } else {
                valInvites = thisUser.validInvites;
              }

              const embedDatosInv = new Discord.MessageEmbed()
                .setTitle(
                  "We the concil of gods have all the control in these server and your invitations are:"
                )
                .setAuthor(thisUser.user)
                .setColor(0x00ae86)

                .addField(
                  "-------------------- \n ✅ Total valid invites -> " +
                    valInvites,
                  "--------------------"
                )
                .setFooter("Message from the concil", client.user.avatarURL());
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

      case "poll":
        const users = [];
        const invites = [];
        invites_poll_db
          .ordenar(`${message.guild.id}`, "validInvites", "desc")
          .then(function (params) {
            params.map((user) => {
              users.push(user.valor.user);
              invites.push(user.valor.validInvites);
            });
          })
          .then(() => {

            let pollEmbed = new Discord.MessageEmbed().setTitle("Poll");
            pollEmbed.setColor("GOLD");
            pollEmbed.addField("USER","ㅤㅤ",  true);
            pollEmbed.addField("INVITES" ,"ㅤㅤ",  true);
            pollEmbed.addField(`ㅤㅤ`, "ㅤㅤ", true);

            for (let i = 0; i < users.length && i < 5; i++) {
              const element = users[i];

              pollEmbed.addField(`${users[i]}`,"ㅤㅤ", true);
              pollEmbed.addField(`ㅤ${invites[i]}`,"ㅤㅤ", true);
              pollEmbed.addField(`${i+1}º`,`ㅤㅤ`, true);
            }
            pollEmbed.setFooter("This is the poll for the NFT competence");
            
            message.channel.send({ embeds: [pollEmbed] });
          })
          .catch(console.error);
        break;

      case "mejorvideo":
        let best = new Discord.MessageEmbed()
          //.setAuthor(user.username, user.displayAvatarURL())
          .setTitle("Mejor video de youtube")
          .setDescription(
            "Ve el mejor video hijo mio [aqui](https://www.youtube.com/watch?v=aS6s2WOLqLs)"
          )
          .setColor("RANDOM");
        message.channel.send({ embeds: [best] });
        break;

      case "embedtest":
        const embedDatos = new Discord.MessageEmbed()
          .setTitle("Este es su título, puede contener 256 caracteres")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor(0x00ae86)
          .setDescription(
            "Este es el cuerpo principal del texto, puede contener 2048 caracteres."
          )
          .setFooter(
            "Pie de página, puede contener 1024 caracteres",
            client.user.avatarURL()
          )
          .setImage(message.author.displayAvatarURL())
          .setThumbnail(message.author.displayAvatarURL())
          .setTimestamp()
          .addField(
            "Este es un título de campo",
            "Este es un valor de campo puede contener 1024 caracteres."
          )
          .addField("Campo en línea", "Debajo del campo en línea", true)
          .addField(
            "Campo en línea 3",
            "Puede tener un máximo de 25 campos.",
            true
          );
        message.channel.send({ embeds: [embedDatos] });
        message.author.react;
        break;

      case "level":
        if (!levels_db.tiene(message.guild.id))
          levels_db.establecer(message.guild.id, {});
        if (!levels_db.tiene(`${message.guild.id}.${message.author.id}`))
          levels_db.establecer(`${message.guild.id}.${message.author.id}`, {
            xp: 0,
            nivel: 1,
          });

        let { xp, nivel } = await levels_db.obtener(
          `${message.guild.id}.${message.author.id}`
        );
        let levelup = 5 * nivel ** 2 + 50 * nivel + 100;
        let levelPorcentage = (xp * 100) / levelup;
        let barSize = 30;
        if (levelPorcentage >= 50) barSize = 25;
        if (levelPorcentage >= 70) barSize = 22;

        const actualLevel = new Discord.MessageEmbed()
          .setTitle("LEVEL VIEW")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor("GOLD")
          .setFooter(
            "Your level is not worthy of the gods",
            client.user.avatarURL()
          )
          .setThumbnail(message.author.displayAvatarURL())
          .setTimestamp()
          .addField("Nombre", message.author.username, true)
          .addField("XP", `${xp}/${levelup}`, true)
          .addField("Level", `${nivel}`, true)
          .addField(
            "Level",
            "```" + progressBar(levelPorcentage, 100, barSize) + "```"
          );
        message.reply({ embeds: [actualLevel] });
        break;

      case "embedwelcome-spanish":
        const user = message.mentions.users.first();
        const embedDatos2 = new Discord.MessageEmbed()
          .setTitle("REGLAS:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "Este es un importante mensaje de los dioses.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "Regla 1 - No espamear.",
            "Esto incluye el uso repetido de comandos de bot, el uso indebido de etiquetas de spoiler, bloques de código o texto especial, cambiar rápidamente de canal de voz o etiquetar a personas que no están activas en ese momento en el chat.\n\n"
          )
          .addField(
            "Regla 2 - No avisos ni ventas. ",
            " Este servidor no es un mercado: no pidas dinero o monedas de juegos, no intentes comprar / vender / regalar nada, ni pedirle a la gente que se una a tu servidor o comunidad de Discord. Esto incluye enviar mensajes a cualquier usuario del servidor.\n\n"
          )
          .addField(
            "Regla 3 - Se respetuoso",
            "Debes respetar a todos los usuarios, independientemente de tu agrado hacia ellos. Trata a los demás como quieres ser tratado.\n\n"
          )
          .addField(
            "Regla 4 - Sin discursos de odio ni trolling.",
            "El acoso, el discurso de odio, el racismo, el sexismo no están permitidos aquí. Este servidor tiene una política de tolerancia cero para dichos mensajes y es posible que se le prohíba el acceso al servidor inmediatamente sin previo aviso.\n\n"
          )
          .addField(
            " REACCIONA CON ✅ PARA SER VERIFICADO Y ACCEDER AL SERVIDOR!!",
            "_"
          )
          .addField(
            " LUEGO VE A 👅language-selector PARA ELEGIR TU IDIOMA",
            "_"
          );
        message.channel.send({ embeds: [embedDatos2] }).then((embedDatos2) => {
          embedDatos2.react("✅");
        });
        message.react.tick;
        break;

      case "embedwelcome-english":
        const embedDatos7 = new Discord.MessageEmbed()
          .setTitle("RULES:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "This is an important message from the gods.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "Rule 1 - No spamming.",
            "This includes repeated use of bot commands, misuse of spoiler tags / code blocks / special text, rapidly switching voice channels or tagging people who are not currently active in the chat.\n\n"
          )
          .addField(
            "Rule 2 - No advertising or selling.",
            "This server is not a marketplace: do not ask for money or in-game currency, try to buy / sell / giveaway anything, or ask people to join your Discord server or community. This includes messaging any user on the server.\n\n"
          )
          .addField(
            "Rule 3 - Be respectful",
            "You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.\n\n"
          )
          .addField(
            "Rule 4 - No hate speech or trolling.",
            "Harassment, hate speech, racism, sexism are not allowed here. This server has a zero-tolerance policy for such messages, and you may be banned immediately without warning or recourse.\n\n"
          )
          .addField(
            " REACT WITH ✅ TO GET VERIFIED AND HAVE ACCESS TO THE SERVER!!",
            "_"
          )
          .addField(
            " THEN GO TO 👅language-selector TO CHOOSE YOUR LANGUAGE",
            "_"
          );
        message.channel.send({ embeds: [embedDatos7] }).then((embedDatos7) => {
          embedDatos7.react("✅");
        });
        message.react.tick;
        break;

      case "see-all-collabs":
        const embedDatos20 = new Discord.MessageEmbed()
          .setTitle("REGLAS:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "Este es un importante mensaje de los dioses.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "🇬🇧 REACT WITH A ✅ TO SEE ALL THE COLLABS!!",
            "_"
          )
          .addField(
            "🇪🇸 REACCIONA CON ✅ PARA VER TODAS LAS COLABORACIONES!!",
            "_"
          )
        message.channel.send({ embeds: [embedDatos20] }).then((embedDatos20) => {
          embedDatos20.react("✅");
        });
        message.react.tick;  
      break;

      case "see-games":
        const embedDatos21 = new Discord.MessageEmbed()
          .setTitle("GAMES:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "This is an important message from the gods.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "🇬🇧 REACT WITH A ✅ TO SEE GAMES CHANNELS!!",
            "_"
          )
          .addField(
            "🇪🇸 REACCIONA CON ✅ PARA VER LOS CANALES DE JUEGOS!!",
            "_"
          )
        message.channel.send({ embeds: [embedDatos21] }).then((embedDatos21) => {
          embedDatos21.react("✅");
        });
        message.react.tick;  
      break;

      case "oficial-links":
        const embedDatos10 = new Discord.MessageEmbed()
          .setTitle("LINKS:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "These are the links provided by the gods.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField("WEBSITE", "https://sonsofgods.io/")
          .addField("TWITTER", "https://twitter.com/sonsofgodsnft")
          .addField("INSTAGRAM", "https://www.instagram.com/sonsofgodsnft/");
        message.channel
          .send({ embeds: [embedDatos10] })
          .then((embedDatos10) => {
            embedDatos10.react("✅");
          });
        message.react.tick;
        break;

      case "oficial-artist-links-es":
        const embedDatos11 = new Discord.MessageEmbed()
          .setTitle("ARTIST LINKS:")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(0x00ae86)
          .setFooter(
            "These are the links of our best artist.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "INSTAGRAM",
            "https://www.instagram.com/traficantedearte8/"
          );
        message.channel
          .send({ embeds: [embedDatos11] })
          .then((embedDatos11) => {
            embedDatos11.react("🧙");
          });
        message.react.tick;
        break;

      case "portfolio_mauri_1":
        message.channel.send({
          files: [
            "images/portfolio-1_1.jpg",
            "images/portfolio-1_2.jpg",
            "images/portfolio-1_3.jpg",
            "images/portfolio-1_4.jpg",
            "images/portfolio-1_5.jpg",
          ],
        });
        break;

      case "embedlenguage":
        const embedDatos3 = new Discord.MessageEmbed()
          .setTitle("SELECT YOUR LANGUAGE")
          .setColor(0x00ae86)
          .setFooter("This is an important message from the gods.")
          .setTimestamp()
          .addField(
            "🇪🇸 ESPAÑOL",
            "Reacciona con esta bandera para habilitar los canales en español."
          )
          .addField(
            "🇬🇧 ENGLISH",
            "React with this flag to enable English channels."
          )
          .addField(
            "❗IMPORTANT",
            "You can react with both flags and you will have access to all channels."
          )
          .addField(
            "❗IMPORTANTE",
            "Puedes reaccionar con ambas banderas y tendrás acceso a todos los canales."
          );
        message.channel.send({ embeds: [embedDatos3] }).then((embedDatos3) => {
          embedDatos3.react("🇪🇸");
          embedDatos3.react("🇬🇧");
        });
        message.react.tick;
        break;

      case "embedwlruleses":
        const embedDatos9 = new Discord.MessageEmbed()
          .setTitle("WHITELIST")
          .setColor(0x00ae86)
          .setFooter("Este es un importante mensaje de los dioses.")
          .setTimestamp()
          .addField(
            "INFORMACION",
            "La Whitelist de Sons of Gods recompensará a 2000 miembros con espacios garantizados para mintear al menos un Sons of Gods."
          )
          .addField(
            "1er Grupo",
            "Las primeras 150 personas en unirse al servidor y alcanzar el nivel 2 obtendrán instantáneamente un lugar en la Whitelist."
          )
          .addField(
            "2do Grupo",
            "350 lugares para miembros que inviten a otras 3 personas (se requiere nivel 3)."
          )
          .addField(
            "3ro Grupo",
            "450 lugares para miembros que inviten a otras 5 personas (se requiere nivel 3)."
          )
          .addField(
            "4to Grupo",
            "450 lugares para miembros que inviten a otras 7 personas (se requiere nivel 5)."
          )
          .addField(
            "5to Grupo",
            "450 lugares para miembros que inviten a otras 10 personas (se requiere nivel 5)."
          )
          .addField("Grupo VIP", "150 lugares VIP designados manualmente.");
        message.channel.send({ embeds: [embedDatos9] });
        break;

      case "embedwlrules":
        const embedDatos8 = new Discord.MessageEmbed()
          .setTitle("WHITELIST")
          .setColor(0x00ae86)
          .setFooter("This is an important message from the gods.")
          .setTimestamp()
          .addField(
            "INFORMATION",
            "The Sons of Gods Whitelist will reward 2000 early supporters with guaranteed slots for them to mint at least one Sons of Gods."
          )
          .addField(
            "1st Group",
            "The first 150 people to join the server and reach level 2 will instantly get a place in the Whitelist."
          )
          .addField(
            "2nd Group",
            "350 places for members that invite 3 other people (lvl 3 required)."
          )
          .addField(
            "3rd Group",
            "450 places for members that invite 5 other people (lvl 3 required)."
          )
          .addField(
            "4th Group",
            "450 places for members that invite 7 other people (lvl 5 required)."
          )
          .addField(
            "5th Group",
            "450 places for members that invite 10 other people (lvl 5 required)."
          )
          .addField("VIP Group", "150 VIP places designated manually.");
        message.channel.send({ embeds: [embedDatos8] });
        break;

      case "embedfaq-english":
        const embedDatos4 = new Discord.MessageEmbed()
          .setTitle("WHITELIST")
          .setColor(0x00ae86)
          .setFooter("This is an important message from the gods.")
          .setTimestamp()
          .addField(
            "What is the web?",
            "🔥🔥  [sonsofgods.io](https://sonsofgods.io/)  🔥🔥"
          )
          .addField(
            "When is the mint date?",
            "The mint date will be revealed soon."
          )
          .addField(
            "When is the white list mint?",
            "We will share the link through the discord with the people who are there."
          )
          .addField(
            "Where is the mint?",
            "The link of the mint page will be shared in our official discord and twitter when the timer hit 0: 0: 0: 0"
          )
          .addField(
            "How can I know that you are reliable?",
            "The entire team of this project is sharing who each one is in real life, in this way we intend to take responsibility for what happens with this project."
          )
          .addField(
            "How can I protect my money on the chaotic mint day?",
            "We highly recommend to make a burn wallet, it is just a wallet with the amount of the price of all NFTs that you will mint and the gas fees for all the transactions."
          )
          .addField(
            "On which blockchain the NFTs are on?",
            "These collection and the upcoming will exist in solana network."
          )
          .addField(
            "How are made the sons of gods??",
            "Our professional designer made the layers in Blender, ..., ... and our programmers mixed it with a custom candy machine, except for the gods who are made manually each of them."
          );
        message.channel.send({ embeds: [embedDatos4] }).then((embedDatos4) => {
          embedDatos4.react("🔥");
        });
        message.react.tick;
        break;

      case "lore1":
        message.channel.send({ files: ["images/lore1.png"] });
        break;

      case "lore2":
        message.channel.send({ files: ["images/lore2.png"] });
        break;

      case "embedfaq-spanish":
        const embedDatos5 = new Discord.MessageEmbed()
          .setTitle("FAQ")
          .setColor(0x00ae86)
          .setFooter("Estas son aclaraciones de los dioses.")
          .setTimestamp()
          .addField(
            "Cual es la web?",
            "🔥🔥  [sonsofgods.io](https://sonsofgods.io/)  🔥🔥"
          )
          .addField(
            "Cuando es el minteo?",
            "La fecha del minteo será revelada en la brevedad."
          )
          .addField(
            "Cuando es el minteo de la whitlist?",
            "Compartiremos el link de ese minteo por nuestro discord con la gente dentro de la whitlist."
          )
          .addField(
            "Donde es el minteo?",
            "El enlace de la página de minteo se compartirá en nuestro servidor de discord y en nuestro Twitter oficial cuando el temporizador llegue a 0: 0: 0: 0"
          )
          .addField(
            "Como puedo saber que el proyecto es fiable?",
            "Todo el equipo de este proyecto está compartiendo abiertamente su identidad, de esta manera pretendemos responsabilizarnos de todo lo que suceda con este proyecto."
          )
          .addField(
            "Como puedo protejerme de estafas el dia del minteo?",
            "Recomendamos encarecidamente hacer una burn wallet, esto es solamente una billetera con el monto del precio de todos los NFT que comprara en el minteo y las tarifas de gas fee para todas las transacciones."
          )
          .addField(
            "En que blockchain existiran los NFTs de sons of gods?",
            "Esta colección y las próximas existirán en la red de solana."
          )
          .addField(
            "Como son hechos los NFTs de sons of gods?",
            "Nuestro diseñador profesional hizo las distintas capas en Blender, ..., ... y nuestros programadores lo mezclaron con una version de Candy Machine, a excepción de los dioses que se hacen manualmente cada uno de ellos."
          );
        message.channel.send({ embeds: [embedDatos5] }).then((embedDatos5) => {
          embedDatos5.react("🔥");
        });
        message.react.tick;
        break;

      case "how-to-buy":
        const embedDatos13 = new Discord.MessageEmbed()
          .setTitle("🔥  HOW TO MINT  🔥")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor("DARK_GOLD")
          .setFooter(
            "This is an important message from the gods.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "1. Buy SOL from an exchange",
            "Binance, FTX, Coinbase, Kraken, Huobi, Bitfinex, etc. 💳 (preferably use a known exchange like the ones mentioned)"
          )
          .addField(
            "2. Install a SOL wallet ☀️ (We recommend Phantom Wallet)",
            "https://phantom.app/"
          )
          .addField(
            "3. Fund your wallet",
            "Transfer SOL from exchange to the wallet. Fees are low on Solana but are not zero. Add 0.02 SOL for each NFT you plan on buying."
          )
          .addField(
            "🚫 BEWARE OF SCAMS",
            "Ignore or block all DMs. Scammers will send you DMs trying to get you to mint on their fake sites, don't do that. \n" +
              "If you see something like this report us in <#936805131423473665> at the end of the server"
          )
          .addField(
            "Links",
            "The official links will only be shared in <#936003409235030048> and <#936003808700551188> channels"
          );
        message.channel
          .send({ embeds: [embedDatos13] })
          .then((embedDatos13) => {
            embedDatos13.react("🚀");
          });
        message.react.tick;
        break;

      case "progressbar":
        message.channel.send(progressBar(99, 100, 10));
        break;

      case "como-comprar":
        const embedDatos14 = new Discord.MessageEmbed()
          .setTitle("🔥  COMO MINTEAR  🔥")
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor("DARK_GOLD")
          .setFooter(
            "Este es un mensaje sumamente importante de los dioses.",
            client.user.avatarURL()
          )
          .setTimestamp()
          .addField(
            "1. Compra solana en algun exchange",
            "Binance, FTX, Coinbase, Kraken, Huobi, Bitfinex, etc. 💳 (Preferentemente compra en un exchange conocido como los mencionados)"
          )
          .addField(
            "2. Instala una cartera para solana ☀️ (Recomendamos Phantom Wallet)",
            "https://phantom.app/"
          )
          .addField(
            "3. Carga tu cartera",
            "Transfiera SOL del exchange a la billetera. Los fees son bajos en Solana pero no son cero. Agregue 0.02 SOL por cada NFT que planee comprar."
          )
          .addField(
            "🚫 CUIDADO CON LOS SCAMMERS",
            "Ignora o bloquea todos los DM. Los estafadores te enviarán mensajes directos tratando de que hagas mint en sus sitios falsos, no hagas eso. \n" +
              "Si ve algo como esto, infórmanos en <#936805131423473665> al final del servidor"
          )
          .addField(
            "Links",
            "Los links oficiales solo se comprartiran en <#936003409235030048> y <#936003808700551188>"
          );
        message.channel
          .send({ embeds: [embedDatos14] })
          .then((embedDatos14) => {
            embedDatos14.react("🚀");
          });
        message.react.tick;
        break;

      case "progressbar":
        message.channel.send(progressBar(99, 100, 10));
        break;

      case "help":
        const helpEmbed = new Discord.MessageEmbed()
          .setTitle("COMANDS")
          .setColor(0x00ae86)
          .setDescription(" !hola \n !adios \n " + " !invites \n  !level")
          .setFooter(
            "The gods only will answer these questions",
            client.user.avatarURL()
          )
          .setTimestamp();
        message.reply({ embeds: [helpEmbed] });
        message.author.react;
        break;

      default:
        if (message.member.roles.cache.find((rol) => rol == spanishRol)) {
          messageReply = await message.reply(
            "Esta no es una peticion valida intente con ``!help``"
          );
        } else {
          messageReply = await message.reply(
            "This is not a valid petition try with ``!help``"
          );
        }
        setTimeout(() => {
          messageReply.delete();
          message.delete();
          return;
        }, 5000);
        break;
    }
  }
});
