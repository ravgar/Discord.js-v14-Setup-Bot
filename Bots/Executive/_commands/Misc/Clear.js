
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Clear extends Command {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "Sunucu içerisi sohbet temizlenize yarar.",
            usage: "sil <Sayı>",
            category: "Misc",
            aliases: ["temizle", "sil"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            if (!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.channel.send({ content: "Hata: 1-100 arasında silinecek mesaj miktarı belirtmelisin!" }).sil(20)
            message.channel.bulkDelete(Number(args[0])).then(x => message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarıyla <#${message.channel.id}> (\`${message.channel.id}\`) adlı kanal da (**${x.size}**) adet mesaj silindi!` }).sil(20));
        } else {
            let mesajlar = await message.channel.messages.fetch({ limit: 100 });
            mesajlar = mesajlar.array();
            mesajlar = mesajlar.filter((e) => e.author.id === member.id);
            if (mesajlar.length > args[1]) {
                mesajlar.length = parseInt(args[1], 10);
            }
            mesajlar = mesajlar.filter((e) => !e.pinned);
            args[1]++;
            message.channel.bulkDelete(mesajlar, true);
            if (member) {
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarıyla <#${message.channel.id}> (\`${message.channel.id}\`) adlı kanal da ${member} (\`${member.id}\`) kişisine ait (**${mesajlar.length}**) adet mesaj silindi!` }).sil(20);
            }
        }
    }
}

module.exports = Clear
