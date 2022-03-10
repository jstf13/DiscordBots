require('./src/sales');

const config = require("./config.json");
var {client} = require('./commands/cli');
const memberCounter = require('./counters/member_counter');
const WlMemberCounter = require('./counters/wl_counter');

client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("a sales god game");
    memberCounter.countMembers();
    WlMemberCounter.countWlMembers();
});

client.login(config.token);