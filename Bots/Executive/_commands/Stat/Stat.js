
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Invites, messageUser, messageUserChannel, voiceUser, voiceUserChannel, User, Economy } = require("../../../../Global/Settings/Schemas")
class Stat extends Command {
    constructor(client) {
        super(client, {
            name: "stat",
            description: "Sunucu içerisi detaylı istatistik bilgilerinizi gösterir.",
            usage: "stat",
            category: "Stat",
            aliases: ["me", "istatistik", "invite", "invites", "coin"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('statdetay')
                    .setPlaceholder('👥 Detaylı bilgi almak için tıkla!')
                    .addOptions(
                        {
                            label: 'Invite Bilgileri',
                            description: `${member.user.tag} kişisinin invite bilgileri!`,
                            value: 'invitebilgi',
                        },
                        {
                            label: 'Coin Bilgileri',
                            description: `${member.user.tag} kişisinin coin bilgileri!`,
                            value: 'coinbilgi',
                        },
                    ),
            );

        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let messageTop;
        Active1.length > 0 ? messageTop = Active1.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."

        const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let voiceTop;
        Active2.length > 0 ? voiceTop = Active2.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : voiceTop = "Veri bulunmuyor."

        const coin = await Economy.findOne({ userID: message.member.id });


        let useauths = await User.findOne({ userID: member.id })

        if (ravgar?.banHammer.some(x => member.roles.cache.has(x)) || ravgar?.jailHammer.some(x => member.roles.cache.has(x)) || ravgar?.vmuteHammer.some(x => member.roles.cache.has(x)) || ravgar?.muteHammer.some(x => member.roles.cache.has(x)) || ravgar?.registerHammer.some(x => member.roles.cache.has(x)) || ravgar?.foundingRoles.some(oku => member.roles.cache.has(oku)) || member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            if (useauths) {
                let chatMute = useauths.UseMute || 0
                let voiceMute = useauths.UseVMute || 0
                let ban = useauths.UseBan || 0
                let jail = useauths.UseJail || 0
                let top = chatMute + voiceMute + ban + jail;
                embed.addFields([{ name: `\`>\` Yetki Kullanım Bilgisi:`, value: `\nToplam \`${top}\` yetki komutu kullanmış.\n(**${chatMute}** chat mute, **${voiceMute}** ses mute, **${jail}** jail)\n(**${ban}** yasaklama)` }]);
            }
        }

        const stat = await message.channel.send({
            components: [row], embeds: [
                embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setDescription(`
${member} üyesinin detaylı sunucu içi istatistik bilgileri;

• **Mesaj İstatisikleri;**
Toplam Mesaj İstatistiği : \`${messageData ? messageData.topStat : "0"} mesaj\`
Haftalık Mesaj İstatistiği : \`${messageData ? messageData.weeklyStat : 0} mesaj\`

${messageTop}
**───────────────**
• **Ses İstatisikleri;**
Toplam Ses İstatistiği : \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
Haftalık Ses İstatistiği : \`${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")}\`

${voiceTop}
`)
            ]
        })

        var filter = (component) => component.user.id === message.author.id;
        const collector = stat.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (interaction) => {
            interaction.deferUpdate(true)
            if (interaction.customId == "statdetay") {
                if (interaction.values[0] == "invitebilgi") {
                    let idata = await Invites.findOne({ guildID: message.guild.id, inviterID: member.id })
                    if (stat) stat.edit({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(`
${idata ? `${member} isimli üye toplam **${idata.regular + idata.bonus}** davete sahip! (**${idata.regular}** gerçek, **${idata.bonus}** bonus, **${idata.fake}** fake)` : `${member} üyesinin davet bilgisi bulunamadı!`}
                        `)
                        ]
                    })
                }
                if (interaction.values[0] == "coinbilgi") {
                    if (stat) stat.edit({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(`
${member} kişisinin toplamda \`${coin?.coin ? coin?.coin : "0"}\` coini bulunmakta!
                            `)
                        ]
                    })
                }
            }
        })
        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                row.components[0].setDisabled(true)
                if (stat) stat.edit({ components: [row] })
            }
        })
    }
}

module.exports = Stat
