
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas")
class Name extends Command {
    constructor(client) {
        super(client, {
            name: "teyitler",
            description: "Sunucu içerisi bir üyenin teyit sayısını gösterir.",
            usage: "teyitler @ravgar/ID",
            category: "Register",
            aliases: ["teyit", "kayıtlar", "kayıtsayı", "kayitsayi"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!ravgar?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}teyitler <@ravgar/ID>\`` }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        let teyit = await User.findOne({ userID: member.id }) || [];
        let teyitBilgisi;
        if (teyit.Confs) {
            let erkekTeyit = teyit.Confs.filter(v => v.Gender === "man").length
            let kizTeyit = teyit.Confs.filter(v => v.Gender === "woman").length
            teyitBilgisi = `${member} toplam **${erkekTeyit + kizTeyit}** kayıt yapmış! (**${erkekTeyit}** erkek, **${kizTeyit}** kadın)\n`;
        } else {
            teyitBilgisi = `${member} isimli kişinin teyit bilgisi bulunamadı.`
        }
        message.channel.send({ embeds: [embed.setDescription(`${teyitBilgisi}`)] });
    }
}

module.exports = Name