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
        let member = emoji.guild.members.cache.get(entry.executor.id)
        const gorevler = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("baniac").setDisabled(member.bannable ? false : true).setLabel("İşlemi Yapan Kişinin Banı Aç!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("guvenliekle").setDisabled(ravgar?.Emoji.includes(entry.executor.id) ? true : false).setLabel("İşlemi Yapan Kişiyi Güvenliye Ekle!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("yetkileriac").setLabel("Sunucu Yetkilerini Tekrar Aç!").setStyle(Discord.ButtonStyle.Primary))

        let guardlog = await emoji.guild.channels.cache.find(x => x.name == "guard-log").send({
            components: [gorevler],
            content: `Sunucuda emoji oluşturuldu! ${entry.executor} (\`${entry.executor.id}\`) tarafından emoji oluşturuldu. Emoji silindi. Üye ${member.bannable ? "banlandı!" : "banlanamadı!"}`
        })
        var filter = (button) => system.Bot.Roots.includes(button.user.id);
        const collector = guardlog.createMessageComponentCollector({ filter })
        collector.on('collect', async (button) => {
            button.deferUpdate();
            if (button.customId == "baniac") {
                button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`)
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisinin banını kaldırdın!` })
            }
            if (button.customId == "guvenliekle") {
                if (ravgar?.Role.includes(member.id)) return button.channel.send({ content: `${member} kişisi zaten güvenli listede!` })
                await ravgarcik.findOneAndUpdate({ guildID: emoji.guild.id }, { $push: { Role: member.id } }, { upsert: true })
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisini **Rol** kategorisinde güvenli ekledin!` })
            }
            if (button.customId == "yetkileriac") {
                const yetkipermler = await guildPerms.findOne({ guildID: system.Guild.ID });
                if (!yetkipermler) return;
                yetkipermler.roller.forEach((permission) => { const roles = emoji.guild.roles.cache.get(permission.rol); if (roles) roles.setPermissions(permission.perm); });
                await guildPerms.deleteMany({})
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde sunucudaki rollerin yetkilerini açtın!` })
            }
        })
    }
}

module.exports = EmojiCreate;