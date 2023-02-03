const { Event } = require("../../../../Global/Structures/Default.Events");
const { roleBackup, guildPerms } = require("../../../../Global/Settings/Schemas")
const Bots = require("../../../DistMain")
class RoleDelete extends Event {
    constructor(client) {
        super(client, {
            name: "roleDelete",
            enabled: true,
        });
    }

    async onLoad(role) {
        let entry = await role.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleDelete }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Rol")) return;
        closeYt();
    }
}

module.exports = RoleDelete;