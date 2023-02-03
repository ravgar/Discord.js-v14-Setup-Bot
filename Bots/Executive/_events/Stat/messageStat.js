const { Event } = require("../../../../Global/Structures/Default.Events");
const { messageUser, messageGuild, messageGuildChannel, messageUserChannel } = require("../../../../Global/Settings/Schemas")
class MessageStat extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });    
    }    

    async onLoad(message) {
        if (message.author.bot || !message.guild || client.prefix.some(x => message.content.startsWith(x))) return;
        await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, weeklyStat: 1 } }, { upsert: true });
        await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, weeklyStat: 1 } }, { upsert: true });
        await messageGuildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
        await messageUserChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
    }
}    

module.exports = MessageStat;