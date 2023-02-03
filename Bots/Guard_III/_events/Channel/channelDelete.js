const { Event } = require("../../../../Global/Structures/Default.Events");
const { channelBackup } = require("../../../../Global/Settings/Schemas");
const { PermissionFlagsBits, ChannelType, PermissionsBitField } = require("discord.js");
class ChannelDelete extends Event {
    constructor(client) {
        super(client, {
            name: "channelDelete",
            enabled: true,
        });
    }

    async onLoad(channel) {
        let entry = await channel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.ChannelDelete }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Channel")) return;
        channelBackup.findOne({ channelID: channel }, async (err, data) => {
            if (!data) return console.log("Veri bulunmadığı için silinen kanalın yedeği kurulamadı!")
            const channel = await channel.guild.channels.create(data.name, {
                type: data.type,
                position: data.position + 1,
                nsfw: data.nsfw,
                parentID: data.parentID,
                rateLimit: data.rateLimit,
            });
            if (channel.type == ChannelType.GuildCategory) {
                const textChannels = await channelBackup.find({ parentID: channel });
                await channelBackup.updateMany({ parentID: channel }, { parentID: channel.id });
                textChannels.forEach(c => {
                    const textChannel = channel.guild.channels.cache.get(c.channelID);
                    if (textChannel) textChannel.setParent(channel, { lockPermissions: false });
                });
                const voiceChannels = await channelBackup.find({ parentID: channel });
                await channelBackup.updateMany({ parentID: channel }, { parentID: channel.id });
                voiceChannels.forEach(c => {
                    const voiceChannel = channel.guild.channels.cache.get(c.channelID);
                    if (voiceChannel) voiceChannel.setParent(channel, { lockPermissions: false });
                });
                const newOverwrite = [];
                for (let index = 0; index < data.overwrites.length; index++) {
                    const veri = data.overwrites[index];
                    newOverwrite.push({
                        id: veri.id,
                        allow: new Discord.Permissions(veri.allow).toArray(),
                        deny: new Discord.Permissions(veri.deny).toArray()
                    });
                }
                await channel.permissionOverwrites.set(newOverwrite);
                data.channelID = channel.id
                data.save()
            } else if (channel.type == ChannelType.GuildText) {
                const newOverwrite = [];
                for (let index = 0; index < data.overwrites.length; index++) {
                    const veri = data.overwrites[index];
                    newOverwrite.push({
                        id: veri.id,
                        allow: new Discord.Permissions(veri.allow).toArray(),
                        deny: new Discord.Permissions(veri.deny).toArray()
                    });
                }
                if (channel) channel.setParent(data.parentID, { lockPermissions: false });
                await channel.permissionOverwrites.set(newOverwrite);
                data.channelID = channel.id
                data.save()
            } else if (channel.type == ChannelType.GuildVoice) {
                const newOverwrite = [];
                for (let index = 0; index < data.overwrites.length; index++) {
                    const veri = data.overwrites[index];
                    newOverwrite.push({
                        id: veri.id,
                        allow: new Discord.Permissions(veri.allow).toArray(),
                        deny: new Discord.Permissions(veri.deny).toArray()
                    });
                }
                if (channel) channel.setParent(data.parentID, { lockPermissions: false });
                await channel.permissionOverwrites.set(newOverwrite);
                data.channelID = channel.id
                data.save()
            }
        })
        client.dataChecker(channel.id, channel.id)
    }
}

module.exports = ChannelDelete;