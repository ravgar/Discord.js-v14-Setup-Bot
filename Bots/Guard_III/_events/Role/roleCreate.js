const { Event } = require("../../../../Global/Structures/Default.Events");
class RoleCreate extends Event {
    constructor(client) {
        super(client, {
            name: "roleCreate",
            enabled: true,
        });
    }

    async onLoad(role) {
        let entry = await role.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleCreate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Rol")) return;
        await role.delete({ reason: `İzinsiz rol oluşturma işlemi!` }).catch(err => { })
    }
}

module.exports = RoleCreate;