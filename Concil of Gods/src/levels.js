var {client} = require("../commands/commands_file");
const config = require('../config.json');
const db = require('megadb');
const { WelcomeChannel } = require("discord.js");
let invites_db = new db.crearDB('invites');

// Initialize the invite cache
const invites = new Map();
let serverId = '926465898582253618';
let TestServerId = '919766844385136650';
let botMessageChannel = "new-people";
let myWelcomeChannel = '927999666358980658';
let modernarray = require('modernarray');

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
    const channel = member.guild.channels.cache.find(channel => channel.id === myWelcomeChannel);

    member.guild.invites.fetch().then(guildInvites => { //get all guild invites
        guildInvites.each(invite => { //basically a for loop over the invites:
            if(invite.uses != client.invites[invite.code]) { //if it doesn't match what we stored
                channel.send(`${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter.tag}.`)
                
                invites_db.push(`${invite.guild.id}.${invite.inviter.id}.gests`, member.user.id);
                invites_db.sumar(`${invite.guild.id}.${invite.inviter.id}.validInvites`, 1);
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
            console.log(thisUser);
                }
        }
        invites_db.establecer(`${member.guild.id}.${thisUser.userId}`, thisUser)
    })
    console.log("member.guild.id= " + member.guild.id);

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