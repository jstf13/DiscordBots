const config = require("./config.json");
const { execSync } = require('child_process');
var {client} = require('./commands/cli');
var fs = require('fs');


client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("punishment game")
});

client.on('message', async message => {
    const prefix = config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLocaleLowerCase();
    const args2 = message.content.slice(prefix.length + command.length).trim().split(/ +/g);
    const domain = args2.shift().toLocaleLowerCase();


    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    console.log(command);
    switch (command) {
        case "bandomain":
            const output = execSync(`dnsmorph -json -d ${domain}`, { encoding: 'utf-8' });
    
            fs.appendFile('./domains/pibot.json', output, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
            }); 
        
            break;
    }
});
client.login(config.token);