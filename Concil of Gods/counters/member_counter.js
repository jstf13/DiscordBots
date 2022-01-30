var {client} = require(".././commands/commands_file")

function countMembers() {
    const guild = client.guilds.cache.get("926465898582253618");
    console.log(guild.name);
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('937133345932980224');
        channel.setName(`Total Members: ${memberCount}`);
        console.log('Updating Member Count');
    }, 5000);   
}

module.exports = {countMembers};