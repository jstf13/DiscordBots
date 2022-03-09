const Discord = require("discord.js");
var { client } = require("../commands/commands_file.js");
const config = require("../config.json");
const db = require("megadb");

let modernarray = require("modernarray");
let invites_db = new db.crearDB("invites");
let level_db = new db.crearDB("levels");
let wl_db = new db.crearDB("wl_People");
let WLRoleId = config.roles.wlRole;
let levelChannel = config.channelsIds.levelChannel;
let myGuildId = config.serverIds.sonsOfGodsGuildId;

client.on("ready", () => {
  console.log("Pairing invites from discord to our BDD");
  console.log("================================================");
  if (!invites_db.tiene(myGuildId)) invites_db.establecer(myGuildId, {});
  if (!wl_db.tiene(myGuildId))
    wl_db.establecer(myGuildId, {
      wl_members: 0,
    });
  addLostInvites();
  removeUnusedInvites();
  // addItemsForInvites_db(1500);
});

function cleanBddOnceADay(params) {
  var now = new Date();
  var millisTill10 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 30, 0, 0) -
    now;
  if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
  }
  setTimeout(function () {
    console.log("It's 10am!");
  }, millisTill10);
}

function promoteToWL(invite) {
  let userToPromote;
  level_db
    .find(`${invite.guild.id}`, (thisUser) => {
      if (thisUser.userId == invite.inviter.id) {
        userToPromote = thisUser;
      }
    })
    .then((thisUser) => {
      if (userToPromote) {
        if (userToPromote.nivel >= config.levelToEnterWL) {
          let WLRole = invite.guild.roles.cache.get(WLRoleId);

          userToAddRole = invite.guild.members.cache.find(
            (thisMember) => thisMember.id === invite.inviter.id
          );
          userToAddRole.roles.add(WLRole);
          promotedToWLMessage(invite);
          addUserToWLDataBase(userToAddRole);
        }
      }
    });
}

client.on("inviteCreate", (invite) => {
  // isAIgnoredId(invite).then((result) => {
  // if (result == false) {
  if (!invites_db.tiene(invite.guild.id))
    invites_db.establecer(invite.guild.id, {});
  if (!invites_db.tiene(`${invite.guild.id}.${invite.inviterId}`)) {
    invites_db.establecer(`${invite.guild.id}.${invite.inviterId}`, {
      user: invite.inviter.username,
      userId: invite.inviter.id,
      gests: [],
      validInvites: 0,
      codes: [invite.code],
      complete_codes: {
        [invite.code]: {
          uses: 0,
        },
      },
    });
  } else {
    invites_db.push(
      `${invite.guild.id}.${invite.inviter.id}.codes`,
      invite.code
    );
    invites_db.establecer(
      `${invite.guild.id}.${invite.inviter.id}.complete_codes.${invite.code}.uses`,
      0
    );
  }
  //    }
  //  });
});

function removeUnusedInvites() {
  console.log("================================================");
  console.log("Deleting expired invitations ");
  console.log("================================================");
  client.guilds.fetch(`${myGuildId}`).then((g) => {
    invites_db.find(`${myGuildId}`, (user) => {
      let invitesCodes = user.codes;
      for (let i = invitesCodes.length - 1; i >= 0; i--) {
        let exists = false;
        g.invites.fetch().then((thisUserGuildInvites) => {
          thisUserGuildInvites.each((guiInvite) => {
            if (invitesCodes[i] == guiInvite.code) {
              exists = true;
            }
          });

          if (!exists) {
            let code = invitesCodes[i];
            invites_db.extract(`${myGuildId}.${user.userId}.codes`, code);
            invites_db.eliminar(
              `${myGuildId}.${user.userId}.complete_codes.${code}`
            );
          }
        });
      }
    });
  });

  console.log("================================================");
  console.log("Expired invitations deleted");
  console.log("================================================");
}

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    (channel) => channel.id === config.channelsIds.welcomeChannel
  );
  newUsedInvites(member, channel).then((usedinvite, differenscesInInvi) => {
    if (usedinvite != undefined) {
      newUser(member, usedinvite, differenscesInInvi, channel);
    }
  });
  return undefined;
});

function addLostInvites() {
  return new Promise((resolve) => {
    client.guilds.fetch(`${myGuildId}`).then((g) => {
      g.invites.fetch().then((guildInvites) => {
        guildInvites.each((invite) => {
          let isInTheList = false;
          //basically a for loop over the invites:
          if (!invites_db.tiene(`${invite.guild.id}.${invite.inviterId}`)) {
            invites_db.establecer(`${invite.guild.id}.${invite.inviterId}`, {
              user: invite.inviter.username,
              userId: invite.inviter.id,
              gests: [],
              validInvites: 0,
              codes: [invite.code],
              complete_codes: {
                [invite.code]: {
                  uses: 0,
                },
              },
            });
          }

          codes = invites_db.obtener(
            `${invite.guild.id}.${invite.inviter.id}.codes`
          );

          codes.then(function (result) {
            res = result;
            for (let i = 0; i < res.length && isInTheList == false; i++) {
              if (res[i] == invite.code) isInTheList = true;
            }
            if (!isInTheList) {
              invites_db.push(
                `${invite.guild.id}.${invite.inviter.id}.codes`,
                invite.code
              );
              invites_db.establecer(
                `${invite.guild.id}.${invite.inviter.id}.complete_codes.${invite.code}.uses`,
                invite.uses
              );
            }
          });
        });
      });
    });
    resolve(true);
  });
}

function newUsedInvites(member, channel) {
  return new Promise((mayor_resolve) => {
    guild = client.guilds.cache.get("926465898582253618");

    guild.invites.fetch().then((inv) => {
      inv.forEach((invi) => {
        uses = invites_db.obtener(
          `${invi.guild.id}.${invi.inviter.id}.complete_codes.${invi.code}`
        );
        let isFromGods = false;
        uses.then(function (result) {
          if (result.uses + 1 == invi.uses) {
            for (let i = 0; i < config.ignoredIds.length; i++) {
              if (invi.inviter.id === config.ignoredIds[i].id) {
                channel.send(
                  `${member.user.tag} joined using master code ${invi.code} from THE GODS.`
                );
                isFromGods = true;
              }
            }
            if (isFromGods == false) {
              channel.send(
                `${member.user.tag} joined using master code ${invi.code} from ${invi.inviter.tag}.`
              );
            }
            mayor_resolve(invi);
          }
          if (result.uses + 1 < invi.uses) {
            for (let i = 0; i < config.ignoredIds.length; i++) {
              if (invi.inviter.id === config.ignoredIds[i].id) {
                channel.send(
                  `${member.user.tag} joined using master code ${invi.code} from THE GODS.`
                );
                isFromGods = true;
              }
            }
            if (isFromGods == false) {
              channel.send(
                `${member.user.tag} joined using master code ${invi.code} from ${invi.inviter.tag}.`
              );
            }
            invites_db.establecer(
              `${invi.guild.id}.${invi.inviter.id}.complete_codes.${invi.code}.uses`,
              invi.uses - 1
            );
            mayor_resolve(invi);
          }
        });
      });
    });
  });
}

async function newUser(member, invite) {
  let guests = invites_db.obtener(
    `${invite.guild.id}.${invite.inviter.id}.gests`
  );
  guests
    .then(function (result) {
      return new Promise((resolve) => {
        resolve(result.includes(member.user.id));
      });
    })
    .then((includesUserInGests) => {
      if (includesUserInGests == false) {
        invites_db.push(
          `${invite.guild.id}.${invite.inviter.id}.gests`,
          member.user.id
        );
        invites_db.sumar(
          `${invite.guild.id}.${invite.inviter.id}.validInvites`,
          1
        );
        invites_db.sumar(
          `${invite.guild.id}.${invite.inviter.id}.complete_codes.${invite.code}.uses`,
          1
        );

        let userToPromoteWL;
        invites_db
          .find(`${invite.guild.id}`, (thisUser) => {
            if (thisUser.userId === invite.inviter.id) {
              userToPromoteWL = thisUser;
            }
          })
          .then((thisUser) => {
            if (userToPromoteWL != undefined) {
              getLevelOfWL(member).then((levelOfWL) => {
                if (userToPromoteWL.validInvites >= levelOfWL) {
                  promoteToWL(invite);
                }
              });
            }
          });
      }
    });
}

async function getLevelOfWL(message) {
  return new Promise((resolve) => {
    let idMembers = message.guild.roles.cache
      .get("937127841592651786")
      .members.map((m) => m.user.tag);
    console.log(idMembers);
    let amounOfWlPeople = idMembers.length;
    if (amounOfWlPeople <= 150) {
      resolve(config.levels.level_1.invites);
    }
    if (amounOfWlPeople <= 500) {
      resolve(config.levels.level_2.invites);
    }
    if (amounOfWlPeople <= 950) {
      resolve(config.levels.level_3.invites);
    }
    if (amounOfWlPeople <= 1400) {
      resolve(config.levels.level_4.invites);
    }
    if (amounOfWlPeople <= 1750) {
      resolve(config.levels.level_5.invites);
    }
  });
}

function promotedToWLMessage(invite) {
  const channelToSend = invite.guild.channels.cache.find(
    (channel) => channel.id === levelChannel
  );
  const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setDescription(
      `<@${invite.inviter.id}> congratulations you just earned a place in the White List!`
    );
  channelToSend.send({ embeds: [embed] });
}

function addUserToWLDataBase(userToAdd) {
  if (!wl_db.tiene(userToAdd.guild.id)) {
    wl_db.establecer(userToAdd.guild.id, {
      wl_members: 0,
    });
  }
  if (!wl_db.tiene(`${userToAdd.guild.id}.${userToAdd.id}`)) {
    console.log("entro a agregar a wl");
    wl_db.establecer(`${userToAdd.guild.id}.${userToAdd.id}`, {
      name: userToAdd.user.username,
      userId: userToAdd.id,
    });
  }
}

client.on("guildMemberRemove", async (member) => {
  //  if (!isAIgnoredId(member)) {
  userWhoInvite = 0;
  invites_db
    .find(`${member.guild.id}`, (thisUser) =>
      thisUser.gests.includes(member.id)
    )
    .then((thisUser) => {
      if (thisUser) {
        for (let i = 0; i < thisUser.gests.length; i++) {
          if (thisUser.gests[i] === member.id) {
            modernarray.popByIndex(thisUser.gests, i);
            invites_db.sumar(
              `${member.guild.id}.${thisUser.userId}.validInvites`,
              -1
            );
          }
        }
        invites_db.establecer(
          `${member.guild.id}.${thisUser.userId}`,
          thisUser
        );
      }
    });
  // }
});

function isAIgnoredId(invite) {
  return new Promise((resolve) => {
    let ignored_ids = config.ignoredIds;
    for (let i = 0; i < ignored_ids.length; i++) {
      if (ignored_ids[i].id == invite.inviter.id) {
        console.log("is ignored");
        resolve(true);
      }
    }
    console.log("not is ignored");
    resolve(false);
  });
}

function getInviteByCode(invite) {
  return new Promise((resolve) => {
    invite.guild.invites.fetch().then((guildInvites) => {
      guildInvites.each((guiInvite) => {
        console.log(guiInvite.code + " comparo con: " + invite);
        if (guiInvite.code == invite) {
           resolve(guiInvite.inviter.id);
          return;
        }
      });
    });
  });
}

/*---Close Level zone ---*/

// TEST FUNCTIONS //

function addItemsForInvites_db(amount) {
  for (let i = 0; i <= amount; i++) {
    invites_db.establecer(`${myGuildId}.${i}`, {
      user: "jagger",
      userId: i,
      gests: [],
      validInvites: 0,
      codes: ["s63JQTfu", "s6gJQTfu"],
      complete_codes: {
        ["s63JQTfu"]: {
          uses: 0,
        },
        ["s6gJQTfu"]: {
          uses: 0,
        },
      },
    });
  }
}
