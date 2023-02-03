
const { Command } = require("../../../../Global/Structures/Default.Commands");
class EmojiCreate extends Command {
    constructor(client) {
        super(client, {
            name: "emoji",
            description: "Sunucu içerisi emoji oluşturmanızı!",
            usage: "emoji <Emoji>",
            category: "Founders",
            aliases: ["emote"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!ravgar?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let requestedEmojis = args;
        if (requestedEmojis.length == 1) {
            requestedEmojis = requestedEmojis[0].match(/<a?:\w+:\d{18}>/g)
        }
        requestedEmojis = requestedEmojis.filter(x => x.startsWith("<") && x.endsWith(">"))
        if (requestedEmojis.length > 10) return message.channel.send({ content: `Dostum tek seferde en fazla 10 emoji ekleyebilirsin!` }).sil(20)
        let start = Date.now();
        requestedEmojis.map(async (emoji) => {
            let parsed = Discord.Util.parseEmoji(emoji)
            if (parsed.animated) {
                let reqEmoji = `https://cdn.discordapp.com/emojis/${parsed.id}.gif?v=1`
                message.guild.emojis.create({ name: (parsed.name), attachmen: reqEmoji })
                    .then(ravgar => {
                        message.channel.send(`\`${ravgar.name}\` isimli emoji oluşturuldu! (${ravgar.toString()})`);
                    }).catch(e => message.channel.send({ content: `Bir hata oluştu! Lütfen \`Ravgar\` ile iletişime geçiniz!` }) && console.log(e))
            }
            if (parsed.animated == false) {
                let reqEmoji = `https://cdn.discordapp.com/emojis/${parsed.id}.png?v=1`
                message.guild.emojis.create({ name: (parsed.name), attachmen: reqEmoji })
                message.guild.emojis.create({ name: (parsed.name), attachmen: reqEmoji })
                    .then(ravgar => {
                        message.channel.send(`\`${ravgar.name}\` isimli emoji oluşturuldu! (${ravgar.toString()})`);
                    }).catch(e => message.channel.send({ content: `Bir hata oluştu! Lütfen \`Ravgar\` ile iletişime geçiniz!` }) && console.log(e))
            }
        })
        message.channel.send({ content: `${requestedEmojis.length} adet emoji **${Date.now() - start}** milisaniye içerisinde yüklenecek!` })

    }
}

module.exports = EmojiCreate

