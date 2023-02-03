
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, Upstaff } = require("../../../../Global/Settings/Schemas")
class Senkron extends Command {
    constructor(client) {
        super(client, {
            name: "senkronize",
            description: "Sunucu içerisi rank sistemini senkronize eder.",
            usage: "senkronize <ravgar/Role>",
            category: "Stat",
            aliases: ["senkron", "senk"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
 
    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!ravgar?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        const coinDatas = await ravgarcik.findOne({ guildID: message.guild.id })
        if (args[0] === "kişi" || args[0] === "user") {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if (!member) return message.reply({ embeds: [embed.setDescription("Bir kullanıcı belirtmelisin!")] }).sil(20)

            if (coinDatas.staffRanks.map(x => member.roles.cache.has(x.role))) {
                let rank = coinDatas.staffRanks.map(x => x.role.some(a => member.role.cache.has(a))); 
                console.log(rank)
                rank = rank[rank.length - 1];
                await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
                message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map(x => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)] });
            } else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
        } else if (args[0] === "role" || args[0] === "rol") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ embeds: [embed.setDescription("Bir rol belirtmelisin!")] });
            if (role.members.length === 0) return message.reply({ embeds: [embed.setDescription("Bu rolde üye bulunmuyor!")] });
            role.members.forEach(async member => {
                if (member.user.bot) return;
                if (coinDatas.staffRanks.map(x => member.roles.cache.has(x.role))) {
                    let rank = coinDatas.staffRanks.forEach(x => member.roles.cache.has(x.role));
                    rank = rank[rank.length - 1];
                    await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
                    message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map(x => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)] });
                } else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
            });
        } else return message.reply({ embeds: [embed.setDescription("Bir argüman belirtmelisin! \`kişi - rol\`")] });
    }
}

module.exports = Senkron
