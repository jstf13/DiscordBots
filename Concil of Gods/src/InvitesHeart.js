var {client} = require("../commands/commands_file");
const config = require('../config.json');
const db = require('megadb');
const { WelcomeChannel } = require("discord.js");
let invites_db = new db.crearDB('invites');
let level_db = new db.crearDB('levels');

// Initialize the invite cache
const invites = new Map();
let serverId = '926465898582253618';
let TestServerId = '919766844385136650';
let botMessageChannel = "new-people";
let myWelcomeChannel = '927999666358980658';
let modernarray = require('modernarray');

// A pretty useful method to create a delay without blocking the whole script.
const wait = require("timers/promises").setTimeout;

function promoteToWL(invite) {
    level_db.find(`${invite.guild.id}`, thisUser => thisUser.userId === invite.inviter.id)
    .then(thisUser => {
        console.log("thisUser level " + thisUser.nivel);
        if(thisUser.nivel >= config.levelToEnterWL){ 
            let WLRoleId = "937127841592651786";
            let WLRole = invite.guild.roles.cache.get(WLRoleId);

            console.log("role " + WLRole.name);

            userToAddRole = invite.guild.members.cache.find(thisMember => thisMember.id === invite.inviter.id);

            console.log("user " + userToAddRole);

            userToAddRole.roles.add(WLRole);
        }
    })
}

function haveTheLevel(invite) {
    console.log("guild: " + invite.guild.id);
    console.log("inviter: " + invite.inviter.id);

    level_db.find(`${invite.guild.id}`, thisUser => thisUser.userId === invite.inviter.id)
    .then(thisUser => {
        console.log("thisUser level " + thisUser.nivel);
        if(thisUser.nivel >= config.levelToEnterWL){
            console.log("thisUser have the level " + thisUser.userId);
            return thisUser;
            
        }
    })
}

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

client.on("inviteCreate", invite => {
    if (!invites_db.tiene(invite.guild.id)) invites_db.establecer(invite.guild.id, {})
    if (!invites_db.tiene(`${invite.guild.id}.${invite.inviterId}`)) {
        invites_db.establecer(`${invite.guild.id}.${invite.inviterId}`,
         {user: invite.inviter.username, userId: invite.inviter.id, gests: [], validInvites: 0, codes: [invite.code]}) 
    }
    else{
        invites_db.push(`${invite.guild.id}.${invite.inviter.id}.codes`, invite.code);
    }
});

client.on("inviteDelete", (invite) => {
    invites_db.extract(`${invite.guild.id}.${invite.channel.guild.ownerId}.codes`, invite.code);
});


client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.find(channel => channel.id === myWelcomeChannel);

    member.guild.invites.fetch().then(guildInvites => { //get all guild invites
        guildInvites.each(invite => { //basically a for loop over the invites:
            if(invite.uses != client.invites[invite.code]) { //if it doesn't match what we stored
                channel.send(`${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter.tag}.`)
                
                invites_db.push(`${invite.guild.id}.${invite.inviter.id}.gests`, member.user.id);
                invites_db.sumar(`${invite.guild.id}.${invite.inviter.id}.validInvites`, 1);

                invites_db.find(`${invite.guild.id}`, thisUser => thisUser.userId === invite.inviter.id)
                .then(thisUser => { 
                    if (thisUser.validInvites >= config.invitesToEnterWL) {
                        console.log("enough invitations. Inviter = " + invite.inviter)
                        promoteToWL(invite);
                    }
                    
                })
            }
        })
    })
    return undefined;
});

client.on('guildMemberRemove', async (member) => {
    userWhoInvite = 0;
    let newUser;
    invites_db.find(`${member.guild.id}`, (thisUser) => thisUser.gests.includes(member.id))
    .then( thisUser =>{
        for (let i = 0; i <= thisUser.gests.length; i++) {
            if(thisUser.gests[i] === member.id){
                modernarray.popByIndex(thisUser.gests, i);
                 invites_db.sumar(`${member.guild.id}.${thisUser.userId}.validInvites`, -1);
                }
        }
        invites_db.establecer(`${member.guild.id}.${thisUser.userId}`, thisUser)
    })

    inv = client.usersInvitesRegister.find(inv => inv.users.includes(member.user.id));
    if (inv != undefined) {
        inv.users = inv.users.filter((user) => user !== member.user.id);
        inv.uses--;
        inv.totalValidInvites--;
        inv.leaves++;
    }
    else{
        console.log(member.user.tag + "Leaves");
    }
});

/*---Close Level zone ---*/