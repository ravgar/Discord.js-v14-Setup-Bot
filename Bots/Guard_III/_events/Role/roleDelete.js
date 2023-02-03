const { Event } = require("../../../../Global/Structures/Default.Events");
const { roleBackup } = require("../../../../Global/Settings/Schemas")
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
        const roleData = await roleBackup.findOne({ roleID: role.id })
        const newRole = await role.guild.roles.create({
            name: roleData ? roleData.name : role.name,
            color: roleData ? roleData.color : role.color,
            hoist: roleData ? roleData.hoist : role.hoist,
            position: roleData ? roleData.position : role.rawPosition,
            permissions: roleData ? roleData.permissions : role.permissions,
            mentionable: roleData ? roleData.mentionable : role.mentionable,
            reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
        });
        client.dataChecker(newRole.id, role.id)

        await roleBackup.findOne({ roleID: role.id }).then(async (err, data) => {
            if (!data) { role.guild.channels.cache.find(x => x.name == "guard-log").send({ content: `[${role.id}] ID'li rol silindi fakat datamda herhangi bir veri bulamadım! İşlemleri malesef gerçekleştiremiyorum!` }); console.log(`[${role.id}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`); return }
            let length = (data.members.length + 5);
            const sayı = Math.floor(length / Bots.length);
            if (sayı < 1) sayı = 1;
            const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(system.Guild.ID).channels.cache.get(e.id))
            for await (const perm of channelPerm) {
                const bott = Bots[1]
                const guild2 = bott.guilds.cache.get(system.Guild.ID)
                let kanal = guild2.channels.cache.get(perm.id);
                if (!kanal) return;
                let newPerm = {};
                perm.allow.forEach(p => {
                    newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                    newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client._logger.error(error));
            }
            for (let index = 0; index < Bots.length; index++) {
                const bot = Bots[index];
                const guild = bot.guilds.cache.get(system.Guild.ID);
                if (newRole.deleted) {
                    client._logger.log(`[${role.id}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
                    break;
                }
                const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
                if (members.length <= 0) {
                    client._logger.log(`[${role.id}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
                    break;
                }
                for await (const user of members) {
                    const member = guild.members.cache.get(user)
                    member.roles.add(newRole.id)
                }
            }
            const newData = new roleBackup({
                roleID: newRole.id,
                name: newRole.name,
                color: newRole.hexColor,
                hoist: newRole.hoist,
                position: newRole.position,
                permissions: newRole.permissions.bitfield,
                mentionable: newRole.mentionable,
                time: Date.now(),
                members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
            });
            newData.save();
        })
    }
}

module.exports = RoleDelete;








/*
            if (!data) { role.guild.channels.cache.find(x => x.name == "guard-log").send({ content: `[${role.id}] ID'li rol silindi fakat datamda herhangi bir veri bulamadım! İşlemleri malesef gerçekleştiremiyorum!` }); console.log(`[${role.id}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`); return }
            let length = (data.members.length + 5);
            const sayı = Math.floor(length / Bots.length);
            if (sayı < 1) sayı = 1;
            const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(system.Guild.ID).channels.cache.get(e.id))
            for await (const perm of channelPerm) {
                const bott = Bots[1]
                const guild2 = bott.guilds.cache.get(system.Guild.ID)
                let kanal = guild2.channels.cache.get(perm.id);
                if (!kanal) return;
                let newPerm = {};
                perm.allow.forEach(p => {
                    newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                    newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client._logger.error(error));
            }
            for (let index = 0; index < Bots.length; index++) {
                const bot = Bots[index];
                const guild = bot.guilds.cache.get(system.Guild.ID);
                if (newRole.deleted) {
                    client._logger.log(`[${role.id}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
                    break;
                }
                const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
                if (members.length <= 0) {
                    client._logger.log(`[${role.id}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
                    break;
                }
                for await (const user of members) {
                    const member = guild.members.cache.get(user)
                    member.roles.add(newRole.id)
                }
            }
            const newData = new roleBackup({
                roleID: newRole.id,
                name: newRole.name,
                color: newRole.hexColor,
                hoist: newRole.hoist,
                position: newRole.position,
                permissions: newRole.permissions.bitfield,
                mentionable: newRole.mentionable,
                time: Date.now(),
                members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
            });
            newData.save();

*/