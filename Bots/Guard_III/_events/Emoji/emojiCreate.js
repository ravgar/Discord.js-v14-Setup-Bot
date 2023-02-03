const { Event } = require("../../../../Global/Structures/Default.Events");
class EmojiCreate extends Event {
    constructor(client) {
        super(client, {
            name: "emojiCreate",
            enabled: true,
        });
    }

    async onLoad(emoji) {
        let entry = await emoji.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.EmojiCreate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Emoji")) return;
        await emoji.delete({ reason: `ravgar#3210 Emoji Koruması Tarafından Silindi!` })
    }
}

module.exports = EmojiCreate;