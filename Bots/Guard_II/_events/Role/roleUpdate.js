const { Event } = require("../../../../Global/Structures/Default.Events");
class RoleUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "roleUpdate",
            enabled: true,
        });
    }

    async onLoad(oldRole, newRole) {
        let entry = await newRole.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleUpdate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Rol")) return;
        closeYt();
    }
}

module.exports = RoleUpdate;