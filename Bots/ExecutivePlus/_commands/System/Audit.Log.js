
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { roleBackup } = require("../../../../Global/Settings/Schemas")
class AuditLog extends Command {
    constructor(client) {
        super(client, {
            name: "auditlog",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["denetim", "rolekur", "silinenler"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (args[0] == "rol") {
            let deletedRoleData = await roleBackup.find({ guildID: message.guild.id });
            let deletedRoles = deletedRoleData.filter(r => !message.guild.roles.cache.has(r.roleID)).sort((a, b) => b.members.length - a.members.length);
            if (deletedRoles.length < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} \`Hata:\` Sunucuda silinmiş rol bulunamadı!`}).sil(20);

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.SelectMenuBuilder()
                        .setCustomId('statdetay')
                        .setPlaceholder('👥 Detaylı bilgi almak için tıkla!')
                        .addOptions(deletedRoles?.map(x =>
                            [{ label: x.name, value: x.roleID }]
                        ))
                        .addOptions({ label: "Kapat!", description: "Marketi Kapat!", value: "kapat" })
                );
                            await message.channel.send({ content: `sa`, components: [row] })
        }
    }
}

module.exports = AuditLog
