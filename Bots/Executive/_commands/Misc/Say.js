
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { ChannelType, PermissionsBitField } = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucu içerisi detaylı bilgileri öğrenmenizi sağlar.",
            usage: "say",
            category: "Misc",
            aliases: ["sy"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const detay = new Discord.ButtonBuilder().setCustomId("detayses").setLabel("Detaylı Bilgi").setEmoji("1048697177737809991").setStyle(Discord.ButtonStyle.Primary).setDisabled(false);
        const row = new Discord.ActionRowBuilder().addComponents([detay])
        let say = await message.channel.send({
            components: [row], embeds: [embed.setDescription(`
Sunucumuzda toplam ${global.numberEmojis(message.guild.memberCount)} kişi bulunmakta.
Sunucumuz da ${global.numberEmojis(message.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size)} aktif kişi bulunmakta.       
Ses kanallarında ${global.numberEmojis(message.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b))} adet kullanıcı bulunmaktadır.
Toplam ${global.numberEmojis(message.guild.members.cache.filter(x => ravgar?.tags.some(tag => x.user.tag.includes(tag))).size)} taglı üyemiz bulunmakta! 
`)]
        })
        var filter = (button) => button.user.id === message.author.id;
        const collector = say.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            button.reply({
                embeds: [embed.setDescription(`
> Yapım Aşamasında...

> İletişim İçin ravgar#0001`)]
            })
        })
    }
}

module.exports = Say
