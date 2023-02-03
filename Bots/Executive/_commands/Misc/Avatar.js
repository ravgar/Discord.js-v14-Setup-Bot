
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Sunucu içerisi bir kişinin avatarına bakmanızı sağlar.",
            usage: "avatar <ravgar/ID>",
            category: "Misc",
            aliases: ["av", "banner", "avatar"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avatar = member.user.avatarURL({ dynamic: true, size: 2048 });
        message.channel.send({ content: `[${member}] kişisinin avatarı`, embeds:[embed.setImage(avatar)] })
    }
}

module.exports = Avatar
