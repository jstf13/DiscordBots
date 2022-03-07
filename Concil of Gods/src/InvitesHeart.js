var { client } = require("../commands/commands_file.js");
const config = require("../config.json");
const db = require("megadb");

let modernarray = require("modernarray");
let invites_db = new db.crearDB("invites");
let level_db = new db.crearDB("levels");
let myWelcomeChannel = "927999666358980658";

function promoteToWL(invite) {
  level_db
    .find(
      `${invite.guild.id}`,
      (thisUser) => thisUser.userId === invite.inviter.id
    )
    .then((thisUser) => {
      if (thisUser) {
        console.log("thisUser level " + thisUser.nivel);
        if (thisUser.nivel >= config.levelToEnterWL) {
          let WLRoleId = "937127841592651786";
          let WLRole = invite.guild.roles.cache.get(WLRoleId);

          userToAddRole = invite.guild.members.cache.find(
            (thisMember) => thisMember.id === invite.inviter.id
          );
          userToAddRole.roles.add(WLRole);
        }
      }
    });
}

client.on("inviteCreate", (invite) => {
  if (!isAIgnoredId(member)) {
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
  }
});

client.on("inviteDelete", (invite) => {
  if (!isAIgnoredId(member)) {
    if (
      invites_db.tiene(
        `${invite.guild.id}.${invite.channel.guild.ownerId}.codes`
      )
    ) {
      invites_db.extract(
        `${invite.guild.id}.${invite.channel.guild.ownerId}.codes`,
        invite.code
      );
      invites_db.eliminar(
        `${invite.guild.id}.${invite.channel.guild.ownerId}.complete_codes.${invite.code}`
      );
    }

    invite.guild.invites.fetch().then((guildInvites) => {
      //get all guild invites

      let actualInvites = invites_db.obtener(
        `${invite.guild.id}.${invite.channel.guild.ownerId}.codes`
      );

      actualInvites.then(function (result) {
        result.forEach((element) => {
          let isInside = false;

          guildInvites.each((guiInvite) => {
            if (guiInvite.code == element) {
              isInside = true;
            }
          });

          if (isInside == false) {
            invites_db.eliminar(
              `${invite.guild.id}.${invite.channel.guild.ownerId}.complete_codes.${element}`
            );
            invites_db.extract(
              `${invite.guild.id}.${invite.channel.guild.ownerId}.codes`,
              element
            );
            inviteToRemove = undefined;
          }
        });
      });
    });
  }
});

client.on("guildMemberAdd", async (member) => {
  let isInTheList = false;

  const channel = member.guild.channels.cache.find(
    (channel) => channel.id === myWelcomeChannel
  );

  member.guild.invites.fetch().then((guildInvites) => {
    //get all guild invites

    guildInvites.each((invite) => {
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

      if (!isAIgnoredId(member)) {
        guild = client.guilds.cache.get("926465898582253618");

        guild.invites.fetch().then((inv) => {
          inv.forEach((invi) => {
            uses = invites_db.obtener(
              `${invi.guild.id}.${invi.inviter.id}.complete_codes.${invi.code}`
            );

            uses
              .then(function (result) {
                return new Promise((resolve) => {
                  if (result.uses + 1 == invi.uses) {
                    resolve(invi);
                  }
                  if (result.uses + 1 < invi.uses) {
                    invites_db.establecer(
                      `${invi.guild.id}.${invi.inviter.id}.complete_codes.${invi.code}.uses`,
                      invi.uses - 1
                    );
                    resolve(invi);
                  }
                });
              })
              .then((data) => newUser(member, data, channel));
          });
        });
      }
    });
  });
  return undefined;
});

async function newUser(member, invite, channel) {
  channel.send(
    `${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter.tag}.`
  );
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

        invites_db
          .find(
            `${invite.guild.id}`,
            (thisUser) => thisUser.userId === invite.inviter.id
          )
          .then((thisUser) => {
            if (thisUser.validInvites >= config.invitesToEnterWL) {
              promoteToWL(invite);
            }
          });
      }
    });
}

client.on("guildMemberRemove", async (member) => {
  if (!isAIgnoredId(member)) {
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
  }
});

function isAIgnoredId(member) {
  for (let i = 0; i < config.ignoredIds.length; i++) {
    if (config.ignoredIds.includes(member.user.id)) {
      console.log("is ignored");
      return true;
    }
  }
  console.log("not is ignored");
  return false;
}

/*---Close Level zone ---*/
