var {client} = require(".././commands/cli");
var config = require("../config.json");

function countMembers() {
    try {
    const guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get(config.channelsIds.totalMembes);
        channel.setName(`Total Members: ${memberCount}`);
        console.log(`Updating Member Count -> ${memberCount}`);
    }, 5000);   
    } catch (error) {
        console.log(error);
    }
}

module.exports = {countMembers};