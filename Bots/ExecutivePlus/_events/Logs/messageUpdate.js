const { Event } = require("../../../../Global/Structures/Default.Events");
class MessageUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "messageUpdate",
            enabled: true,
        });
    }

    async onLoad(oldMessage, newMessage) {
        if (newMessage.author.bot || newMessage.channel.type != 0) return;
        if (oldMessage.content == newMessage.content) return;
        newMessage.guild.channels.cache.find(x => x.name == "message-log").send({
            embeds: [new Discord.EmbedBuilder().setDescription(`
${newMessage.author.tag} (\`${newMessage.member.id}\`) kişisi bir mesaj düzenledi!
Kanal : ${newMessage.channel.name} (\`${newMessage.channel.id}\`)
Silinme Zamanı : <t:${Math.floor(Date.now() / 1000)}:R>

Eski Mesaj ;
\`\`\`${oldMessage.content}\`\`\`

Yeni Mesaj ;
\`\`\`${newMessage.content}\`\`\`
        `)
                .setAuthor({
                    name: newMessage.author.tag,
                    iconURL: newMessage.author.avatarURL({ dynamic: true, size: 1024 })
                })
                .setThumbnail(newMessage.author.avatarURL())
            ]
        })


    }
}

module.exports = MessageUpdate;