
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, Upstaff } = require("../../../../Global/Settings/Schemas")
class Tagged extends Command {
    constructor(client) {
        super(client, {
            name: "auth",
            description: "Sunucu içerisi bir kişiyi yetkili belirleminizi sağlar.",
            usage: "yetkili <ravgar/ID>",
            category: "Stat",
            aliases: ["yetki", "yetkili", "yetkiliyap", "yetkiver", "veryetki"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (member == message.member.id) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.ItSelf}` }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}yetkili <@ravgar/ID>\`` }).sil(20)
        if (ravgar?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (ravgar?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`ravgar#3210\` ile iletişime geçin!` }).sil(80);
        if (!ravgar?.registerHammer.some(oku => message.member.roles.cache.has(oku))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoAuth}` }).sil(10);
        if (!ravgar?.tags.some(a => member.user.tag.includes(a))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoTag}` }).sil(20)
        let authed = await User.findOne({ userID: member.id })
        let upData = await Upstaff.findOne({ userID: message.member.id })
        if (authed && authed?.Auth) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} \`Hata:\` Bu üye <@${authed?.AuthAuth}> tarafından <t:${Math.floor(authed?.AuthDate / 1000)}:R> tarihinde taglı olarak belirlenmiş!` }).sil(20);
        if (ravgar?.registerHammer.some(x => member.roles.cache.has(x))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} Bu kişi zaten yetkili!` }).sil(20)
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("onayla").setLabel("✅").setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder().setCustomId("onaylama").setLabel("❌").setStyle(Discord.ButtonStyle.Danger)
        )
        let authMsg = await message.channel.send({ content: `${member} Merhaba! ${message.author} kişisi seni yetkili olarak belirlemek istiyor! Kabul ediyor musun?`, components: [row] });
        var filter = (component) => component.user.id === member.id;
        const collector = authMsg.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (interaction) => {
            if (interaction.customId == "onayla") {
                if (message) message.react(message.guild.findEmoji(system.Emojis.Onay))
                if (authMsg) authMsg.edit({ content: `${message.author}, ${member} kişisi senin yetki isteğini onayladı tebrikler!`, components: [] })
                message.guild.findChannel("auth-log").send({ embeds: [embed.setDescription(`${member} kişisi ${message.author} kişisi tarafından <t:${Math.floor(Date.now() / 1000)}:R> tarihinde yetkili olarak belirlendi!`)] })
                if (upData?.GorevDurum == true && upData?.GorevTip == "Yetkili") {
                    await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: message.member.id }, { $inc: { YapilanGorev: 1 } }, { upsert: true }).exec();
                    if (upData?.YapilanGorev >= upData?.GorevAdet) {
                        let kazanilan = getRandomInt(50, 100)
                        message.guild.channels.cache.find(x => x.name == "task-log").send({
                            content: `${message.member} kişisi ${upData?.Gorev ? upData?.Gorev : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
                        })
                        await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: message.member.id }, { $set: { Gorev: ``, GorevAdet: ``, GorevTip: ``, GorevDurum: false } }, { upsert: true }).exec();
                        await Upstaff.updateOne({ guildID: message.guild.id, userID: message.member.id }, { $inc: { coin: kazanilan, ToplamGorev: 1, ToplamPuan: kazanilan } }, { upsert: true });
                    }
                }
                await User.updateOne({ userID: member.id }, { $set: { "Auth": true, "AuthAuth": message.member.id, "AuthDate": Date.now() } }, { upsert: true }).exec();
                await User.updateOne({ userID: message.member.id }, { $push: { "Auths": { id: member.id, Tarih: Date.now() } } }, { upsert: true }).exec();
                await Upstaff.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: ravgar?.authCoin } }, { upsert: true });
                member.roles.add(ravgar?.registerHammer).catch(err => { })
                member.roles.add(ravgar?.minStaff).catch(err => { })
            }
            if (interaction.customId == "onaylama") {
                if (message) message.react(message.guild.findEmoji(system.Emojis.Iptal))
                if (authMsg) authMsg.edit({ content: `${message.author}, ${member} kişisi senin yetkili isteğini onaylamadı!`, components: [] })
            }
        })
        collector.on("end", async () => {
            if (message) message.react(message.guild.findEmoji(system.Emojis.Iptal))
            if (authMsg) authMsg.delete();
        })
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Tagged
