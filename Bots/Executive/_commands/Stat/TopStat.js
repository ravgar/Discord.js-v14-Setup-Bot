
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Invites, messageGuild, messageGuildChannel, voiceGuild, voiceGuildChannel, messageUser, voiceUser, User, Economy } = require("../../../../Global/Settings/Schemas")
class TopStat extends Command {
    constructor(client) {
        super(client, {
            name: "topstat",
            description: "Sunucu içerisi detaylı en yüksek istatistikleri gösterir.",
            usage: "stat",
            category: "Stat",
            aliases: ["topistatistik", "topinvite", "topinvites", "topcoin", "top"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('topstatdetay')
                    .setPlaceholder('🔝 Detaylı bilgi almak için tıkla!')
                    .addOptions([
                        {
                            label: 'Invite Bilgileri',
                            description: `${message.guild.name} top invite bilgileri!`,
                            value: 'invitebilgi',
                        },
                        {
                            label: 'Coin Bilgileri',
                            description: `${message.guild.name} top coin bilgileri!`,
                            value: 'coinbilgi',
                        },
                        {
                            label: 'Teyit Bilgieri',
                            description: `${message.guild.name} top teyit bilgileri!`,
                            value: 'teyitbilgi'
                        },
                    ]),
            );

        const messageChannelData = await messageGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
        const voiceChannelData = await voiceGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
        const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
        const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });

        const weeklyLeaderMessage = await messageUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });
        const weeklyLeaderVoice = await voiceUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });


        const messageChannels = messageChannelData.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}`}.\` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join(`\n`);
        const voiceChannels = voiceChannelData.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join(`\n`);
        const messageUsers = messageUsersData.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join(`\n`);
        const voiceUsers = voiceUsersData.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join(`\n`);

        const oneLeaderMessage = weeklyLeaderMessage.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 1).map((x, index) => `<@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join(`\n`);
        const oneLeaderVoice = weeklyLeaderVoice.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 1).map((x, index) => `<@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join(`\n`);



        const topstat = await message.channel.send({
            components: [row], embeds: [
                embed.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
                    .setDescription(`
**${message.guild.name}** Sunucusunun toplam istatistikleri;

\`👑\` Haftanın Mesaj Lideri: ${oneLeaderMessage ? oneLeaderMessage : "Statler hesaplanamadı!"}
\`👑\` Haftanın Ses Lideri: ${oneLeaderVoice ? oneLeaderVoice : "Statler hesaplanamadı!"}

• **Mesaj İstatisikleri;**
Toplam Mesaj İstatistiği : \`${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`
Haftalık Mesaj İstatistiği : \`${Number(messageGuildData ? messageGuildData.weeklyStat : 0).toLocaleString()} mesaj\`

• **İlk 5 Üye;**
${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}
**───────────────**
• **İlk 5 Kanal;**
${messageChannels.length > 0 ? messageChannels : "Veri Bulunmuyor."}

**───────────────**
• **Ses İstatisikleri;**
Toplam Ses İstatistiği : \`${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [saat], m [dakika]")}\`
Haftalık Ses İstatistiği : \`${moment.duration(voiceGuildData ? voiceGuildData.weeklyStat : 0).format("H [saat], m [dakika]")}\`

• **İlk 5 Üye;**
${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}
**───────────────**
• **İlk 5 Kanal;**
${voiceChannels.length > 0 ? voiceChannels : "Veri Bulunmuyor."}


`)
            ]
        })

        var filter = (component) => component.user.id === message.author.id;
        const collector = topstat.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (interaction) => {
            interaction.deferUpdate(true)
            if (interaction.customId == "topstatdetay") {
                if (interaction.values[0] == "invitebilgi") {
                    let data = await Invites.find({ guildID: message.guild.id }).sort({ regular: -1 });
                    let list = data.filter((x) => message.guild.members.cache.has(x.inviterID)).splice(0, 15).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` ${message.guild.members.cache.get(x.inviterID).toString()} \`${x.regular + x.bonus} davet\` ${x.inviterID == message.member.id ? `**(Siz)**` : ``}`).join('\n')
                    if (topstat) topstat.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${list}`)] })
                }
                if (interaction.values[0] == "coinbilgi") {
                    const coin = await Economy.find({ }).sort({ coin: -1 })
                    const coinData = coin.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 15).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <@${x.userID}>: \`${x.coin} Coin!\` ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join(`\n`);
                    if (topstat) topstat.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${coinData}`)] })
                }
                if (interaction.values[0] == "teyitbilgi") {
                    //if (!ravgar?.registerHammer.some(x => message.member.roles.cache.has(x))) return await interaction.reply({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Bu listeyi görme izniniz bulunmamakta!`, ephemeral: true })
                    const teyit = await User.find({  }).sort({ TopConfs: -1 });
                    const teyitData = teyit.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 15).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}`}.\` <@${x.userID}> toplam teyitleri \`${x.Confs.filter(v => v.Gender === "man").length + x.Confs.filter(v => v.Gender === "woman").length}\` (\`${x.Confs.filter(v => v.Gender === "man").length || 0}\` erkek, \`${x.Confs.filter(v => v.Gender === "woman").length || 0}\` kadın) ${x.userID == message.member.userID ? `**(Siz)**` : ``}`).join('\n')
                    if (topstat) topstat.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${teyitData}`)] })
                }
            }
        })
        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                row.components[0].setDisabled(true)
                if (topstat) topstat.edit({ components: [row] })
            }
        })
    }
}

module.exports = TopStat
