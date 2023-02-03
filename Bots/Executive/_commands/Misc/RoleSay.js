
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { ChannelType, PermissionsBitField } = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "rolsay",
            description: "Sunucu içerisi detaylı bir rolü saymanızı sağlar.",
            usage: "rolsay <Role/ID>",
            category: "Misc",
            aliases: ["rolsay", "rs", "rolesay"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name.match(new RegExp(args.join(' '), 'gi')));
        if (!args[0] || !role || role.id === message.guild.id) return message.channel.send({ embeds: `__Hata__: Belirtilen rol bulunamadı yada rol numarası geçersiz.` }).sil(20)
        message.channel.send(`Rol: ${role.name} | ${role.id} (${role.members.size < 1 ? 'Bu rolde hiç üye yok!' : role.members.size})`, { code: 'xl' });
        message.channel.send(role.members.array().map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });
    }
}

module.exports = Say
