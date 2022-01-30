var {client} = require("./commands/commands_file")

const memberCounter = require("./counters/member_counter")
require("./commands/bot_petitions")
const Discord = require("discord.js");
const config = require("./config.json");
var prefix = config.prefix;

/**
             * Create a text progress bar
             * @param {Number} value - The value to fill the bar
             * @param {Number} maxValue - The max value of the bar
             * @param {Number} size - The bar size (in letters)
             * @return {String} - The bar
             */
 global.progressBar = (value, maxValue, size) => {
    const percentage = value / maxValue; // Calculate the percentage of the bar
    const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

    const progressText = '▇'.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
    const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar

    const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```'; // Creating the bar
    return bar;
};

// Initialize the invite cache
const invites = new Map();
let serverId = '926465898582253618';
let TestServerId = '919766844385136650';
let botMessageChannel = "new-people";
let testBotMessageChannel = "probando-bots";



client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("gods stuffs")

    memberCounter.countMembers(client);
});

/*--- Reaction zone ---*/

client.on('messageReactionAdd', async (reaction, user) => {

    let lenguageMessage = 927573907760881665;
    let welcomeMessage = 926960221031636993;

    let spanishRol = 927215843274813510;
    let englishRol = 927224462850523156;

	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    if (reaction.message.id == welcomeMessage && reaction.emoji.name === '✅') {
        let commonRole = reaction.message.guild.roles.cache.get("926470689249189918");
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        try {
            reactedUser.roles.add(commonRole);
         } catch {
            console.log(console.error, 'Error : can\'t add the role');
         }
    }

    if (reaction.message.id == lenguageMessage) {
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        
        if (reaction.emoji.name === '🇪🇸') {
            let commonRole = reaction.message.guild.roles.cache.get("927215843274813510");
            console.log(commonRole.name);
            try {
                reactedUser.roles.add(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t add the spanish role');
             }
        }
        
        if (reaction.emoji.name === '🇬🇧') {
            let commonRole = reaction.message.guild.roles.cache.get("927224462850523156");    
                    console.log(commonRole.name);
            try {
                reactedUser.roles.add(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t add the english role');
             }
        }
    }


	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.id}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on('messageReactionRemove', (reaction, user) => {
    
    let lenguageMessage = 927573907760881665;
    let welcomeMessage = 926960221031636993;

    console.log('Reaction removed; current count:', reaction.count);
    if (reaction.message.id == 926960221031636993 && reaction.emoji.name === '✅') {
        console.log("segunda");
        let commonRole = reaction.message.guild.roles.cache.get("926470689249189918");
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        try {
            reactedUser.roles.remove(commonRole);
         } catch {
            console.log(console.error, 'Error : can\'t remove the role');
         }
    }

    if (reaction.message.id == lenguageMessage) {
        let reactedUser =  reaction.message.guild.members.cache.find(member => member.id === user.id)
        
        if (reaction.emoji.name === '🇪🇸') {
            let commonRole = reaction.message.guild.roles.cache.get("927215843274813510");
            console.log(commonRole.name);
            try {
                reactedUser.roles.remove(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t remove the spanish role');
             }
        }
        
        if (reaction.emoji.name === '🇬🇧') {
            let commonRole = reaction.message.guild.roles.cache.get("927224462850523156");    
                    console.log(commonRole.name);
            try {
                reactedUser.roles.remove(commonRole);
             } catch {
                console.log(console.error, 'Error : can\'t remove the english role');
             }
        }
    }
});

/*--- Close Reaction zone ---*/

/*--- Moderator zone ---*/

client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comand = args.shift().toLocaleLowerCase();

    let blacklistedSpanish = ['puto', 'puta', 'hijo de puta', 'la puta que te pario', 'la concha de tu madre',
     'hijo de remil pute', 'chupamela', 'chupa pija', 'sos una pija', 'pija']; 
     
    let blacklistedEnglish = ['son of a bitch', 'fuck you', 'asshole' ,'ashole', 'asole', 'fu', 'son of a bitch', 
    'pussy', 'cock', 'dick', 'bastard', 'motherfucker', 'nigga', 'nigger'];

    let foundInTextSpanish = false;
    let foundInTextEnglish = false;

    for (var i in blacklistedSpanish) {
      if (message.content.toLowerCase().includes(blacklistedSpanish[i].toLowerCase())) foundInTextSpanish = true;
    }

    for (var j in blacklistedEnglish) {
      if (message.content.toLowerCase().includes(blacklistedEnglish[j].toLowerCase())) foundInTextEnglish = true;
    }

    if (foundInTextSpanish) {
        message.channel.send(`${message.author} Si puteas mucho te baneamos`);
        message.delete();
    } 

    if (foundInTextEnglish) {
        message.channel.send(`${message.author} Don't use bad words or you will get banned`);
        message.delete();
    }
});

/*---Close Moderator zone ---*/

/*--- Level zone ---*/



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

client.login(config.token);


