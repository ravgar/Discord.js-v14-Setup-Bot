
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Booster extends Command {
    constructor(client) {
        super(client, {
            name: "booster",
            description: "Sunucu içerisi isim değişmenizi sağlar.",
            usage: "booster <Isim>",
            category: "Misc",
            aliases: ["booster", "zengin"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!message.member.roles.cache.has(ravgar?.boosterRole)) return message.channel.send({ content: `İsim değiştirmek için booster olmanız gerekmekte!` }).sil(20)
        let isim = args.join(' ');
        if (!isim) return message.channel.send({ content: `Lütfen bir isim belirleyiniz!  __Örn:__  \`.booster <Belirlenen Isim> Max: 32 Karakter!\``}).sil(20)
        yazilacakIsim = `${ravgar?.tags.some(x => message.member.user.username.includes(x)) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} ${isim}`;
        if (member.manageable) {
            message.react(message.guild.findEmoji(system.Emojis.Onay))
            message.member.setNickname(`${yazilacakIsim}`)
        } else { 
            message.channel.send({ content: system.Replys.UpStaff })
        }
    }
}

module.exports = Booster
