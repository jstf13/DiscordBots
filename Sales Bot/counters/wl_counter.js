var {client} = require(".././commands/cli");
var config = require("../config.json");

function countWlMembers() {
    try {
    const guild = client.guilds.cache.get(config.serverIds.sonsOfGodsGuildId);
    setInterval(() =>{
        glMemberCount = guild.roles.cache.get(config.roles.glRole).members.size;
        wlMemberCount = guild.roles.cache.get(config.roles.wlRole).members.size;
        tochedByGodsCount = guild.roles.cache.get(config.roles.touchedByGods).members.size;
        
        totalWlMembers = (wlMemberCount + tochedByGodsCount);
        
        const WlChannel = guild.channels.cache.get(config.channelsIds.totalWlMembers);
        WlChannel.setName(`WL List: ${totalWlMembers} / 500`);

        const glChannel = guild.channels.cache.get(config.channelsIds.totalGlMembers);
        glChannel.setName(`OG List: ${glMemberCount} / 100`);
        
        
        // console.log(`Updating wl Member Count -> ${totalWlMembers}`);
        // console.log(`Updating GL Member Count -> ${glMemberCount}`);
        // console.log('====================================');
    }, 20000);   
    } catch (error) {
        console.log(error);
    }
}

module.exports = {countWlMembers};