
const { Command } = require("../../../../Global/Structures/Default.Commands");
const Bots = require("../../../DistMain")
class AddAllUserRole extends Command {
    constructor(client) {
        super(client, {
            name: "herkeserolver",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["herkeserolver", "herkeserol", "herkeserols"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
        let length = message.guild.members.cache.filter(x => !x.user.bot && !x.roles.cache.has(rol.id)).size
        if (length <= 0) return message.channel.send({ content: `${message.author} \`Hata!\` Zaten tüm üyeler bu role sahip!` }).sil(20)
        message.channel.send({ content: `${message.author} Tebrikler! ${message.guild.roles.cache.get(rol.id).name} rolü sunucuda bulunan ${length} kişiye dağıtılıyor!` })
        const sayı = Math.floor(length / Bots.length);
        for (let index = 0; index < Bots.length; index++) {
            const bot = Bots[index];
            if (rol.deleted) {
                client._logger.log(`[${rol.id}] - ${bot.user.tag}`);
                break;
            }
            const members = bot.guilds.cache.get(message.guild.id).members.cache.filter(member => !member.roles.cache.has(rol.id) && !member.user.bot).array().slice((index * sayı), ((index + 1) * sayı));
            if (members.length <= 0) return;
            for (const member of members) {
                member.roles.add(rol.id)
            }
        }
    }
}

module.exports = AddAllUserRole
