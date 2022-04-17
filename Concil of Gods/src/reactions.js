const { GuildInviteManager } = require("discord.js");
var { client } = require("../commands/commands_file");
const config = require("../config.json");
  let lenguageMessage = config.messagesIds.lenguage;
  let welcomeMessage = config.messagesIds.welcome;
  let welcomeMessageES = config.messagesIds.welcomeES;
  let seeAllCollabs = config.messagesIds.seeAllCollabs;
  let giveAwayAndWl = config.messagesIds.giveAwayAndlMessage;
  let seeAllGames = config.messagesIds.seeAllGames;

client.on("messageReactionAdd", async (reaction, user) => {

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

  checkReactAllCollabs(reaction, user);
  checkReactGiveAway(reaction, user);
  checkReactGamer(reaction, user);

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

  checkRemovedReactAllCollabs(reaction, user);
  checkRemovingReactGiveAway(reaction, user);
  checkRemovedGamer(reaction, user);

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


function checkReactAllCollabs(reaction, user) {
  if (
    (reaction.message.id == seeAllCollabs) &&
    reaction.emoji.name === "✅"
  ) {
    try {
      let likeCollabs = reaction.message.guild.roles.cache.get(
        config.roles.likeCollabs
      );
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      reactedUser.roles.add(likeCollabs);
    } catch {
      console.log(console.error, "Error : can't add the like collabs role");
    }
  }
}

function checkReactGiveAway(reaction, user) {
  if (
    (reaction.message.id == giveAwayAndWl)
  ) {
    try {
      let wlRole = reaction.message.guild.roles.cache.get(
        config.roles.wlRole
      );
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      reactedUser.roles.add(wlRole);
    } catch {
      console.log(console.error, "Error : can't add the wl role");
    }
  }
}

function checkReactGamer(reaction, user) {
  if (
    (reaction.message.id == seeAllGames) &&
    reaction.emoji.name === "✅"
  ) {
    try {
      let gamer = reaction.message.guild.roles.cache.get(
        config.roles.gamer
      );
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      reactedUser.roles.add(gamer);
    } catch {
      console.log(console.error, "Error : can't add the gamer role");
    }
  }
}


//Removing reactions

function checkRemovedReactAllCollabs(reaction, user) {
  if (
    (reaction.message.id == seeAllCollabs) &&
    reaction.emoji.name === "✅"
  ) {
    let likeCollabs = reaction.message.guild.roles.cache.get(
      config.roles.likeCollabs
    );
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );
    try {
      reactedUser.roles.remove(likeCollabs);
    } catch {
      console.log(console.error, "Error : can't remove the see all collabs role");
    }
  }
}

function checkRemovingReactGiveAway(reaction, user) {
  if (
    (reaction.message.id == giveAwayAndWl)
  ) {
    let wlRole = reaction.message.guild.roles.cache.get(
      config.roles.wlRole
    );
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );
    try {
      reactedUser.roles.remove(wlRole);
    } catch {
      console.log(console.error, "Error : can't remove the wl role");
    }
  }
}

function checkRemovedGamer(reaction, user) {
  if (
    (reaction.message.id == seeAllGames) &&
    reaction.emoji.name === "✅"
  ) {
    let gamer = reaction.message.guild.roles.cache.get(
      config.roles.gamer
    );
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );
    try {
      reactedUser.roles.remove(gamer);
    } catch {
      console.log(console.error, "Error : can't remove the gamer role");
    }
  }
}

/*--- Close Reaction zone ---*/
