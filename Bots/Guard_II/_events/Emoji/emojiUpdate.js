const { Event } = require("../../../../Global/Structures/Default.Events");
class EmojiUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "emojiDelete",
            enabled: true,
        });
    }

    async onLoad(newEmoji, oldEmoji) {
        let entry = await newEmoji.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.EmojiUpdate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Emoji")) return;
        closeYt();
    }
}

module.exports = EmojiUpdate;