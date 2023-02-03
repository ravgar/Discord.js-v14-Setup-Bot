
const { Command } = require("../../../../Global/Structures/Default.Commands");
class AddRank extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            description: "Sunucu içerisi upstaff için yetki eklemenizi sağlar.",
            usage: "veriler",
            category: "Stat",
            aliases: ["yetki"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (ravgar?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        const coinDatas = await ravgarcik.findOne({ guildID: message.guild.id })
        const vcoin = args[1];
        if (["ekle", "add"].includes(args[0])) {
            if (!vcoin || isNaN(vcoin)) return message.channel.send({ content: `\`Hata:\` Eklenecek coin miktarını belirtmelisin!` }).sil(100)
                if (ravgar?.staffRanks.some((x) => x.coin == vcoin)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** \`${vcoin}\` coinine ulaşıldığında verilecek roller zaten ayarlanmış!`)] }).sil(30)
                const roles = [...message.mentions.roles.values()];
                if (!roles || !roles.length) return message.reply({ embeds: [embed.setDescription("Eklenecek yetkinin rol(leri) belirtmelisin!")] });
                await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { staffRanks: { role: roles.map((x) => x.id), coin: parseInt(vcoin) } } }, { upsert: true })
                message.channel.send({ embeds: [embed.setDescription(`${vcoin} coine ulaşıldığında verilecek roller ayarlandı! \nVerilecek Roller: ${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] });
        }
        if (["sil", "temizle"].includes(args[0])) {
            if (!vcoin || isNaN(vcoin)) return message.reply({ embeds: [embed.setDescription("Silinecek yetkinin coinini belirtmelisin!")] }).sil(100)
            if (!coinDatas.staffRanks.map((x) => x.coin == vcoin)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** \`${vcoin}\` coinine ulaşıldığında verilecek roller ayarlanmamış!`)] }).sil(30)
            await ravgarcik.findOneAndUpdate({ $pull: { staffRanks: { coin: parseInt(vcoin) } } });
            message.channel.send({ embeds: [embed.setDescription(`${vcoin} coine ulaşıldığında verilecek roller silindi!`)] });
        }
        if (["list", "liste"].includes(args[0])) {
            if (coinDatas.staffRanks) {
                message.channel.send({ embeds: [embed.setDescription(coinDatas.staffRanks.map((x) => `${Array.isArray(x.role) ? x.role.map(x => `<@&${x}>`).join(", ") : `<@&${x.role}>`}: ${x.coin}`).join("\n"))] });
            } else {
                message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Datamda ayarlanmış rol bulamadım!`)] }).sil(40)
            }
        }
    }
}

module.exports = AddRank
