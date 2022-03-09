const { GuildInviteManager } = require("discord.js");
var { client } = require("../commands/commands_file");
const config = require("../config.json");

client.on("messageReactionAdd", async (reaction, user) => {
  let lenguageMessage = config.messagesIds.lenguage;
  let welcomeMessage = config.messagesIds.welcome;
  let welcomeMessageES = config.messagesIds.welcomeES;

  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  if (
    (reaction.message.id == welcomeMessage ||
      reaction.message.id == welcomeMessageES) &&
    reaction.emoji.name === "✅"
  ) {
    try {
      let commonRole = reaction.message.guild.roles.cache.get(
        config.roles.sonOfGod
      );
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      reactedUser.roles.add(commonRole);
    } catch {
      console.log(console.error, "Error : can't add the role");
    }
  }

  if (reaction.message.id == lenguageMessage) {
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );

    if (reaction.emoji.name === "🇪🇸") {
      let commonRole = reaction.message.guild.roles.cache.get(
        config.roles.spanish
      );
      try {
        reactedUser.roles.add(commonRole);
      } catch {
        console.log(console.error, "Error : can't add the spanish role");
      }
    }

    if (reaction.emoji.name === "🇬🇧") {
      let commonRole = reaction.message.guild.roles.cache.get(
        config.roles.english
      );
      try {
        reactedUser.roles.add(commonRole);
      } catch {
        console.log(console.error, "Error : can't add the english role");
      }
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  let lenguageMessage = config.messagesIds.lenguage;
  let welcomeMessage = config.messagesIds.welcome;
  let welcomeMessageES = config.messagesIds.welcomeES;

  if (
    (reaction.message.id == welcomeMessage ||
      reaction.message.id == welcomeMessageES) &&
    reaction.emoji.name === "✅"
  ) {
    let commonRole = reaction.message.guild.roles.cache.get(
      config.roles.sonOfGod
    );
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );
    try {
      reactedUser.roles.remove(commonRole);
    } catch {
      console.log(console.error, "Error : can't remove the role");
    }
  }

  if (reaction.message.id == lenguageMessage) {
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );

    if (reaction.emoji.name === "🇪🇸") {
      let commonRole = reaction.message.guild.roles.cache.get(
        config.roles.spanish
      );
      try {
        reactedUser.roles.remove(commonRole);
      } catch {
        console.log(console.error, "Error : can't remove the spanish role");
      }
    }

    if (reaction.emoji.name === "🇬🇧") {
      let commonRole = reaction.message.guild.roles.cache.get(
        config.roles.english
      );
      try {
        reactedUser.roles.remove(commonRole);
      } catch {
        console.log(console.error, "Error : can't remove the english role");
      }
    }
  }
});

/*--- Close Reaction zone ---*/
