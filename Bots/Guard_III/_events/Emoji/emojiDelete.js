const { Event } = require("../../../../Global/Structures/Default.Events");
class EmojiDelete extends Event {
    constructor(client) {
        super(client, {
            name: "emojiDelete",
            enabled: true,
        });
    }

    async onLoad(emoji) {
        let entry = await emoji.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.EmojiDelete }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Emoji")) return;
        await emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(err => console.log("Silinen emoji kurulamadı!" + err));
    }
}

module.exports = EmojiDelete;