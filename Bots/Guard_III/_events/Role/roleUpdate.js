const { Event } = require("../../../../Global/Structures/Default.Events");
class RoleUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "roleUpdate",
            enabled: true,
        });
    }

    async onLoad(oldRole, newRole) {
        const permissionStaff = [Discord.PermissionsBitField.Flags.Administrator, Discord.PermissionsBitField.Flags.ManageRoles, Discord.PermissionsBitField.Flags.ManageChannels, Discord.PermissionsBitField.Flags.ManageGuild, Discord.PermissionsBitField.Flags.BanMembers, Discord.PermissionsBitField.Flags.KickMembers, Discord.PermissionsBitField.Flags.ManageNicknames, Discord.PermissionsBitField.Flags.ManageEmojis, Discord.PermissionsBitField.Flags.ManageWebhooks, Discord.PermissionsBitField.Flags.ViewAuditLog];
        let entry = await newRole.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleUpdate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Rol")) return;
        if (permissionStaff.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
            newRole.setPermissions(oldRole.permissions);
            newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || r.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) || r.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild))).forEach(r => r.setPermissions(36818497n));
        };
        await newRole.edit({
            name: oldRole.name,
            color: oldRole.hexColor,
            hoist: oldRole.hoist,
            permissions: oldRole.permissions,
            mentionable: oldRole.mentionable
        });
    }
}

module.exports = RoleUpdate;