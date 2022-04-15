const Discord = require("discord.js");
var { client } = require("../commands/commands_file.js");
const config = require("../config.json");
const db = require("megadb");

let modernarray = require("modernarray");
let invites_db = new db.crearDB("invites");
let invites_poll_db = new db.crearDB("invites_poll");
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
  //addEnglishRoleToAllHowDontChooseOne();
  addLostInvites();
  // addItemsForInvites_db(100);
  cleanBddOnceADay();
});

function cleanBddOnceADay() {
  var now = new Date();
  var millisTill10 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 33, 0, 0) -
    now;
  if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
  }
  setTimeout(function () {
    removeUnusedInvites();
    addNewPeopleTheTeamAddToWL();
  }, millisTill10);
}

function promoteToWL(invite) {
  let userToPromote;
  let WLRole = invite.guild.roles.cache.get(WLRoleId);

  userToAddRole = invite.guild.members.cache.find(
    (thisMember) => thisMember.id === invite.inviter.id
  );

  getNeededLevelOfWL().then((neededLevelOfWL) => {
    if (neededLevelOfWL == 2) {
      userToAddRole.roles.add(WLRole);
      addUserToWLDataBase(userToAddRole).then((wasAdded) => {
        if (wasAdded) {
          promotedToWLMessage(invite);
        }
      });
    }
    level_db
      .find(`${invite.guild.id}`, (thisUser) => {
        if (thisUser.userId == invite.inviter.id) {
          userToPromote = thisUser;
        }
      })
      .then((thisUser) => {
        if (userToPromote) {
          if (neededLevelOfWL == 2 || userToPromote.nivel >= neededLevelOfWL) {
            userToAddRole.roles.add(WLRole);
            addUserToWLDataBase(userToAddRole).then((wasAdded) => {
              if (wasAdded) {
                promotedToWLMessage(invite);
              }
            });
          }
        }
      });
  });
}

client.on("inviteCreate", (invite) => {
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
  guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);

  let commonRole = guild.roles.cache.get(config.roles.sonOfGod);
  setTimeout(function () {
    member.roles.add(commonRole);
  }, 300000);

  const channel = member.guild.channels.cache.find(
    (channel) => channel.id === config.channelsIds.welcomeChannel
  );
  newUsedInvites(member, channel).then((dataArray) => {
    dataArray.forEach((dataArray) => {
      addInviteToPoll(dataArray.inv, dataArray.isFromGods);
      if (dataArray.inv != undefined) {
        newUser(member, dataArray.inv);
      }
    });
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
    guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);

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

            mayor_resolve([{ inv: invi, isFromGods: isFromGods }]);
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

            mayor_resolve([{ inv: invi, isFromGods: isFromGods }]);
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
              getNeededIvnitesOfWL().then((invitesNeededOfWL) => {
                if (userToPromoteWL.validInvites >= invitesNeededOfWL) {
                  promoteToWL(invite);
                }
              });
            }
          });
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
      `<@${invite.inviter.id}> Congratulations, you have just received a place on the White List!`
    );
  channelToSend.send({ embeds: [embed] });
}

function addUserToWLDataBase(userToAdd) {
  return new Promise((resolve) => {
    let wasAdded = false;
    if (!wl_db.tiene(`${userToAdd.guild.id}.${userToAdd.id}`)) {
      wl_db.establecer(`${userToAdd.guild.id}.${userToAdd.id}`, {
        name: userToAdd.user.username,
        userId: userToAdd.id,
      });
      wl_db.sumar(`${userToAdd.guild.id}.wl_members`, 1);
      wasAdded = true;
    }
    resolve(wasAdded);
  });
}

client.on("guildMemberRemove", async (member) => {
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

            // for polls

            removeInivteFromPoll(member, thisUser);

            // end polls
          }
        }
        invites_db.establecer(
          `${member.guild.id}.${thisUser.userId}`,
          thisUser
        );
      }
    });
});

async function getNeededLevelOfWL() {
  return new Promise((resolve) => {
    wl_db.obtener(`${myGuildId}.wl_members`).then(function (amounOfWlPeople) {
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
  });
}

async function getNeededIvnitesOfWL() {
  return new Promise((resolve) => {
    wl_db.obtener(`${myGuildId}.wl_members`).then(function (amounOfWlPeople) {
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
  });
}

/*---Close Level zone ---*/

function addNewPeopleTheTeamAddToWL() {
  console.log("================================================");
  console.log("Adding to wl db the people who the team added today");
  console.log("================================================");
  client.guilds.fetch(`${myGuildId}`).then((g) => {
    const WLUsers = g.roles.cache
      .get(config.roles.wlRole)
      .members.map((m) => m.user);

    wl_db.establecer(`${myGuildId}.wl_members`, WLUsers.length);

    for (let i = 0; i < WLUsers.length; i++) {
      let courrentUser = WLUsers[i];
      wl_db
        .find(`${myGuildId}`, (thisUser) => thisUser.userId == courrentUser.id)
        .then((thisUser) => {
          if (!thisUser) {
            wl_db.establecer(`${myGuildId}.${courrentUser.id}`, {
              name: `${courrentUser.tag}`,
              userId: `${courrentUser.id}`,
            });
          }
        });
    }
  });
  console.log("================================================");
  console.log("All new people added to wl db");
  console.log("================================================");
}

// Give a role to all the people who dont select the role

function addEnglishRoleToAllHowDontChooseOne() {
  guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);
  const role = guild.roles.fetch(config.roles.sonOfGod);
  allWithSonsOfGodRole = [];
  allWithSpanishRole = [];
  allWithEnglishRole = [];

  guild.members.cache
    .filter((member) =>
      member.roles.cache.find((role) => role.id == config.roles.sonOfGod)
    )
    .forEach((m) => {
      allWithSonsOfGodRole.push(m);
    });

  guild.members.cache
    .filter((member) =>
      member.roles.cache.find((role) => role.id == config.roles.spanish)
    )
    .forEach((m) => {
      allWithSpanishRole.push(m);
    });

  guild.members.cache
    .filter((member) =>
      member.roles.cache.find((role) => role.id == config.roles.english)
    )
    .forEach((m) => {
      allWithEnglishRole.push(m);
    });

  console.log(allWithSonsOfGodRole.length);
  console.log(allWithSpanishRole.length);
  console.log(allWithEnglishRole.length);

  getOnlySonsOfGodsRole(
    allWithSonsOfGodRole,
    allWithSpanishRole,
    allWithEnglishRole
  ).then((result) => {
    let englishRole = guild.roles.cache.get(config.roles.english);
    let spanishRole = guild.roles.cache.get(config.roles.spanish);

    guild.members.cache.filter((member) => {
    }).forEach((member) => {
      for (let i = 0; i < 2; i++) {
        console.log(member);
        
      }
    });

    // for (let i = 0; i < result.length; i++) {
    //   result[i].roles.add(englishRole);
    // }
  });
}

function getOnlySonsOfGodsRole(
  allWithSonsOfGodRole,
  allWithSpanishRole,
  allWithEnglishRole
) {
  return new Promise((resolve) => {
    for (let i = 0; i < allWithSonsOfGodRole.length; i++) {
      if (
        allWithSpanishRole.includes(allWithSonsOfGodRole[i]) ||
        allWithEnglishRole.includes(allWithSonsOfGodRole[i])
      ) {
        allWithSonsOfGodRole.splice(i, 1);
      }
    }
    resolve(allWithSonsOfGodRole);
  });
}

// CLOSE Give a role to all the people who dont select the role

// POLL ZONE //

function addInviteToPoll(invite, isFromGods) {
  if (!isFromGods) {
    if (!invites_poll_db.tiene(`${invite.guild.id}.${invite.inviter.id}`)) {
      invites_poll_db.establecer(`${invite.guild.id}.${invite.inviter.id}`, {
        user: invite.inviter.username,
        userId: invite.inviter.id,
        validInvites: 1,
      });
    } else {
      invites_poll_db.sumar(
        `${invite.guild.id}.${invite.inviter.id}.validInvites`,
        1
      );
    }
  }
}

function removeInivteFromPoll(member, thisUser) {
  console.log(
    `${member.user.username} -> ${thisUser.userId} has left the server`
  );
  if (invites_poll_db.tiene(`${member.guild.id}.${thisUser.userId}`)) {
    invites_poll_db.sumar(
      `${member.guild.id}.${thisUser.userId}.validInvites`,
      -1
    );
  }
}

// END POLL ZONE //

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
