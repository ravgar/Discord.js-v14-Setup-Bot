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
        await channel.delete({ reason: `ravgar#3210 Koruma Tarafından Silindi.` })
    }
}

module.exports = ChannelCreate;