var {client} = require(".././commands/cli")

function countMembers() {
    try {
    const guild = client.guilds.cache.get("926465898582253618");
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('937133345932980224');
        channel.setName(`Total Members: ${memberCount}`);
        console.log('Updating Member Count');
    }, 5000);   
    } catch (error) {
        console.log(error);
    }
}

module.exports = {countMembers};