const { Command } = require("../../../../Global/Structures/Default.Commands");
class LogMent extends Command {
    constructor(client) {
        super(client, {
            name: "logmen",
            description: "Bu komut ile sunucu giriş etiketi yapabilirsin.",
            usage: "logmen <Kanal/ID>",
            category: "Guild",
            aliases: ["loginmention", "girişetiket"],
            enabled: true,
        });
    }


    async onLoad(client) {
        client.on("guildMemberAdd", async(member) => {
            const ravgar = await ravgarcik.findOne({ guildID: member.guild.id })
            if (ravgar?.loginMentionChannel.length < 0) return;
            ravgar?.loginMentionChannel.map(x => {
                client.channels.cache.get(x).send({ content: `${member}` }).sil(2);
            })
        })
    }

    async onRequest(client, message, args, embed, ravgar) {
        let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
        if (!channel) return message.channel.send({ 
            content: `
\`\`\`Bir kanal belirtmeyi unuttun! Kanal belirterek ekleme/çıkarma yapabilirsin!\`\`\`

Etiketi olan kanallar ;

${ravgar?.loginMentionChannel.map(x => `<#${x}>`).join("\n")}
        `})
        if (ravgar?.loginMentionChannel.includes(channel.id)) {
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { loginMentionChannel: channel.id } }, { upsert: true })
            await message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde silindi!` }).sil(20);
        } else {
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { loginMentionChannel: channel.id } }, { upsert: true })
            await message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde etiket ayarlandı!` }).sil(20);
        }

    }
}

module.exports = LogMent
