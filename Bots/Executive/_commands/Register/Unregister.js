
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas")
class Name extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            description: "Sunucu içerisi bir üyeyi kayıtsıza atmanızı sağlar.",
            usage: "kayıtsız @ravgar/ID",
            category: "Register",
            aliases: ["ks", "kayitsiz", "unregister", "ur"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!ravgar?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}ks <@ravgar/ID>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (ravgar?.unregisterRoles.some(x => member.roles.cache.has(x))) return message.channel.send({ content: system.Replys.Registered }).sil(20)
        await member.setRoles(ravgar?.unregisterRoles).catch(err => { })
        await member.setNickname(`${ravgar?.tags.some(x => member.user.tag.includes(x)) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} İsim | Yaş`)
        message.react(message.guild.findEmoji(system.Emojis.Onay))
        message.channel.send({ content: `Başarılı bir şekilde ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) kişisi tarafından kayıtsıza atıldı! ${message.guild.findEmoji(system.Emojis.Onay)}` }).sil(100)
        message.guild.findChannel("register-log").send({ embeds: [
            embed.setDescription(`
\`>\` Sunucuda bir üye kayıtsıza atıldı! ${message.guild.findEmoji(system.Emojis.Iptal)}

Kayıtsıza atan kişi : ${message.member} (\`${message.member.id}\`)
Kayıtsıza atılan kişi : ${member} (\`${member.id}\`) 
`)
        ]})
    }
}

module.exports = Name