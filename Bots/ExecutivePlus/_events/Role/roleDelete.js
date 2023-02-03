const { Event } = require("../../../../Global/Structures/Default.Events");
class RoleDeleteLog extends Event {
    constructor(client) {
        super(client, {
            name: "roleDelete",
            enabled: true,
        });
    }

    async onLoad(role) {
        let entry = await role.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleDelete }).then(audit => audit.entries.first());
        if (!entry || !entry.executor) return;
        await role.guild.channels.cache.find(x => x.name == "guard-log").send({
            content: `Sunucuda rol silindi! ${entry.executor} (\`${entry.executor.id}\`) tarafından ${role.name} (\`${role.id}\`) rolü silindi.`
        })

    }
}

module.exports = RoleDeleteLog;