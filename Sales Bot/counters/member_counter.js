module.exports = async (client) => {
    const guild = client.guild.cache.get('926465898582253618');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channel.cache.get('937133345932980224');
        channel.setName(`Total Members: ${memberCount.toLocaleSring()}`);
        console.log('Updating Member Count');
    }, 5000);
}