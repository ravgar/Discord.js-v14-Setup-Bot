const { Event } = require("../../../../Global/Structures/Default.Events");
class ChannelUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "channelUpdate",
            enabled: true,
        });
    }

    async onLoad(oldChannel, newChannel) {
        let entry = await newChannel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.ChannelUpdate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Channel")) return;
        if (newChannel.type !== ChannelType.GuildCategory && newChannel.parentId !== oldChannel.parentId) newChannel.setParent(oldChannel.parentId);
        if (newChannel.type === ChannelType.GuildCategory) {
            await newChannel.edit({
                name: oldChannel.name,
                position: oldChannel.position
            });
        }
        if ((newChannel.type === ChannelType.GuildText) || (newChannel.type === ChannelType.GuildNews)) {
            await newChannel.edit({
                name: oldChannel.name,
                topic: oldChannel.topic,
                nsfw: oldChannel.nsfw,
                parentID: oldChannel.parentId,
                rateLimitPerUser: oldChannel.rateLimitPerUser,
                position: oldChannel.position
            });
        }
        if (newChannel.type === ChannelType.GuildVoice) {
            await newChannel.edit({
                name: oldChannel.name,
                bitrate: oldChannel.bitrate,
                userLimit: oldChannel.userLimit,
                parentID: oldChannel.parentId,
                position: oldChannel.position
            });
        };
        oldChannel.permissionOverwrites.forEach(perm => {
            let thisPermOverwrites = {};
            perm.allow.toArray().forEach(p => {
                thisPermOverwrites[p] = true;
            });
            perm.deny.toArray().forEach(p => {
                thisPermOverwrites[p] = false;
            });
            newChannel.createOverwrite(perm.id, thisPermOverwrites);
        });
    }
}

module.exports = ChannelUpdate;