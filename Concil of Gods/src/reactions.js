const { GuildInviteManager } = require("discord.js");
var { client } = require("../commands/commands_file");
const config = require("../config.json");
let lenguageMessage = config.messagesIds.lenguage;
let welcomeMessage = config.messagesIds.welcome;
let welcomeMessageES = config.messagesIds.welcomeES;
let seeAllCollabs = config.messagesIds.seeAllCollabs;
let giveAwayAndWl = config.messagesIds.giveAwayAndlMessage;
let seeAllGames = config.messagesIds.seeAllGames;
let seeDedicatedIdiomsChannel = config.messagesIds.selectDedicatedLenguages;

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
  checkReactDedicatedIdiom(reaction, user);

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
  checkRemovedDedicatedIdiom(reaction, user);

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
  if (reaction.message.id == seeAllCollabs && reaction.emoji.name === "✅") {
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
  if (reaction.message.id == giveAwayAndWl) {
    try {
      let wlRole = reaction.message.guild.roles.cache.get(config.roles.wlRole);
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
  if (reaction.message.id == seeAllGames && reaction.emoji.name === "✅") {
    try {
      let gamer = reaction.message.guild.roles.cache.get(config.roles.gamer);
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      reactedUser.roles.add(gamer);
    } catch {
      console.log(console.error, "Error : can't add the gamer role");
    }
  }
}

function checkReactDedicatedIdiom(reaction, user) {
  if (reaction.message.id == seeDedicatedIdiomsChannel) {
    try {
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      key = reaction.emoji.name;
      switch (key) {
        case "🇯🇵":
          let JP = reaction.message.guild.roles.cache.get(config.roles.JP);
          reactedUser.roles.add(JP);

          break;
        case "🇰🇷":
          let KR = reaction.message.guild.roles.cache.get(config.roles.KR);
          reactedUser.roles.add(KR);

          break;
        case "🇮🇳":
          let IN = reaction.message.guild.roles.cache.get(config.roles.IN);
          reactedUser.roles.add(IN);

          break;
        case "🇫🇷":
          let FR = reaction.message.guild.roles.cache.get(config.roles.FR);
          reactedUser.roles.add(FR);

          break;
        case "🇷🇺":
          let RU = reaction.message.guild.roles.cache.get(config.roles.RU);
          reactedUser.roles.add(RU);

          break;
        case "🇬🇷":
          let GR = reaction.message.guild.roles.cache.get(config.roles.GR);
          reactedUser.roles.add(GR);

          break;
        case "🇩🇪":
          let DE = reaction.message.guild.roles.cache.get(config.roles.DE);
          reactedUser.roles.add(DE);

          break;
        case "🇵🇹":
          let PT = reaction.message.guild.roles.cache.get(config.roles.PT);
          reactedUser.roles.add(PT);

          break;
        case "🇨🇳":
          let CN = reaction.message.guild.roles.cache.get(config.roles.CN);
          reactedUser.roles.add(CN);

          break;
        case "🇮🇹":
          let IT = reaction.message.guild.roles.cache.get(config.roles.IT);
          reactedUser.roles.add(IT);

      }
    } catch {
      console.log(console.error, "Error : can't add the dedicated idiom role");
    }
  }
}

//Removing reactions

function checkRemovedReactAllCollabs(reaction, user) {
  if (reaction.message.id == seeAllCollabs && reaction.emoji.name === "✅") {
    let likeCollabs = reaction.message.guild.roles.cache.get(
      config.roles.likeCollabs
    );
    let reactedUser = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );
    try {
      reactedUser.roles.remove(likeCollabs);
    } catch {
      console.log(
        console.error,
        "Error : can't remove the see all collabs role"
      );
    }
  }
}

function checkRemovingReactGiveAway(reaction, user) {
  if (reaction.message.id == giveAwayAndWl) {
    let wlRole = reaction.message.guild.roles.cache.get(config.roles.wlRole);
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
  if (reaction.message.id == seeAllGames && reaction.emoji.name === "✅") {
    let gamer = reaction.message.guild.roles.cache.get(config.roles.gamer);
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

function checkRemovedDedicatedIdiom(reaction, user) {
  if (reaction.message.id == seeDedicatedIdiomsChannel) {
    try {
      let reactedUser = reaction.message.guild.members.cache.find(
        (member) => member.id === user.id
      );
      key = reaction.emoji.name;
      switch (key) {
        case "🇯🇵":
          let JP = reaction.message.guild.roles.cache.get(config.roles.JP);
          reactedUser.roles.remove(JP);

          break;
        case "🇰🇷":
          let KR = reaction.message.guild.roles.cache.get(config.roles.KR);
          reactedUser.roles.remove(KR);

          break;
        case "🇮🇳":
          let IN = reaction.message.guild.roles.cache.get(config.roles.IN);
          reactedUser.roles.remove(IN);

          break;
        case "🇫🇷":
          let FR = reaction.message.guild.roles.cache.get(config.roles.FR);
          reactedUser.roles.remove(FR);

          break;
        case "🇷🇺":
          let RU = reaction.message.guild.roles.cache.get(config.roles.RU);
          reactedUser.roles.remove(RU);

          break;
        case "🇬🇷":
          let GR = reaction.message.guild.roles.cache.get(config.roles.GR);
          reactedUser.roles.remove(GR);

          break;
        case "🇩🇪":
          let DE = reaction.message.guild.roles.cache.get(config.roles.DE);
          reactedUser.roles.remove(DE);

          break;
        case "🇵🇹":
          let PT = reaction.message.guild.roles.cache.get(config.roles.PT);
          reactedUser.roles.remove(PT);

          break;
        case "🇨🇳":
          let CN = reaction.message.guild.roles.cache.get(config.roles.CN);
          reactedUser.roles.remove(CN);

          break;
        case "🇮🇹":
          let IT = reaction.message.guild.roles.cache.get(config.roles.IT);
          reactedUser.roles.remove(IT);

      }
    } catch {
      console.log(console.error, "Error : can't add the dedicated idiom role");
    }
  }
}

/*--- Close Reaction zone ---*/
