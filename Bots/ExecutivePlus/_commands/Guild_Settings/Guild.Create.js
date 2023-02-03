const { Command } = require("../../../../Global/Structures/Default.Commands");
const { PermissionFlagsBits, ChannelType, PermissionsBitField } = require("discord.js");
const { Upstaff, PrivRoom, Jail, Invites, messageUser, messageUserChannel, voiceUser, voiceUserChannel, messageGuild, messageGuildChannel, voiceGuild, voiceGuildChannel, User, guildPerms, Punitives } = require("../../../../Global/Settings/Schemas")
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const support = new Map();
const loglar = [
    "tp-log",
    "task-log",
    "tag-log",
    "tagged-log",
    "command-log",
    "priv-log",
    "voice-log",
    "mute-log",
    "ban-log",
    "jail-log",
    "rank-log",
    "message-log",
    "guard-log",
    "register-log",
    "bot-logs",
    "auth-log",
    "istek-sikayet-log",
    "basvuru-log"
]
class GuildCreate extends Command {
    constructor(client) {
        super(client, {
            name: "kur",
            description: "Bu komut ile sunucu içi gerekli tüm ayarlamaları kurabilirsin!",
            usage: ".kur",
            category: "Guild",
            aliases: [],
            enabled: true,
        });
    }


    async onLoad(client) {
        client.on("interactionCreate", async (interaction) => {
            const ravgar = await ravgarcik.findOne({ guildID: interaction.guild.id })
            if (interaction.customId == "ozelodaolustur") {
                const st = await PrivRoom.findOne({ userID: interaction.member.id });
                if (st || st?.channelID) return interaction.reply({ content: `Bir odaya sahipken başka bir oda oluşturamazsın!`, ephemeral: true })
                let roomNumber = getRandomInt(1, 1000)
                const OdaAyarlari = new Modal()
                    .setCustomId(`${interaction.member.id}ozelOda_Modal${roomNumber}`)
                    .setTitle('Özel Oda Ayarları;')
                    .addComponents(new TextInputComponent()
                        .setCustomId('ozelOda_name')
                        .setLabel('Özel Odanızın İsmi ;')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(15)
                        .setPlaceholder('Örn: Ravgar Private')
                        .setRequired(true),
                        new TextInputComponent()
                            .setCustomId('ozelOda_limit')
                            .setLabel('Oda limiti')
                            .setStyle('SHORT')
                            .setMinLength(1)
                            .setMaxLength(2)
                            .setPlaceholder('1 - 99 arası')
                            .setRequired(true)
                    );


                showModal(OdaAyarlari, {
                    client: client,
                    interaction: interaction
                });
                client.on('modalSubmit', async (modal) => {
                    if (modal.customId === `${interaction.member.id}ozelOda_Modal${roomNumber}`) {
                        const firstResponse = modal.getTextInputValue('ozelOda_name')
                        const secondResponse = modal.getTextInputValue('ozelOda_limit')
                        let vkat = ravgar.ozelOdaVoice
                        let mkat = ravgar.ozelOdaText
                        let member = modal.member;
                        let guild = client.guilds.cache.get(interaction.guild.id)
                        let everyone = guild.roles.everyone;
                        let voice = await guild.channels.create(
                            {
                                name: `${firstResponse}`,
                                type: ChannelType.GuildVoice,
                                parent: vkat,
                                userLimit: secondResponse,
                                permissionOverwrites: [
                                    {
                                        id: everyone.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel],
                                    },
                                    {
                                        id: member.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.Stream]
                                    }
                                ]
                            })

                        let text = await guild.channels.create(
                            {
                                name: `${firstResponse}`,
                                type: ChannelType.GuildText,
                                parent: mkat,
                                permissionOverwrites: [
                                    {
                                        id: everyone.id,
                                        deny: [PermissionsBitField.Flags.ViewChannel],
                                    },
                                    {
                                        id: member.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            })
                        await modal.deferReply({ ephemeral: true })
                        modal.followUp({ content: `Merhaba! <#${voice.id}> adlı kanalın oluşturuldu! Yönetmen için sana bir de <#${text.id}> kanalını oluşturdum!` })
                        const row = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.SelectMenuBuilder()
                                    .setCustomId('ozelodayonetim')
                                    .setPlaceholder('Kanalı Yönet!')
                                    .addOptions(
                                        { label: 'Kullanıcı Ekle/Çıkar!', value: 'kullaniciekle', emoji: { "id": "1006650789525200987" } },
                                        { label: 'Oda Limiti Değiştir!', value: 'odalimit', emoji: { "id": "1006650793207791787" } },
                                        { label: 'Kanal Adını Değiştir!', value: 'kanaladi', emoji: { "id": "1006650794805821510" } },
                                        { label: 'Kanalı Kapat!', value: 'ozelodakapat', emoji: { "id": "1006650792339574894" } },
                                    ),
                            );
                        text.send({
                            content: `
Merhaba <@${modal.member.id}>! Kanalını <#${voice.id}> yönetmek için aşağıdaki menüyü kullanabilirsin!

Odanda uzun bir süre aktiflik göstermezsen odan silinecektir.

Odana eklediğin tüm kullanıcılar odanı yönetebilir!
                        `, components: [row]
                        })

                        new PrivRoom({
                            userID: modal.member.id,
                            tChannelID: text.id,
                            vChannelID: voice.id,
                        }).save();
                        interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin kişisi kendisine **${firstResponse}** isimli odayı oluşturdu! (Ses Kanalı : <#${voice.id}> - Yönetim Paneli: <#${text.id}> - Kullanıcı Sayısı: ${secondResponse})` })
                    }
                });
            }

            if (interaction.customId == "ozelodayonetim") {
                if (interaction.values[0] == "odalimit") {
                    let limiticinmodal = getRandomInt(1, 1000)
                    const newLimit = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${limiticinmodal}`)
                        .setTitle('Yeni Oda Limiti;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('ozelOda_newLimit')
                                .setLabel('Oda yeni limiti')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(2)
                                .setPlaceholder('1 - 99 arası')
                                .setRequired(true)
                        );


                    showModal(newLimit, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${limiticinmodal}`) {
                            const newLimit = modal.getTextInputValue('ozelOda_newLimit')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                            await channel.v.edit({ userLimit: newLimit })
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalın için limiti ${newLimit} olarak ayarladım!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalının yeni limiti ${newLimit} olarak ayarlandı!` })
                        }
                    })
                }
                if (interaction.values[0] == "kullaniciekle") {
                    let usericinmodal = getRandomInt(1, 1000)
                    const newUser = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${usericinmodal}`)
                        .setTitle('Odaya Eklenecek Kişi;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('kullaniciID')
                                .setLabel('Kullanıcı IDsi')
                                .setStyle('SHORT')
                                .setMinLength(18)
                                .setMaxLength(18)
                                .setPlaceholder('Çıkarmak İstediğiniz Kullanıcı ID')
                                .setRequired(true)
                        );
                    showModal(newUser, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${usericinmodal}`) {
                            const kullanici = modal.getTextInputValue('kullaniciID')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                            await channel.t.permissionOverwrites.edit(kullanici, {id: kullanici.id, allow : [PermissionsBitField.Flags.ViewChannel], id: kullanici.id, deny :[PermissionsBitField.Flags.SendMessages]}).catch(() => { })                            
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalına <@${kullanici}> kişisini başarıyla ekledin!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalına <@${kullanici}> eklendi` })
                        }
                    })
                }
                if (interaction.values[0] == "kanaladi") {
                    let kanalicinmodal = getRandomInt(1, 1000)
                    const newUser = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${kanalicinmodal}`)
                        .setTitle('Yeni Kanal İsmi;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('yenikanal')
                                .setLabel('Yeni Kanal İsmi;')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(18)
                                .setPlaceholder('Yeni Oda İsmi')
                                .setRequired(true)
                        );
                    showModal(newUser, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${kanalicinmodal}`) {
                            const newName = modal.getTextInputValue('yenikanal')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                            await channel.t.permissionOverwrites.edit({ name: newName }).catch(() => { })
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalının yeni ismi \`${newName}\` olarak ayarlandı!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalının ismi \`${newName}\` olarak değiştirildi!` })
                        }
                    })
                }
                if (interaction.values[0] == "ozelodakapat") {
                    let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                    let channel = { v: interaction.guild.channels.cache.get(privateVoiceData.vChannelID), t: interaction.guild.channels.cache.get(privateVoiceData.tChannelID) }
                    interaction.reply({ content: `Odanız **3** saniye içerisinde silinecektir.`, ephemeral: true }).then(() => {
                        setTimeout(async () => {
                            await PrivRoom.deleteOne({ userID: interaction.member.id });
                            await channel.v.delete().catch(() => { });
                            await channel.t.delete().catch(() => { });
                        }, 3000)
                    })
                    interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${interaction.member.id}> kişisinin özel odası kapatıldı!` })
                }
            }
            if (interaction.customId == "suphelikontrol") {
                const jcezakontrol = await Jail.findOne({ userID: interaction.member.id })
                if (jcezakontrol) return await interaction.reply({ content: `Jailde olduğunuz için sizi çıkaramıyorum!`, ephemeral: true })
                if ((Date.now() - interaction.member.user.createdTimestamp) > 604800000) {
                    await interaction.reply({ content: 'Hesabınızın oluşturulma tarihi **7** günü geçtiği için kayıtsıza atılıyorsunuz..', ephemeral: true });
                    setTimeout(async () => {
                        await interaction.member.setRoles(ravgar?.unregisterRoles).catch(err => { })
                        await interaction.member.setNickname(`${ravgar?.unTag} İsim | Yaş`)
                    }, 2000)
                } else {
                    let kalan = Date.now() + 604800000 - Date.now()
                    await interaction.reply({ content: `Hesabınızın şüpheliden çıkmak için <t:${Math.floor(kalan / 1000)}:R> süresi kaldı!`, ephemeral: true })
                }
            }
            if (interaction.customId == "kayitsizrolal") {
                await interaction.reply({ content: `Kayıtsız rolünüz üzerinize verildi!`, ephemeral: true })
                await interaction.member.setRoles(ravgar?.unregisterRoles).catch(err => { })
                await interaction.member.setNickname(`${ravgar?.unTag} İsim | Yaş`)
            }

            //UYE PROFILI
            if (interaction.customId == "giristarihi") {
                await interaction.reply({ content: `Sunucuya giriş tarihiniz: <t:${Math.floor(interaction.member.joinedAt / 1000)}:R>`, ephemeral: true })
            }
            if (interaction.customId == "hesaptarihi") {
                await interaction.reply({ content: `Hesabınızın açılış tarihiniz: <t:${Math.floor(interaction.member.user.createdAt / 1000)}:R>`, ephemeral: true })
            }
            if (interaction.customId == "rolliste") {
                await interaction.reply({ content: `Bazı Rolleriniz:\n${interaction.member.roles.cache.size <= 20 ? interaction.member.roles.cache.filter(x => x.name !== "@everyone").map(x => x).join(', ') : `Listelenemedi! (${interaction.member.roles.cache.size})`}`, ephemeral: true })
            }
            if (interaction.customId == "davetbilgi") {
                let idata = await Invites.findOne({ guildID: interaction.guild.id, inviterID: interaction.member.id })
                await interaction.reply({ content: `${idata ? `${interaction.member} isimli üye toplam **${idata.regular + idata.bonus}** davete sahip! (**${idata.regular}** gerçek, **${idata.bonus}** bonus, **${idata.fake}** fake)` : `${interaction.member} üyesinin davet bilgisi bulunamadı!`}`, ephemeral: true })
            }
            if (interaction.customId == "statliste") {
                const messageData = await messageUser.findOne({ guildID: interaction.guild.id, userID: interaction.member.id });
                const Active1 = await messageUserChannel.find({ guildID: interaction.guild.id, userID: interaction.member.id }).sort({ channelData: -1 });
                let messageTop;
                Active1.length > 0 ? messageTop = Active1.splice(0, 10).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."

                const voiceData = await voiceUser.findOne({ guildID: interaction.guild.id, userID: interaction.member.id });
                const Active2 = await voiceUserChannel.find({ guildID: interaction.guild.id, userID: interaction.member.id }).sort({ channelData: -1 });
                let voiceTop;
                Active2.length > 0 ? voiceTop = Active2.splice(0, 10).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : voiceTop = "Veri bulunmuyor."
                await interaction.reply({
                    embeds: [new Discord.EmbedBuilder().setDescription(`
${interaction.member} üyesinin detaylı sunucu içi istatistik bilgileri;
                    
• **Mesaj İstatisikleri;**
Toplam Mesaj İstatistiği : \`${messageData ? messageData.topStat : "0"} mesaj\`
Haftalık Mesaj İstatistiği : \`${messageData ? messageData.weeklyStat : 0} mesaj\`
                    
${messageTop}
**───────────────**
• **Ses İstatisikleri;**
Toplam Ses İstatistiği : \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
Haftalık Ses İstatistiği : \`${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")}\`
                    
${voiceTop}
                    `)], ephemeral: true
                })
            }
            if (interaction.customId == "topstatliste") {
                const messageChannelData = await messageGuildChannel.find({ guildID: interaction.guild.id }).sort({ channelData: -1 });
                const voiceChannelData = await voiceGuildChannel.find({ guildID: interaction.guild.id }).sort({ channelData: -1 });
                const messageUsersData = await messageUser.find({ guildID: interaction.guild.id }).sort({ topStat: -1 });
                const voiceUsersData = await voiceUser.find({ guildID: interaction.guild.id }).sort({ topStat: -1 });
                const messageGuildData = await messageGuild.findOne({ guildID: interaction.guild.id });
                const voiceGuildData = await voiceGuild.findOne({ guildID: interaction.guild.id });

                const weeklyLeaderMessage = await messageUser.find({ guildID: interaction.guild.id }).sort({ weeklyStat: -1 });
                const weeklyLeaderVoice = await voiceUser.find({ guildID: interaction.guild.id }).sort({ weeklyStat: -1 });


                const messageChannels = messageChannelData.splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}`}.\` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join(`\n`);
                const voiceChannels = voiceChannelData.splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join(`\n`);
                const messageUsers = messageUsersData.splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` ${x.userID == interaction.member.id ? `**(Siz)**` : ``}`).join(`\n`);
                const voiceUsers = voiceUsersData.splice(0, 5).map((x, index) => `\`${index == 0 ? `👑` : `${index + 1}.`}\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` ${x.userID == interaction.member.id ? `**(Siz)**` : ``}`).join(`\n`);

                const oneLeaderVoice = weeklyLeaderVoice.splice(0, 1).map((x, index) => `<@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` ${x.userID == interaction.member.id ? `**(Siz)**` : ``}`).join(`\n`);
                const oneLeaderMessage = weeklyLeaderMessage.splice(0, 1).map((x, index) => `<@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` ${x.userID == interaction.member.id ? `**(Siz)**` : ``}`).join(`\n`);

                await interaction.reply({
                    embeds: [new Discord.EmbedBuilder().setDescription(`
**${interaction.guild.name}** Sunucusunun toplam istatistikleri;

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
`)], ephemeral: true
                })
            }
            if (interaction.customId == "isimgecmis") {
                let isimveri = await User.findOne({ userID: interaction.member.id }) || [];
                let isimler = isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${ravgar?.tags[0]} ${value.Name} | ${value.Age}\` (${value.ProInf}) ${value.Author ? "(<@" + value.Author + ">)" : ""}`).join("\n") : "";
                await interaction.reply({ content: `${interaction.member} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n${isimler}`, ephemeral: true })
            }
            if (interaction.customId == "sunucuanlik") {
                await interaction.reply({
                    embeds: [new Discord.EmbedBuilder().setDescription(`
Sunucumuzda toplam ${global.numberEmojis(interaction.guild.memberCount)} kişi bulunmakta.
Sunucumuz da ${global.numberEmojis(interaction.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size)} aktif kişi bulunmakta.       
Ses kanallarında ${global.numberEmojis(interaction.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b))} adet kullanıcı bulunmaktadır.
Toplam ${global.numberEmojis(interaction.guild.members.cache.filter(x => ravgar?.tags.some(tag => x.user.tag.includes(tag))).size)} taglı üyemiz bulunmakta! 
`)], ephemeral: true
                })
            }
            if (interaction.customId == "kayitsiz") {
                await interaction.member.setRoles(ravgar?.unregisterRoles).catch(err => { })
                await interaction.member.setNickname(`${ravgar?.unTag} İsim | Yaş`).catch(err => { })
                await interaction.reply({ content: `Başarılı şekilde kayıtıza geçiş yaptınız!`, ephemeral: true })
            }
            if (interaction.customId == "supclose") {
                interaction.channel.delete().catch(err => { });
                await interaction.reply({ content: `Canlı destek talebiniz kapatılıyor!`, ephemeral: true })
                await support.delete(interaction.member.id);
            }
            if (interaction.customId == "destekpanel") {
                if (interaction.values[0] == "canlidestek") {
                    if (!ravgar?.supportCategory) return await interaction.reply({ content: `Şuanda bu sistem bakımda!`, ephemeral: true })
                    if (support.has(interaction.member.id)) return await interaction.reply({ content: `Zaten bir destek talebiniz bulunmatka!`, ephemeral: true });
                    await interaction.guild.channels.create({
                        name: `${interaction.member.user.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')}-destek`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.member.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            },
                        ]
                    }).then(async c => {
                        await c.setParent(ravgar?.supportCategory);
                        const kapat = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder().setCustomId("supclose").setLabel("KAPAT").setStyle(Discord.ButtonStyle.Danger)
                        )
                        await c.send({ content: `Canlı desteğe bağlanan : ${interaction.member}! Aşağıdaki buton ile canlı desteği kapatabilirsiniz!`, components: [kapat], ephemeral: true })
                        await interaction.reply({ content: `Canlı destek talebiniz açıldı! ${c}!`, ephemeral: true })
                        await support.set(interaction.member.id, { durum: true });
                    })
                }
                if (interaction.values[0] == "isteksikayet") {
                    let istekicin = getRandomInt(1, 1000)
                    const istekSik = new Modal()
                        .setCustomId(`${interaction.member.id}istekSikayet_Modal${istekicin}`)
                        .setTitle('İstek / Şikayet;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('istekSikayet')
                                .setLabel('İstek / Şikayetiniz')
                                .setStyle('LONG')
                                .setPlaceholder('Detaylı Açıklama...')
                                .setRequired(true)
                        );


                    showModal(istekSik, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}istekSikayet_Modal${istekicin}`) {
                            const istekSikayeti = modal.getTextInputValue('istekSikayet')
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! <#${modal.member.id}> \`${istekSikayeti}\` içerikli istek/şikayetin iletildi!` })
                            interaction.guild.channels.cache.find(x => x.name == "istek-sikayet-log").send({ content: `<@${modal.member.id}> kişisinin yeni şikayet/önerisi \`${istekSikayeti}\`! İstek/Şikayetin gönderim tarihi: <t:${Math.floor(Date.now() / 1000)}:R>` })
                        }
                    })
                }
                if (interaction.values[0] == "yetkilibasvuru") {
                    if (!ravgar?.registerHammer) return await interaction.reply({ content: `Şuanda bu sistem bakımda!`, ephemeral: true })
                    let ybasvuruicin = getRandomInt(1, 1000)
                    if (ravgar?.registerHammer.some(x => interaction.member.roles.cache.has(x))) return await interaction.reply({ content: `Zaten yetkili olduğun için başvuru yapamazsın!`, ephemeral: true })
                    let ytbasvuruModals = new Modal().setCustomId(`${interaction.member.id}istekSikayet_Modal${ybasvuruicin}`).setTitle('Yetkili Başvuru Formu').addComponents(
                        new TextInputComponent().setCustomId('isimyas').setLabel('İsmin ve yaşın nedir?').setStyle("SHORT").setPlaceholder('İsim ve yaşınızı girin.').setRequired(true),
                        new TextInputComponent().setCustomId('invite').setLabel('Günde kaç invite yaparsın?').setStyle("SHORT").setPlaceholder('Örnek: 5/10/20').setRequired(true),
                        new TextInputComponent().setCustomId('stat').setLabel('Günlük aktifliğin?').setStyle("SHORT").setPlaceholder('Örnek: 5 Saat/7 Saat/12 Saat').setRequired(true),
                        new TextInputComponent().setCustomId('ex').setLabel('Daha önce bir sunucuda yetkili oldunuz mu?').setStyle("LONG").setPlaceholder(`Örnek: ${interaction.guild.name} Sunucusunda yetkili oldum.`).setRequired(true),
                        new TextInputComponent().setCustomId('about').setLabel('Bize kendin hakkında bilgi verebilir misin?').setStyle("LONG").setPlaceholder(`Örnek: Oyun oynamayı seviyorum, enstrüman çalabiliyorum vb.`).setRequired(true),
                    )


                    showModal(ytbasvuruModals, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}istekSikayet_Modal${ybasvuruicin}`) {
                            let isimyas = modal.getTextInputValue('isimyas');
                            let invite = modal.getTextInputValue('invite');
                            let stat = modal.getTextInputValue('stat');
                            let ex = modal.getTextInputValue('ex');
                            let about = modal.getTextInputValue('about');
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Başvurun yetkililerimize iletildi!` })
                            interaction.guild.channels.cache.find(x => x.name == "basvuru-log").send({
                                content: `
<@${modal.member.id}> (\`${modal.member.id}\`) kişisi yetki başvuru yaptı! Başvurunun gönderim tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`
                                , embeds: [new Discord.EmbedBuilder().setDescription(`
İsim & Yaş: **${isimyas ? isimyas : "Girilmemiş."}**
Günlük Invite: **${invite ? invite : "Girilmemiş."}**
Günlük Aktiflik: **${stat ? stat : "Girilmemiş."}**
Yetkili olduğu sunucular: **${ex ? ex : "Girilmemiş."}**
Hakkında: **${about ? about : "Girilmemiş."}**         
                                `)]
                            })
                        }
                    })
                }
            }
            const upData = await Upstaff.findOne({ userID: interaction.member.id })
            if (interaction.customId == "gorevpanel") {
                if (upData?.GorevDurum == true) return await interaction.reply({ content: `${interaction.guild.findEmoji(system.Emojis.Iptal)} Bir görevi bitirmeden başka bir görev alamazsın!`, ephemeral: true })
                if (interaction.values[0] == "tagligorev") {
                    let tagGorev = getRandomInt(1, 10)
                    await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${tagGorev}\` adet taglı çekme görevi aldın! \`.taglı <ravgar/ID>\` yaparak tagımızı taşıyan kişiler ile bu görevi bitirebilirsin! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                    await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Gorev: `${tagGorev} Adet Taglı Çek!`, GorevAdet: `${tagGorev}`, GorevTip: "Taglı", GorevDurum: true } }, { upsert: true }).exec();
                }
                if (interaction.values[0] == "invitegorev") {
                    let invitegorev = getRandomInt(1, 10)
                    await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${invitegorev}\` adet invite görevi aldın! \`Kendi davetin ile\` arkadaşlarınız davet ederek görevi tamamlayabilirsin! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                    await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Gorev: `${invitegorev} Adet Invite Yap!`, GorevAdet: `${invitegorev}`, GorevTip: "Invite", GorevDurum: true } }, { upsert: true }).exec();
                }
                if (interaction.values[0] == "kayitgorev") {
                    let kayitgorev = getRandomInt(1, 10)
                    await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${kayitgorev}\` adet kayıt görevi aldın! \`Register odalarına\` giriş yaparak aramıza yeni katılan kişileri kayıt edebilir ve görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                    await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Gorev: `${kayitgorev} Adet Kayıt Yap!`, GorevAdet: `${kayitgorev}`, GorevTip: "Kayıt", GorevDurum: true } }, { upsert: true }).exec();
                }
                if (interaction.values[0] == "yetkigorev") {
                    let yetkigorev = getRandomInt(1, 10)
                    await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${yetkigorev}\` adet yetkili görevi aldın! \`Yetkisi olmayan kişileri yetkili yapabilir ve görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                    await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Gorev: `${yetkigorev} Adet Yetkili Çek!`, GorevAdet: `${yetkigorev}`, GorevTip: "Yetkili", GorevDurum: true } }, { upsert: true }).exec();
                }
            }
            if (interaction.customId == "sorumlulukpanel") {
                if (upData?.SorumlulukDurum == true) return await interaction.reply({ content: `${interaction.guild.findEmoji(system.Emojis.Iptal)} Bir sorumluluğu bitirmeden başka bir sorumluluk alamazsın!`, ephemeral: true })
                const voiceData = await voiceUser.findOne({ guildID: interaction.guild.id, userID: interaction.member.id });
                if (interaction.values[0] == "registersorumlu") {
                    if (voiceData?.topStat > 72000000) {
                        let registergorev = getRandomInt(7000000, 7200000)
                        let zaman = moment.duration(registergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` register ses görevi aldın! \`Register odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Register Kanalında Dur!`, SorumlulukAdet: `${registergorev}`, SorumlulukTip: "Register", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else if (voiceData?.topStat > 72000000) {
                        let registergorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(registergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` register ses görevi aldın! \`Register odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Register Kanalında Dur!`, SorumlulukAdet: `${registergorev}`, SorumlulukTip: "Register", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else {
                        let registergorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(registergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` register ses görevi aldın! \`Register odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Register Kanalında Dur!`, SorumlulukAdet: `${registergorev}`, SorumlulukTip: "Register", SorumlulukDurum: true } }, { upsert: true }).exec();
                    }
                }
                if (interaction.values[0] == "streamersorumlu") {
                    if (voiceData?.topStat > 72000000) {
                        let streamergorev = getRandomInt(7000000, 7200000)
                        let zaman = moment.duration(streamergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` streamer ses görevi aldın! \`Streamer odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Streamer Kanalında Dur!`, SorumlulukAdet: `${streamergorev}`, SorumlulukTip: "Streamer", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else if (voiceData?.topStat > 72000000) {
                        let streamergorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(streamergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` streamer ses görevi aldın! \`Streamer odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Dakika Streamer Kanalında Dur!`, SorumlulukAdet: `${streamergorev}`, SorumlulukTip: "Streamer", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else {
                        let streamergorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(streamergorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` streamer ses görevi aldın! \`Streamer odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Streamer Kanalında Dur!`, SorumlulukAdet: `${streamergorev}`, SorumlulukTip: "Streamer", SorumlulukDurum: true } }, { upsert: true }).exec();
                    }
                }
                if (interaction.values[0] == "publicsorumlu") {
                    if (voiceData?.topStat > 72000000) {
                        let publicgorev = getRandomInt(7000000, 7200000)
                        let zaman = moment.duration(publicgorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` public ses görevi aldın! \`Public odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Public Kanalında Dur!`, SorumlulukAdet: `${publicgorev}`, SorumlulukTip: "Public", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else if (voiceData?.topStat > 72000000) {
                        let publicgorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(publicgorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` public ses görevi aldın! \`Public odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Public Kanalında Dur!`, SorumlulukAdet: `${publicgorev}`, SorumlulukTip: "Public", SorumlulukDurum: true } }, { upsert: true }).exec();
                    } else {
                        let publicgorev = getRandomInt(14000000, 14400000)
                        let zaman = moment.duration(publicgorev).format("D [gün], H [saat], m [dakika], s [saniye]")
                        await interaction.reply({ content: `Merhaba ${interaction.member}! Şuan için kendine \`${zaman}\` public ses görevi aldın! \`Public odalarına\` giriş yaparak kulaklık ve mikrofon açık şekilde görevi tamamlayabilirsiniz! Şimdiden kolay gelsin iyi eğlenceler!`, ephemeral: true })
                        await Upstaff.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $set: { Sorumluluk: `${zaman} Public Kanalında Dur!`, SorumlulukAdet: `${publicgorev}`, SorumlulukTip: "Public", SorumlulukDurum: true } }, { upsert: true }).exec();
                    }
                }
            }

            //ADMIN PANEL
            if (interaction.customId == "ytkapat") {
                closeYt();
                await interaction.reply({ content: `Tebrikler! Başarılı bir şekilde sunucudaki tüm yetkileri kapattım!`, ephemeral: true })
            }
            if (interaction.customId == "ytac") {
                const yetkipermler = await guildPerms.findOne({ guildID: system.Guild.ID });
                if (!yetkipermler) return;
                yetkipermler.roller.forEach((permission) => { const roles = interaction.guild.roles.cache.get(permission.rol); if (roles) roles.setPermissions(permission.perm); });
                await guildPerms.deleteMany({})
                await interaction.reply({ content: `Yetkiler başarılı bir şekilde açıldı!`, ephemeral: true })
            }
            if (interaction.customId == "banaf") {
                const banneds = await interaction.guild.bans.fetch()
                await banneds.forEach(async member => {
                    await interaction.guild.members.unban(member.user.id, `[Toplu Ban Affı] - Yetkili: ${interaction.member.id} - ${interaction.member.tag}`)
                    await interaction.reply({ content: `Tüm banlar açılmaya başlandı! Bu işlem biraz zaman alabilir!`, ephemeral: true })
                });
            }
            if (interaction.customId == "siciltemiz") {
                await Punitives.deleteMany({})
                interaction.reply({ content: `Verilerimdeki tüm sicilleri temizledim!`, ephemeral: true })
            }
        })

        client.on("voiceStateUpdate", async (oldState, newState) => {
            const voiceData = await voiceUser.findOne({ guildID: newState.guild.id, userID: newState.id });
            const upData = await Upstaff.findOne({ userID: newState.id })
            const ravgar = await ravgarcik.findOne({ guildID: newState.guild.id })
            if (upData?.SorumlulukDurum == false) return;
            if (oldState.channel.parentId || newState.channel.parentId && ravgar?.publicParents.includes(newState.channel.parentId) || ravgar?.streamerParents.includes(oldState.channel.parentId) && upData?.SorumlulukTip == "Public") {
                if (voiceData?.topStat >= upData?.SorumlulukAdet) {
                    let kazanilan = getRandomInt(50, 100)
                    newState.guild.channels.cache.find(x => x.name == "task-log").send({
                        content: `<@${newState.id}> kişisi ${upData?.Sorumluluk ? upData?.Sorumluluk : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
                    })
                    await Upstaff.findOneAndUpdate({ guildID: newState.guild.id, userID: newState.id }, { $set: { Sorumluluk: ``, SorumlulukAdet: ``, SorumlulukTip: ``, SorumlulukDurum: false } }, { upsert: true }).exec();
                    await Upstaff.updateOne({ guildID: newState.guild.id, userID: newState.id }, { $inc: { coin: kazanilan, ToplamSorumluluk: 1, ToplamPuan: kazanilan } }, { upsert: true });
                }
            } else if (oldState.channel.parentId || newState.channel.parentId && ravgar?.registerParents.includes(newState.channel.parentId) || ravgar?.streamerParents.includes(oldState.channel.parentId) && upData?.SorumlulukTip == "Register") {
                if (voiceData?.topStat >= upData?.SorumlulukAdet) {
                    let kazanilan = getRandomInt(50, 100)
                    newState.guild.channels.cache.find(x => x.name == "task-log").send({
                        content: `<@${newState.id}> kişisi ${upData?.Sorumluluk ? upData?.Sorumluluk : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
                    })
                    await Upstaff.findOneAndUpdate({ guildID: newState.guild.id, userID: newState.id }, { $set: { Sorumluluk: ``, SorumlulukAdet: ``, SorumlulukTip: ``, SorumlulukDurum: false } }, { upsert: true }).exec();
                    await Upstaff.updateOne({ guildID: newState.guild.id, userID: newState.id }, { $inc: { coin: kazanilan, ToplamSorumluluk: 1, ToplamPuan: kazanilan } }, { upsert: true });
                }
            } else if (oldState.channel.parentId || newState.channel.parentId && ravgar?.streamerParents.includes(newState.channel.parentId) || ravgar?.streamerParents.includes(oldState.channel.parentId) && upData?.SorumlulukTip == "Streamer") {
                if (voiceData?.topStat >= upData?.SorumlulukAdet) {
                    let kazanilan = getRandomInt(50, 100)
                    newState.guild.channels.cache.find(x => x.name == "task-log").send({
                        content: `<@${newState.id}> kişisi ${upData?.Sorumluluk ? upData?.Sorumluluk : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
                    })
                    await Upstaff.findOneAndUpdate({ guildID: newState.guild.id, userID: newState.id }, { $set: { Sorumluluk: ``, SorumlulukAdet: ``, SorumlulukTip: ``, SorumlulukDurum: false } }, { upsert: true }).exec();
                    await Upstaff.updateOne({ guildID: newState.guild.id, userID: newState.id }, { $inc: { coin: kazanilan, ToplamSorumluluk: 1, ToplamPuan: kazanilan } }, { upsert: true });
                }
            }
        })

        client.on("ready", async () => {
            const guilds = client.guilds.cache.get(system.Guild.ID)
            const ravgar = await ravgarcik.findOne({ guildID: guilds.id })
            if (!guilds) return;
            setInterval(async () => {
                guilds.channels.cache.filter(a => a.type === ChannelType.GuildVoice && a.parentId === ravgar.ozelOdaVoice).forEach(async a => {
                    if (a.members.size == 0) {
                        const st = await PrivRoom.findOne({ vChannelID: a.id })
                        let channel = { v: guilds.channels.cache.get(st.vChannelID), t: guilds.channels.cache.get(st.tChannelID) }
                        await PrivRoom.deleteOne({ userID: st.userID });
                        await channel.v.delete().catch((e) => { console.log("Ses Kanalı Silinme : " + e) });
                        await channel.t.delete().catch((e) => { console.log("Chat Kanalı Silinme " + e) });
                        guilds.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${st.userID}> kişisinin odasında hiç bir üye bulunmadı için odayı sildim!` })
                    } else return;
                })
            }, 1000 * 60 * 5)
        })
    }

    async onRequest(client, message, args, embed, ravgar) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('kurulum')
                    .setPlaceholder('⚙️ Kurulum yapmak için tıkla!')
                    .addOptions(
                        {
                            label: 'Log Kurulum!',
                            description: `Log Kurulumu Yap!`,
                            value: 'logkurulum',
                            emoji: { "id": "1006650786538856549" }
                        },
                        {
                            label: 'Emoji Kurulum!',
                            description: `Emoji Kurulumu Yap!`,
                            value: 'emojikurulum',
                            emoji: { "id": "998834158036070461" }
                        },
                        {
                            label: 'Özel Oda Kurulum!',
                            description: `Özel Oda Kurulumu Yap!`,
                            value: 'ozelodakurulum',
                            emoji: { "id": "1006650892516347924" }
                        },
                        {
                            label: 'Şüpheli Paneli!',
                            description: `Şüpheli Panel Kurulumu Yap!`,
                            value: 'suphelipanel',
                            emoji: { "id": "894973789169913926" }
                        },
                        {
                            label: 'Karşılama Paneli!',
                            description: `Karşılama Panel Kurulumu Yap!`,
                            value: 'karsilamapanel',
                            emoji: { "id": "986737228120199168" }
                        },
                        {
                            label: 'Üye Profil Paneli!',
                            description: `Üye Profil Paneli Kurulumu Yap!`,
                            value: 'profilpanel',
                            emoji: { "id": "995349693963980860" }
                        },
                        {
                            label: 'Admin Paneli!',
                            description: `Admin Paneli Kurulumu Yap!`,
                            value: 'adminpanel',
                            emoji: { "id": "1019932024758337557" }
                        },
                        {
                            label: 'Görev Paneli',
                            description: `Görev Paneli Kurulumu Yap!`,
                            value: 'görevpanel',
                            emoji: { "id": "1006650790821240843" }
                        },
                    ),
            );
        let kurulum = await message.channel.send({
            components: [row], content: `
Merhaba ${message.author}! Aşağıdaki menüden uygun işlemi seçerek kurulum yapabilirsin!
        ` })
        var filter = (component) => component.user.id === message.author.id;
        const collector = kurulum.createMessageComponentCollector({ filter })
        collector.on('collect', async (interaction) => {
            if (interaction.customId == "kurulum") {
                if (message) message.delete();
                if (kurulum) kurulum.delete();
                if (interaction.values[0] == "logkurulum") {
                    const log = await message.guild.channels.create({
                        name: "A-LOGS",
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [{
                            id: message.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }]
                    });
                    loglar.some(x => {
                        message.guild.channels.create({
                            name: x,
                            type: ChannelType.GuildText,
                            parent: log
                        });
                    })
                    message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde \`Log Kurulumları\` başladı!` }).sil(100)
                }
                if (interaction.values[0] == "emojikurulum") {
                    const emojis = [
                        // Sayılar
                        { name: "sifir", url: "https://cdn.discordapp.com/emojis/826970483999375431.gif", },
                        { name: "bir", url: "https://cdn.discordapp.com/emojis/826970487078518804.gif" },
                        { name: "iki", url: "https://cdn.discordapp.com/emojis/826970487669784627.gif" },
                        { name: "uc", url: "https://cdn.discordapp.com/emojis/826970487607132191.gif" },
                        { name: "dort", url: "https://cdn.discordapp.com/emojis/826970484939554876.gif" },
                        { name: "bes", url: "https://cdn.discordapp.com/emojis/826970487854596156.gif" },
                        { name: "alti", url: "https://cdn.discordapp.com/emojis/826970485425569832.gif" },
                        { name: "yedi", url: "https://cdn.discordapp.com/emojis/826970487384703017.gif" },
                        { name: "sekiz", url: "https://cdn.discordapp.com/emojis/826970487741218816.gif" },
                        { name: "dokuz", url: "https://cdn.discordapp.com/emojis/826970488081219584.gif" },
                        // Gerekli Olanlar
                        { name: "Onay", url: "https://cdn.discordapp.com/emojis/960879855094865940.gif" },
                        { name: "Iptal", url: "https://cdn.discordapp.com/emojis/960879853538799626.gif" },
                        { name: "Nokta", url: "https://cdn.discordapp.com/emojis/1006796255420227625.webp?size=80&quality=lossless" },
                        //Upstaff
                        { name: "doluBar", url: "https://cdn.discordapp.com/emojis/1006958474736959688.webp?size=80&quality=lossless" },
                        { name: "bosBar", url: "https://cdn.discordapp.com/emojis/1006958466641952818.webp?size=80&quality=lossless" },
                        { name: "baslangicBar", url: "https://cdn.discordapp.com/emojis/1003785778683453620.webp?size=80&quality=lossless" },
                        { name: "bosBitisBar", url: "https://cdn.discordapp.com/emojis/992499317472505948.webp?size=80&quality=lossless" },
                        { name: "doluBitisBar", url: "https://cdn.discordapp.com/emojis/996873372904468571.webp?size=80&quality=lossless" },
                    ]
                    emojis.forEach(async (x) => {
                        if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
                        const emoji = await message.guild.emojis.create({ name: x.name, attachment: x.url });
                        message.channel.send({ content: `\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})` });
                    });
                }
                if (interaction.values[0] == "görevpanel") {
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.SelectMenuBuilder()
                                .setCustomId('gorevpanel')
                                .setPlaceholder('Görev Seç!')
                                .addOptions(
                                    { label: 'Taglı Görevi!', value: 'tagligorev', emoji: { "id": "1006650789525200987" } },
                                    { label: 'Invite Görevi!', value: 'invitegorev', emoji: { "id": "1006650793207791787" } },
                                    { label: 'Kayıt Görevi!', value: 'kayitgorev', emoji: { "id": "1006650794805821510" } },
                                    { label: 'Yetki Görevi!', value: 'yetkigorev', emoji: { "id": "987271610757173259" } },
                                ),
                        );
                    const row2 = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.SelectMenuBuilder()
                                .setCustomId('sorumlulukpanel')
                                .setPlaceholder('Sorumluluk Seç!')
                                .addOptions(
                                    { label: 'Register Sorumluluk!', value: 'registersorumlu', emoji: { "id": "1006650789525200987" } },
                                    { label: 'Public Sorumluluk!', value: 'publicsorumlu', emoji: { "id": "1006650793207791787" } },
                                    { label: 'Streamer Sorumluluk!', value: 'streamersorumlu', emoji: { "id": "1006650794805821510" } },
                                ),
                        );
                    message.channel.send({
                        components: [row, row2],
                        embeds: [embed.setDescription(`
Merhaba değerli **${message.guild.name}** üyeleri! Bu panelden kendinize göre görev ve sorumluluk alabilirsiniz. Bu görev ve sorumluluklar sizin yetki atlamanızda çok işinize yarayacak!
                        `)]
                    })
                }
                if (interaction.values[0] == "ozelodakurulum") {
                    interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Özel oda kurulumu başladı. Lütfen biraz bekleyiniz!` }).sil(20)
                    const everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
                    const ozelOda = await message.guild.channels.create({
                        name: `Özel Oda`,
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: ravgar?.womanRoles[0],
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            },
                            {
                                id: ravgar?.manRoles[0],
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            },
                            {
                                id: ravgar?.unregisterRoles[0],
                                deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    }).then(async ravgarmis => await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { ozelOdaVoice: ravgarmis.id } }, { upsert: true }).exec())
                    const ozelOdaText = await message.guild.channels.create({
                        name: `Özel Oda Panel`,
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: ravgar?.womanRoles[0],
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            },
                            {
                                id: ravgar?.manRoles[0],
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            },
                            {
                                id: ravgar?.unregisterRoles[0],
                                deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    }).then(async ravgarmis => await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { ozelOdaText: ravgarmis.id } }, { upsert: true }).exec())

                    const panel = await message.guild.channels.create({
                        name: `ozel-oda-olustur`,
                        type: ChannelType.GuildText,
                        parent: ozelOdaText
                    }).then(async channel => {
                        await channel.setParent(ozelOdaText, { lockPermissions: true })
                        const ozelodas = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder().setCustomId("ozelodaolustur").setLabel("Özel Oda Oluştur").setEmoji("1006650794805821510").setStyle(Discord.ButtonStyle.Primary)
                        )
                        channel.send({
                            components: [ozelodas],
                            embeds: [embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setDescription(`
Merhaba özel oda sistemine hoş geldin! 
                            
Sunucumuzda kendine özel bir ses kanalı oluşturabilir ve otomatik oluşturduğumuz yazı kanalından bu kanalı yönetebilirsin. 
                            
Oda limiti, girebilecek kişileri ve bir çok özelliği açtığımız kanal içerisinden ayarlayabilir ve kendine özel odada istediğin gibi takılabilirsin. 
                            
_Not_ Kanala belirli bir süre boyunca girmezsen kanalın otomatik olarak silinecektir!` )]
                        })
                    });
                }
                if (interaction.values[0] == "suphelipanel") {
                    const suphelibutton = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId(`suphelikontrol`).setLabel("Kontrol Et!").setEmoji("894973789169913926").setStyle(Discord.ButtonStyle.Danger),
                    )
                    message.channel.send({ content: `Merhaba sunucumuzda bu kanalı görebiliyorsanız hesabınız **7** günden önce açılmıştır, hesabınızın şüpheli olmadığını düşünüyorsanız veya kaç gün kaldığını öğrenmek istiyorsanız aşağıdaki butonu kullanabilirsiniz.`, components: [suphelibutton] })
                }
                if (interaction.values[0] == "karsilamapanel") {
                    const karsilamabutton = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId(`kayitsizrolal`).setLabel("Kayıtsız Rolü Al!").setEmoji("986737228120199168").setStyle(Discord.ButtonStyle.Danger),
                    )
                    message.channel.send({ content: `Sunucumuzda bazı zamanlar çok fazla giriş olduğundan dolayı botlar buga girmemek için rol vermeyi durdurmakta. Eğer rol alamadıysanız aşağıdaki butonu kullanarak kna erize kayıtsız rolü alabilir ve teyit kanallarına erişebilirsiniz.`, components: [karsilamabutton] })
                }
                if (interaction.values[0] == "profilpanel") {
                    const profilbutton = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId(`giristarihi`).setLabel("I").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`hesaptarihi`).setLabel("II").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`rolliste`).setLabel("III").setStyle(Discord.ButtonStyle.Primary),
                    )
                    const profilbutton2 = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId(`davetbilgi`).setLabel("IV").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`statliste`).setLabel("V").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`topstatliste`).setLabel("VI").setStyle(Discord.ButtonStyle.Primary),
                    )
                    const profilbutton3 = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId(`isimgecmis`).setLabel("VII").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`sunucuanlik`).setLabel("VIII").setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder().setCustomId(`kayitsiz`).setLabel("IX").setStyle(Discord.ButtonStyle.Primary),
                    )
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.SelectMenuBuilder()
                                .setCustomId('destekpanel')
                                .setPlaceholder('Destek Paneli!')
                                .addOptions(
                                    { label: 'Canlı Destek!', value: 'canlidestek', emoji: { "id": "1006650789525200987" } },
                                    { label: 'İstek Şikayet!', value: 'isteksikayet', emoji: { "id": "1006650793207791787" } },
                                    { label: 'Yetkili başvuru!', value: 'yetkilibasvuru', emoji: { "id": "1006650794805821510" } },
                                ),
                        );
                    await message.channel.send({
                        content: `Merhaba **${message.guild.name}!** Sunucu içerisi kısayol paneline hoş geldin! Yapmak istediğin çoğu işlemi hızlıca aşağıdaki panelden yapabilirsin!

\`I\` Sunucuya giriş tarihinizi gösterir.
\`II\` Hesabınızın açılış tarihini gösterir.
\`III\` Üstünüzdeki rolleri listelemenizi sağlar.

\`IV\` Sunucu içerisi davet bilgilerinizi gösterir.
\`V\` Sunucu içerisi statinizi gösterir.
\`VI\` Sunucu içerisi top stat listesini gösterir.

\`VII\` Sunucu içerisi isim geçmişinizi gösterir.
\`VIII\` Sunucunun anlık istatistiğini gösterir.
\`XI\` Sunucuda kayıtsıza geçiş yapmanızı sağlar.

${system.Emojis.Member} Aşağıdaki menüden farklı destekleri alabilirsiniz.

                        `,
                        components: [profilbutton, profilbutton2, profilbutton3, row]
                    })
                }
                if (interaction.values[0] == "adminpanel") {
                    const row = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId("ytkapat").setLabel("🔐 Yetkileri Kapat").setStyle(Discord.ButtonStyle.Success),
                        new Discord.ButtonBuilder().setCustomId("ytac").setLabel("🔓 Yetkileri Aç").setStyle(Discord.ButtonStyle.Success),
                        new Discord.ButtonBuilder().setCustomId("banaf").setLabel("Ban Affı").setEmoji("961565705940123648").setStyle(Discord.ButtonStyle.Success),
                        new Discord.ButtonBuilder().setCustomId("siciltemiz").setLabel("Sicilleri Temizle").setEmoji("1019932019767128137").setStyle(Discord.ButtonStyle.Success),
                    )
                    message.channel.send({
                        content: `
Merhaba **${message.guild.name}**! Owner paneline hoş geldin! Doğru butonu seçerek işlemlerine devam edebilirsin! 

\`1\` **Yetkileri Kapat** = Sunucudaki tüm yetkileri kapatabilirsin!
\`2\` **Yetkileri Aç** = Sunucuda kapatılan yetkileri geri açabilirsin!
\`3\` **Ban Affı** = Sunucudaki tüm yasaklamaları kaldır!
\`4\` **Sicilleri Temizle** = Tüm üyelerin sicillerini temizlemenizi sağlar!

\`\`\`UNUTMA! YAPTIĞIN İŞLEMLERDE HATA OLMASI DURUMUNDA SORUMLU DEĞİLİZ!\`\`\`
                    `, components: [row]
                    })
                }
            }
        })
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = GuildCreate
