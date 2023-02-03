const { Event } = require("../../../../Global/Structures/Default.Events");
const { Upstaff, voiceJoinedAt } = require("../../../../Global/Settings/Schemas")
class UpStaffVoice extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });
    }

    async onLoad(oldState, newState) {
        const ravgar = await ravgarcik.findOne({ guildID: oldState.guild.id })
        if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

        if (!oldState.channelId && newState.channelId) await voiceJoinedAt.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
        const joinedAtData = (await voiceJoinedAt.findOne({ userID: oldState.id }))
            ? await voiceJoinedAt.findOne({ userID: oldState.id })
            : await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true });
        const data = Date.now() - joinedAtData.date;

        if (oldState.channelId && !newState.channelId) {
            await upstaffSave(oldState, oldState.channel, data);
            await voiceJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.channelId && newState.channelId) {
            await upstaffSave(oldState, oldState.channel, data);
            await voiceJoinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }


        async function upstaffSave(user, channel, data) {
        const ravgar = await ravgarcik.findOne({ guildID: channel.guild.id })
            if (ravgar?.staffRanks.length < 0) return;
            if (ravgar?.staffMode && ravgar?.registerHammer.some((x) => user.member.roles.cache.has(x)) && !ravgar?.bannedChannels.some((x) => channel.id === x)) {
                if (channel.parent && ravgar?.publicParents.includes(channel.parentId))
                    await Upstaff.updateOne({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: (data / 1000 / 60 / ravgar?.voiceCount) * ravgar?.voiceCoin } }, { upsert: true });
                else
                    await Upstaff.updateOne({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: (data / 1000 / 60 / ravgar.voiceCount) * ravgar?.voiceCoin } }, { upsert: true });
                const coinData = await Upstaff.findOne({ guildID: user.guild.id, userID: user.id });
                if (coinData && ravgar?.staffRanks.some((x) => x.coin >= coinData.coin)) {
                    const newRank = ravgar?.staffRanks.filter((x) => coinData.coin >= x.coin).last();
                    if (
                        (newRank && Array.isArray(newRank.role) && !newRank.role.some((x) => user.member.roles.cache.has(x))) ||
                        (newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role))
                    ) {
                        user.member.roles.add(newRank.role);
                        const oldRoles = ravgar?.staffRanks.filter((x) => coinData.coin < x.coin && user.member.hasRole(x.role));
                        oldRoles.forEach((x) => x.role.forEach((r) => user.member.roles.remove(r)));
                        user.guild.findChannel("rank-log").send({
                            content:
`:tada: ${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map((x) => `${message.guild.roles.cache.get(x).name}`).join(", ") : `${message.guild.roles.cache.get(newRank.role).name}`} rolü verildi!`
                        });
                    }
                }
            }
        }
    }
}

module.exports = UpStaffVoice;
