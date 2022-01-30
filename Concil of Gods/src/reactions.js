var {client} = require("../commands/commands_file")

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