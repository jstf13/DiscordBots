const Discord = require("discord.js");
const config = require("../config.json");

require("../commands/commands_file");
const db = require("megadb");
const { client } = require("../commands/commands_file");
let levels_db = new db.crearDB("levels");
let invites_db = new db.crearDB("invites");

function promoteToWL(message) {
  let userToPromote;
  invites_db
    .find(`${message.guild.id}`, (thisUser) => {
      if (thisUser.userId == message.author.id) {
        userToPromote = thisUser;
      }
    })
    .then((thisUser) => {
      if (userToPromote) {
        if (userToPromote.validInvites >= config.invitesToEnterWL) {
          let WLRoleId = "937127841592651786";
          let WLRole = message.guild.roles.cache.get(WLRoleId);

          userToAddRole = message.guild.members.cache.find(
            (thisMember) => thisMember.id === message.author.id
          );
          userToAddRole.roles.add(WLRole);
          console.log("cambio maximo");
        }
      }
    });
}
client.on("message", async (message) => {
  let randomxp = 0;

  for (let i = 0; i < config.ignoredIds.length; i++) {
    if (message.author.id === config.ignoredIds[i].id) return;
  }
  if (message.content.startsWith(config.prefix)) return;

  if (!levels_db.tiene(message.guild.id))
    levels_db.establecer(message.guild.id, {});
  if (!levels_db.tiene(`${message.guild.id}.${message.author.id}`))
    levels_db.establecer(`${message.guild.id}.${message.author.id}`, {
      userId: message.author.id,
      xp: 0,
      nivel: 1,
    });

  let { xp, nivel } = await levels_db.obtener(
    `${message.guild.id}.${message.author.id}`
  );
  let levelup = 5 * nivel ** 2 + 50 * nivel + 100;

  if (message.content.length <= 6) {
    randomxp = 5;
  } else {
    randomxp = Math.floor(Math.random() * 30) + 1;
  }

  if (xp + randomxp >= levelup) {
    let levelChannel = "938964691244441611";
    const channelToSend = message.member.guild.channels.cache.find(
      (channel) => channel.id === levelChannel
    );

    levels_db.establecer(`${message.guild.id}.${message.author.id}`, {
      serId: message.author.id,
      xp: 0,
      nivel: parseInt(nivel + 1),
    });

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(
        `${message.member} acabas de subir de nivel: ${parseInt(nivel + 1)}!`
      );
    channelToSend.send({ embeds: [embed] });

    getLevelOfWL(message).then((levelOfWL) => {
      if (nivel + 1 >= levelOfWL) {
        promoteToWL(message);
      }
    });
  } else {
    levels_db.sumar(`${message.guild.id}.${message.author.id}.xp`, randomxp);
    //console.log(`${message.author.tag}, ganaste: ${randomxp}`);
    return;
  }
});

async function getLevelOfWL(message) {
    return new Promise((resolve) => {
      let idMembers = message.guild.roles.cache
        .get("937127841592651786")
        .members.map((m) => m.user.tag);
      console.log(idMembers);
      let amounOfWlPeople = idMembers.length;
      if (amounOfWlPeople <= 150) {
        resolve(config.levels.level_1.level);
      }
      if (amounOfWlPeople <= 500) {
        resolve(config.levels.level_2.level);
      }
      if (amounOfWlPeople <= 950) {
        resolve(config.levels.level_3.level);
      }
      if (amounOfWlPeople <= 1400) {
        resolve(config.levels.level_4.level);
      }
      if (amounOfWlPeople <= 1750) {
        resolve(config.levels.level_5.level);
      }
    });
  }
  