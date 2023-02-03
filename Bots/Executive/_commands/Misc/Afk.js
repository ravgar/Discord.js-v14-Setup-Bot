
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Afk } = require("../../../../Global/Settings/Schemas")
class AFK extends Command {
    constructor(client) {
        super(client, {
            name: "afk",
            description: "Sunucu içerisi afk olmanızı sağlar.",
            usage: "afk <Sebep>",
            category: "Misc",
            aliases: ["afk"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
        client.on("messageCreate", async (message) => {
            if (!message.guild || message.author.bot || !message.channel || message.channel.type != 0) return;
            let GetAfk = await Afk.findById(message.member.id);
            if (message.mentions.users.size >= 1) {
                let victim = message.mentions.users.first();
                let victimData = await Afk.findById(victim.id);
                if (victimData) {
                    if (GetAfk) {
                        await Afk.findByIdAndDelete(message.member.id)
                        message.react(message.guild.findEmoji(system.Emojis.Iptal))
                    }
                    return message.channel.send({ content: `${victim} adlı üye \`${victimData.reason ? `${victimData.reason}\` sebebiyle` : "Yakında geleceğim!"} <t:${Math.floor(victimData.date / 1000)}:R> AFK moduna geçti!` }).sil(20);
                };
            };
            let victim = message.member;
            let victimData = await Afk.findById(victim.id);
            if (!GetAfk) return;
            await Afk.findByIdAndDelete(message.member.id)
            message.channel.send({ content: `${message.author} AFK modundan çıktı! Tekrar hoş geldin! \`${victimData.reason ? `${victimData.reason}` : "Yakında geleceğim!"}\` sebebiyle AFK olmuştu!` }).sil(20)
        });
    }

    async onRequest(client, message, args, embed, ravgar) {
        let GetAfk = await Afk.findById(message.member.id);
        if (GetAfk) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} AFK durumdayken tekrardan AFK olamazsın ${message.member}!` }).sil(20);
        let sebep = args.join(' ') || `En Yakın Zamanda Döneceğim!`;
        await Afk.updateOne({ _id: message.member.id }, { $set: { "date": Date.now(), "reason": sebep } }, { upsert: true }).exec();
        message.react(message.guild.findEmoji(system.Emojis.Onay))
    }
}

module.exports = AFK
