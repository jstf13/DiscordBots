var { client } = require("../commands/commands_file");
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
  if (!invites_db.tiene(invite.guild.id))
    invites_db.establecer(invite.guild.id, {});
  if (!invites_db.tiene(`${invite.guild.id}.${invite.inviterId}`)) {
    invites_db.establecer(`${invite.guild.id}.${invite.inviterId}`, {
      user: invite.inviter.username,
      userId: invite.inviter.id,
      gests: [],
      validInvites: 0,
      codes: [invite.code],
    });
  } else {
    invites_db.push(
      `${invite.guild.id}.${invite.inviter.id}.codes`,
      invite.code
    );
  }
});

client.on("inviteDelete", (invite) => {
  invites_db.extract(
    `${invite.guild.id}.${invite.channel.guild.ownerId}.codes`,
    invite.code
  );
});

client.on("guildMemberAdd", async (member) => {
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
        });
      }

      codes = invites_db.obtener(
        `${invite.guild.id}.${invite.inviter.id}.codes`
      );

      let isInTheList = false;
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
        }
      });

      if (client.invites && invite.uses != client.invites[invite.code]) {
        //if it doesn't match what we stored
        channel.send(
          `${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter.tag}.`
        );

        invites_db.push(
          `${invite.guild.id}.${invite.inviter.id}.gests`,
          member.user.id
        );
        invites_db.sumar(
          `${invite.guild.id}.${invite.inviter.id}.validInvites`,
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
  });
  return undefined;
});

client.on("guildMemberRemove", async (member) => {
  console.log("Leaves");
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
  //   console.log(member.user.tag + "Leaves");
});

/*---Close Level zone ---*/
