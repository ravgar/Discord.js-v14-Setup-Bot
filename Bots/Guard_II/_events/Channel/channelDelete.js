const { Event } = require("../../../../Global/Structures/Default.Events");
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
        closeYt();
    }
}

module.exports = ChannelDelete;