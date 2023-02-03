
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Invites, messageUser, messageUserChannel, voiceUser, voiceUserChannel, User, Upstaff, voiceJoinedAt } = require("../../../../Global/Settings/Schemas");
const { ContextMenuCommandBuilder } = require("discord.js");
class MyRank extends Command {
    constructor(client) {
        super(client, {
            name: "veriler",
            description: "Sunucu içerisi detaylı yükseltim bilgilerinizi gösterir.",
            usage: "veriler",
            category: "Stat",
            aliases: ["yetkim", "görevler", "sorumluluk", "yetkilerim", "verilerim", "ystat"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        if (ravgar?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (ravgar?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`ravgar#3210\` ile iletişime geçin!` }).sil(80);
        if (!ravgar?.registerHammer.some(oku => member.roles.cache.has(oku))) return message.channel.send({ content: `\`Hata:\` Bu üye bir yetkili değil!` }).sil(10);
        
        //COIN DATA
        let upData = await Upstaff.findOne({ guildID: message.guild.id, userID: member.id });
        const maxValue = ravgar?.staffRanks[ravgar?.staffRanks.indexOf(ravgar?.staffRanks.find((x) => x.coin >= (upData ? Math.floor(upData.coin) : 0)))] || ravgar?.staffRanks[ravgar?.staffRanks.length - 1];
        let currentRank = ravgar?.staffRanks.filter(x => (upData ? Math.floor(upData.coin) : 0) >= x.coin);
        currentRank = currentRank[currentRank.length - 1];

        //REGISTER COIN
        let teyit = await User.findOne({ userID: member.id }) || [];
        let ety = teyit?.Confs.filter(v => v.Gender === "man").length
        let kty = teyit?.Confs.filter(v => v.Gender === "woman").length
        let kpuan = ety + kty * ravgar?.registerCoin || 0

        //INVITE COIN
        let idata = await Invites.findOne({ guildID: message.guild.id, inviterID: member.id })
        let ipuan = idata?.regular + idata?.bonus * ravgar?.inviteCoin || 0

        //VOICE / MESSAGE
        let mpuan = upData?.messageStat * ravgar?.messageCoin || 0
        let vpuan = upData?.voiceStat * ravgar?.voiceCoin || 0

        const seen = await voiceUser.findOne({ userID: member.id });

        //AUTH DATA

        const authData = await User.findOne({ userID: member.id })



        let sayfa = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("bir").setEmoji("992492309302218802").setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId("iki").setEmoji("996521193383407746").setStyle(Discord.ButtonStyle.Primary)
        )

        let yetkim = await message.channel.send({
            components: [sayfa],
            embeds: [embed.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }) }).setDescription(`
\`>\` ${member} Üyesinin puan tablosu;

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Toplam Puan  \`**${upData?.coin ? Math.floor(upData?.coin) : "0"}**
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Rol Sırası   \`**0**

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Kayıt Puan   \`**${kpuan}** (${ety + kty})
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Davet Puan   \`**${ipuan}** (${idata?.regular + idata?.bonus})
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Mesaj Puan   \`**${mpuan}** 
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Ses Puan     \`**${vpuan}**
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Görev Puan   \`**${upData?.ToplamPuan ? upData?.ToplamPuan : "0"}**

${progresss(upData ? Math.floor(upData?.coin) : 0, maxValue.coin, 5, message)} \`${upData ? Math.floor(upData.coin) : 0} / ${maxValue.coin}\`
${currentRank ? `${currentRank !== ravgar?.staffRanks[ravgar?.staffRanks.length - 1] ? `${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne \`${Math.floor(maxValue.coin - upData.coin)}\` Puan kaldı!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz."}` : `${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne \`${maxValue.coin - (upData ? Math.floor(upData.coin) : 0)}\` Puan Kaldı!`}
`)]
        })

        var filter = (button) => button.user.id === message.member.id;
        let collector = await yetkim.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (button) => {
            button.deferUpdate();
            if (button.customId == "bir") {
                if (yetkim) yetkim.edit({
                    embeds: [embed]
                })
            } 
            if (button.customId == "iki") {
                if (yetkim) yetkim.edit({
                    embeds: [new Discord.EmbedBuilder().setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }) }).setFooter({ text: "Created © by Ravgar.", iconURL: client.user.avatarURL({ dynamic: true }) }).setDescription(`
\`>\` ${member} Üyesinin görev ve sorumluluk tablosu;

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Yetki Süresi               \`**${authData?.Auth ? `${message.guild.members.cache.get(authData?.AuthAuth) ? `<@${authData?.AuthAuth}> (<t:${Math.floor(authData?.AuthDate / 1000)}:R>)` : `<@${client.user.id}> (<t:${Math.floor(authData?.AuthDate / 1000)}:R>)`}` : "Veri çekilemedi!"}**
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Son Ses Aktifliği          \`${seen?.lastSeen ? `<t:${String(seen?.lastSeen).slice(0, 10)}:R>` : "**Bulunamadı!**"}

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Görevi                     \`**${upData?.Gorev ? upData?.Gorev : "Görevin Yok!"}** (${upData?.GorevAdet ? upData?.GorevAdet : ""})
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Sorumluluğu                \`**${upData?.Sorumluluk ? upData?.Sorumluluk : "Sorumluluğun Yok!"}**

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Görev İlerlemen            \` ${upData?.Gorev ? `${progresss(upData?.YapilanGorev ? upData?.YapilanGorev : 0, upData?.GorevAdet, 5, message)} (${upData?.YapilanGorev ? `${upData?.YapilanGorev} / ${upData?.GorevAdet} ` : `0 / ${upData?.GorevAdet}` })` : ""} 
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Sorumluluk İlerlermen      \` ${upData?.Sorumluluk ? `${progresss(upData?.YapilanSorumluluk ? upData?.YapilanSorumluluk : 0, upData?.SorumlulukAdet, 5, message)} (${upData?.YapilanSorumluluk ? `${upData?.YapilanSorumluluk} / ${upData?.SorumlulukAdet} ` : `0 / ${upData?.SorumlulukAdet}` })` : ""} 

${message.guild.findEmoji(system.Emojis.Nokta)} \`   Toplam Yaptığın Görev      \`**${upData?.ToplamGorev ? upData?.ToplamGorev : "0"}**
${message.guild.findEmoji(system.Emojis.Nokta)} \`   Toplam Yaptığın Sorumluluk \`**${upData?.ToplamSorumluluk ? upData?.ToplamSorumluluk : "0"}**
                   
                    `)] })
            }
        })

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                sayfa.components[0].setDisabled(true)
                sayfa.components[1].setDisabled(true)
                if (yetkim) yetkim.edit({ components: [sayfa] })
            }
        })
    }
}

function progresss(value, maxValue, size, message) {
    let fills = message.guild.emojis.cache.find(x => x.name == "doluBar")
    let emptys = message.guild.emojis.cache.find(x => x.name == "bosBar")
    let fillStarts = message.guild.emojis.cache.find(x => x.name == "baslangicBar")
    let emptyEnds = message.guild.emojis.cache.find(x => x.name == "bosBitisBar")
    let fillEnds = message.guild.emojis.cache.find(x => x.name == "doluBitisBar")

    let fill = `<:` + fills.name + `:` + fills.id + `>`
    let empty = `<:` + emptys.name + `:` + emptys.id + `>`
    let fillStart = `<:` + fillStarts.name + `:` + fillStarts.id + `>`
    let emptyEnd = `<:` + emptyEnds.name + `:` + emptyEnds.id + `>`
    let fillEnd = `<:` + fillEnds.name + `:` + fillEnds.id + `>`

    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;

    const progressText = fill.repeat(progress);
    const emptyProgressText = empty.repeat(emptyProgress);

    return emptyProgress > 0 ?
        fillStart +
        progressText + emptyProgressText +
        emptyEnd
        : fillStart +
        progressText + emptyProgressText +
        fillEnd;
};
module.exports = MyRank