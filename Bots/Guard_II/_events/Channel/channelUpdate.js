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
        closeYt();
    }
}

module.exports = ChannelUpdate;