require('./src/sales');

const config = require("./config.json");
var {client} = require('./commands/cli');
const memberCounter = require('./counters/member_counter');

client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("a sales god game");
    memberCounter.countMembers();
});

client.login(config.token);