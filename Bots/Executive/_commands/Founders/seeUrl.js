
const { Command } = require("../../../../Global/Structures/Default.Commands");
class URL extends Command {
    constructor(client) {
        super(client, {
            name: "url",
            description: "Sunucu içerisi Url kullanımını görmenizi sağlar!",
            usage: "url",
            category: "Founders",
            aliases: ["urlgor", "vanityurl", "URL"],
            enabled: true,
        });
    }

    async onLoad(client) {
    }

    async onRequest(client, message, args, embed, ravgar) {
        message.guild.fetchVanityData().then(res => {
            message.channel.send({ embeds: [embed.setDescription(`Sunucu özel daveti: **${res.code}** Kullanımı : **${res.uses}**`).setTitle(`Sunucumuzun Özel URL İstatistikleri;`)] })
        })
    }
}

module.exports = URL
