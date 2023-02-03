const { Event } = require("../../../../Global/Structures/Default.Events");
class ChannelCreate extends Event {
    constructor(client) {
        super(client, {
            name: "channelCreate",
            enabled: true,
        });
    }

    async onLoad(channel) {
        let entry = await channel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.ChannelCreate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Channel")) return;
        puni(entry.executor.id, "ban");
    }
}

module.exports = ChannelCreate;