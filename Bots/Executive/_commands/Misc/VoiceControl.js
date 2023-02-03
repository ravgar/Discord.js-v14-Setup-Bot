
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { voiceJoinedAt } = require("../../../../Global/Settings/Schemas")
class VoiceControl extends Command {
    constructor(client) {
        super(client, {
            name: "nerede",
            description: "Sunucu içerisi bir üyenin ses kanalını gösterir.",
            usage: "nerede @ravgar/ID",
            category: "Misc",
            aliases: ["n", "seskontrol"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send({ content: `Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`.n @ravgar/ID\`` }).sil(20)
        if (!member.voice.channel) return message.channel.send({ content: `Bilgi: ${member}, (\`${member.id}\`) bir ses kanalında aktif değil.` }).sil(20)
        let joinedAtData = await voiceJoinedAt.findOne({ userID: member.id });
        let selfM = member.voice.selfMute ? `${message.guild.findEmoji(system.Emojis.MicOff)}` : `${message.guild.findEmoji(system.Emojis.MicOn)}`;
        let selfD = member.voice.selfDeaf ? `${message.guild.findEmoji(system.Emojis.DeafOff)}` : `${message.guild.findEmoji(system.Emojis.DeafOn)}`;
        let selfV = member.voice.selfVideo ? `${message.guild.findEmoji(system.Emojis.CamOn)}` : `${message.guild.findEmoji(system.Emojis.CamOff)}`
        let selfS = member.voice.streaming ? `${message.guild.findEmoji(system.Emojis.StreamOn)}` : `${message.guild.findEmoji(system.Emojis.StreamOff)}`
        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Member)} ${member}, (\`${member.id}\`) adlı kullanıcı şu anda \`${message.guild.channels.cache.get(member.voice.channelId).name}\` adlı ses kanalında ayrıca mikrofonu **${selfM}**, kulaklığı **${selfD}**, kamerası **${selfV}**, yayını **${selfS}** durumda. (<t:${Math.floor(joinedAtData.date / 1000)}:R>)` }).sil(300)
     
    }
}

module.exports = VoiceControl
