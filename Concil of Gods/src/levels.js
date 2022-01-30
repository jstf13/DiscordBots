var {client} = require("../commands/commands_file");


// Initialize the invite cache
const invites = new Map();
let serverId = '926465898582253618';
let TestServerId = '919766844385136650';
let botMessageChannel = "new-people";
let testBotMessageChannel = "probando-bots";

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