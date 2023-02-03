
const { Command } = require("../../../../Global/Structures/Default.Commands");
class AuthSay extends Command {
    constructor(client) {
        super(client, {
            name: "ysay",
            description: "Sunucu içerisi seste olmayan yetkilieri sayar!",
            usage: "ysay",
            category: "Moderation",
            aliases: ["yetkilisay", "yetkilises"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar, c) {
        if (!ravgar?.banHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let sesdeolmayanlar = message.guild.members.cache.filter(y => ravgar?.registerHammer.some(x => y.roles.cache.has(x))).filter(ys => !ys.voice.channel && ys.presence && ys.presence.status != "offline")
        message.channel.send({ content: `Sesde olmayan yetkililer (${sesdeolmayanlar.size}); \n\n${sesdeolmayanlar.map(y => `${y}`).join(', ')}` })

    }
}

module.exports = AuthSay

