var {client} = require(".././commands/cli");
var config = require("../config.json");

function countWlMembers() {
    try {
    const guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);
    setInterval(() =>{
        wlMemberCount = guild.roles.cache.get(config.roles.wlRole).members.size;
        tochedByGodsCount = guild.roles.cache.get(config.roles.touchedByGods).members.size;
        totalWlMembers = (wlMemberCount + tochedByGodsCount);
        const WlChannel = guild.channels.cache.get(config.channelsIds.totalWlMembers);
        WlChannel.setName(`WL members: ${totalWlMembers} / 2000`);
        console.log(`Updating WL Member Count -> ${totalWlMembers}`);
        console.log('====================================');
    }, 5000);   
    } catch (error) {
        console.log(error);
    }
}

module.exports = {countWlMembers};