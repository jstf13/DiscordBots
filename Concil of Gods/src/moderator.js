var {client} = require("../commands/commands_file");

client.on("message", async message => {
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