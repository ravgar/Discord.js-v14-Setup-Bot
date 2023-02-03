const { Event } = require("../../../../Global/Structures/Default.Events");
class MessageDelete extends Event {
    constructor(client) {
        super(client, {
            name: "messageDelete",
            enabled: true,
        });
    }

    async onLoad(message) {
        if (message.author.bot || message.channel.type != 0) return;
        message.guild.channels.cache.find(x => x.name == "message-log").send({
            embeds: [new Discord.EmbedBuilder().setDescription(`
${message.author.tag} (\`${message.member.id}\`) kişisi bir mesaj sildi!
Kanal : ${message.channel.name} (\`${message.channel.id}\`)
Silinme Zamanı : <t:${Math.floor(Date.now() / 1000)}:R>
Silinen Mesaj ;

\`\`\`${message.content}\`\`\`
        `)
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL({ dynamic: true, size: 1024 })
                })
                .setThumbnail(message.author.avatarURL())
            ]
        })


    }
}

module.exports = MessageDelete;