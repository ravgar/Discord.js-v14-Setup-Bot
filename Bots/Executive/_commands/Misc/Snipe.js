
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Snipe } = require("../../../../Global/Settings/Schemas")
class SnipeK extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            description: "Sunucu içerisi kanalda silinmiş son mesajı görürsünüz.",
            usage: "snipe",
            category: "Misc",
            aliases: ["snipe", "snayp", "silinensonmesaj"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
        client.on("messageDelete", async message => {
            if (message.author.bot || message.channel.type != 0) return;
            await Snipe.updateOne({ channelID: message.channel.id }, {
                $set: {
                    "yazar": message.author.id,
                    "yazilmaTarihi": message.createdTimestamp,
                    "silinmeTarihi": Date.now(),
                    "dosya": message.attachments.first() ? true : false,
                    "icerik": message.content ? message.content : ""
                }
            }, { upsert: true }).exec();

        });
    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!ravgar?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        const mesaj = await Snipe.findOne({ channelID: message.channel.id })
        if (!mesaj) return message.channel.send({ content: 'Hata: Bu Kanalda silinmiş bir mesaj yok!' }).sil(20)
        let mesajYazari = await client.users.fetch(mesaj.yazar);
        embed.setDescription(`\`Atan Kişi:\` ${mesajYazari} \n\`Yazılma Tarihi:\` <t:${Math.floor(mesaj.yazilmaTarihi / 1000)}:R>\n\`Silinme Tarihi:\` <t:${Math.floor(mesaj.silinmeTarihi / 1000)}:R>${mesaj.dosya ? "\n**Atılan mesaj dosya içeriyor**" : ""}`);
        if (mesaj.icerik) embed.addFields([{ name: 'Mesajın İçeriği', value: mesaj.icerik }]);
        let ravgarmisya;
        if (mesaj.icerik) ravgarmisya = mesaj.icerik
        message.channel.send({ embeds: [embed] }).sil(50)
    }
}

module.exports = SnipeK
