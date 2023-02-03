const { Event } = require("../../../../Global/Structures/Default.Events");
const { voiceJoinedAt, voiceUser, voiceGuild, voiceGuildChannel, voiceUserChannel } = require("../../../../Global/Settings/Schemas")
class VoiceStat extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });
    }

    async onLoad(newState, oldState) {
        if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

        if (!oldState.channelId && newState.channelId) {
            await voiceJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const joinedAtData = await voiceJoinedAt.findOne({ userID: oldState.id });
        await voiceUser.findOneAndUpdate({ userID: oldState.id }, { $set: { lastSeen: Date.now() } }, { upsert: true });

        if (!joinedAtData) {
            await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const data = Date.now() - joinedAtData?.date;
        if (oldState.channelId && !newState.channelId) {
            await saveDatas(oldState, oldState.channel, data);
            await voiceJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.channelId && newState.channelId) {
            await saveDatas(oldState, oldState.channel, data);
            await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        async function saveDatas(user, channel, data) {
            await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await voiceGuildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
            await voiceUserChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
        }
    }
}

module.exports = VoiceStat;