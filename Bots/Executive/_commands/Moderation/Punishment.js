
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, VMute, Mute, Punitives, Jail } = require("../../../../Global/Settings/Schemas");
const ms = require('ms');
class Mutes extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            description: "Sunucu içerisi bir kişiye ceza atmanızı sağlar.",
            usage: "ceza @ravgar/ID ",
            category: "Moderation",
            aliases: ["chatmute", "voicemute", "vmute", "cmute", "muted", "sustur", "sessustur", "ceza", "jail"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        //if (!ravgar?.mutedRole || !ravgar?.vmutedRole || !ravgar?.muteHammer.length <= 0) return message.channel.send({ content: system.Replys.Data }).sil(20) 
        if (!ravgar?.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.vmuteHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}ceza <@ravgar/ID>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.UpStaff }).sil(20)

        let LimitKontrol = await client.cmuteLimit.get(message.author.id) || 0
        let Limit = 5
        let LimitTaslak = `(${LimitKontrol}/${Limit})`
        if (LimitKontrol >= Limit) {
            client.cmuteSure.set(message.author.id, Date.now())
            client.cmuteLimit.delete(message.author.id)
            return message.react(message.guild.findEmoji(system.Emojis.Iptal))
        }

        let LimitKontrol2 = await client.vmuteLimit.get(message.author.id) || 0
        let Limit2 = 5
        let LimitTaslak2 = `(${LimitKontrol2}/${Limit2})`
        if (LimitKontrol2 >= Limit2) {
            client.vmuteSure.set(message.author.id, Date.now())
            client.vmuteLimit.delete(message.author.id)
            return message.react(message.guild.findEmoji(system.Emojis.Iptal))
        }

        let LimitKontrol3 = await client.jailLimit.get(message.author.id) || 0
        let Limit3 = 5
        let LimitTaslak3 = `(${LimitKontrol3}/${Limit3})`
        if (LimitKontrol3 >= Limit3) {
            client.jailSure.set(message.author.id, Date.now())
            client.jailLimit.delete(message.author.id)
            return message.react(message.guild.findEmoji(system.Emojis.Iptal))
        }
        let ccezakontrol = await Mute.findOne({ userID: member.id })
        let vcezakontrol = await VMute.findOne({ userID: member.id })
        let jcezakontrol = await Jail.findOne({ userID: member.id })
        const cmute = new Discord.ButtonBuilder().setCustomId("chatmute").setLabel(`💬 Chat Mute ${LimitTaslak}`).setStyle(Discord.ButtonStyle.Success)
        const vmute = new Discord.ButtonBuilder().setCustomId("voicemute").setLabel(`🎤 Voice Mute ${LimitTaslak2}`).setStyle(Discord.ButtonStyle.Success)
        const jailb = new Discord.ButtonBuilder().setCustomId("jail").setLabel(`Jail ${LimitTaslak3}`).setEmoji("993134933730152470").setStyle(Discord.ButtonStyle.Success)
        const iptalm = new Discord.ButtonBuilder().setCustomId("iptal").setLabel("İptal").setStyle(Discord.ButtonStyle.Danger)
        if (!ravgar?.vmuteHammer.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            vmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }
        if (!ravgar?.muteHammer.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            cmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }
        if (!ravgar?.jailHammer.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            jailb.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }
        if (ccezakontrol) {
            cmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }
        if (vcezakontrol) {
            vmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }
        if (jcezakontrol) {
            jailb.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)
        }


        const row = new Discord.ActionRowBuilder().addComponents([cmute, vmute, jailb, iptalm])
        let msg = await message.channel.send({
            components: [row], embeds: [embed.setDescription(`
Merhaba ${message.author}! ${member} kişisinin ceza türünü lütfen aşağıdaki butonlardan seçiniz!
        `)]
        })

        var filter = (button) => button.user.id === message.member.id;
        let collector = await msg.createMessageComponentCollector({ filter })
        collector.on("collect", async (button) => {
            if (msg) msg.delete();
            if (button.customId == "chatmute") {
                const secim = new Discord.ActionRowBuilder().addComponents(
                    new Discord.SelectMenuBuilder().setPlaceholder('Chat Mute Sebebini Seç!').setCustomId('chatmutesebep').addOptions(
                        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "5 Dakika", value: "cbir", },
                        { label: "Flood,Spam ve Capslock Kullanımı", description: "5 Dakika", value: "ciki", },
                        { label: "Metin Kanallarını Amacı Dışında Kullanmak", description: "10 Dakika", value: "cuc", },
                        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "5 Dakika", value: "cdort", },
                        { label: "Abartı, Küfür ve Taciz Kullanımı", description: "30 Dakika", value: "cbes", },
                        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "14 Gün", value: "calti", },
                        { label: "Sunucu Kötüleme ve Kişisel Hakaret", description: "1 Saat", value: "cyedi", },
                    ));

                let onay = await button.channel.send({
                    components: [secim], embeds: [embed.setDescription(`
Lütfen aşağıdaki menüden atmak istediğiniz mute türünü seçiniz. İşlem otomatik olarak işlenecektir.
                `)]
                })
                var filter = (component) => component.user.id === message.author.id;
                const collector = onay.createMessageComponentCollector({ filter, time: 30000 })
                collector.on('collect', async (interaction) => {
                    if (onay) onay.delete();
                    if (interaction.values[0] == "cbir") { await Cezalandır(member, message, "Kışkırtma, Trol ve Dalgacı Davranış", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "ciki") { await Cezalandır(member, message, "Flood,Spam ve Capslock Kullanımı", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "cuc") { await Cezalandır(member, message, "Metin Kanallarını Amacı Dışında Kullanmak", "10m", "10 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "cdort") { await Cezalandır(member, message, "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "cbes") { await Cezalandır(member, message, "Abartı, Küfür ve Taciz Kullanımı", "30m", "30 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "calti") { await Cezalandır(member, message, "Dini, Irki ve Siyasi değerlere Hakaret", "14d", "14 Gün", embed, ravgar) }
                    if (interaction.values[0] == "cyedi") { await Cezalandır(member, message, "Sunucu Kötüleme ve Kişisel Hakaret", "1h", "1 Saat", embed, ravgar) }
                })
            }
            if (button.customId == "voicemute") {
                const secim = new Discord.ActionRowBuilder().addComponents(
                    new Discord.SelectMenuBuilder().setPlaceholder('Voice Mute Sebebini Seç!').setCustomId('voicemutesebep').addOptions(
                        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "5 Dakika", value: "vbir", },
                        { label: "Flood,Spam ve Capslock Kullanımı", description: "5 Dakika", value: "viki", },
                        { label: "Özel Odalara İzinsiz Giriş ve Trol", description: "1 Saat", value: "vuc", },
                        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "5 Dakika", value: "vdort", },
                        { label: "Abartı, Küfür ve Taciz Kullanımı", description: "30 Dakika", value: "vbes", },
                        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "14 Gün", value: "valti", },
                        { label: "Sunucu Kötüleme ve Kişisel Hakaret", description: "1 Saat", value: "vyedi", },
                        { label: "Soundpad, Bass gibi Uygulama Kullanmak", description: "30 Dakika", value: "vsekiz", },
                    ));

                let onay = await button.channel.send({
                    components: [secim], embeds: [embed.setDescription(`
Lütfen aşağıdaki menüden atmak istediğiniz mute türünü seçiniz. İşlem otomatik olarak işlenecektir.
                `)]
                })
                onay.awaitMessageComponent({
                    filter: (component) => component.user.id === message.author.id, componentType: 'SELECT_MENU',
                }).then(async (interaction) => {
                    if (onay) onay.delete();
                    if (interaction.values[0] == "vbir") { await VoiceCezalandır(member, message, "Kışkırtma, Trol ve Dalgacı Davranış", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "viki") { await VoiceCezalandır(member, message, "Flood,Spam ve Capslock Kullanımı", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "vuc") { await VoiceCezalandır(member, message, "Özel Odalara İzinsiz Giriş ve Trol", "1h", "1 Saat", embed, ravgar) }
                    if (interaction.values[0] == "vdort") { await VoiceCezalandır(member, message, "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", "5m", "5 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "vbes") { await VoiceCezalandır(member, message, "Abartı, Küfür ve Taciz Kullanımı", "30m", "30 Dakika", embed, ravgar) }
                    if (interaction.values[0] == "valti") { await VoiceCezalandır(member, message, "Dini, Irki ve Siyasi değerlere Hakaret", "14d", "14 Gün", embed, ravgar) }
                    if (interaction.values[0] == "vyedi") { await VoiceCezalandır(member, message, "Sunucu Kötüleme ve Kişisel Hakaret", "1h", "1 Saat", embed, ravgar) }
                    if (interaction.values[0] == "vsekiz") { await VoiceCezalandır(member, message, "Soundpad, Bass gibi Uygulama Kullanmak", "30m", "30 Dakika", embed, ravgar) }
                })
            }
            if (button.customId == "jail") {
                const secim = new Discord.ActionRowBuilder().addComponents(
                    new Discord.SelectMenuBuilder().setPlaceholder('Jail Sebebini Seç!').setCustomId('jailsebep').addOptions([
                        { label: "Cinsellik, taciz ve ağır hakaret", description: "7 Gün", value: "cbir", },
                        { label: "Sunucu kurallarına uyum sağlamamak", description: "3 Gün", value: "ciki", },
                        { label: "Sesli/Mesajlı/Ekran P. DM Taciz", description: "1 Gün", value: "cuc", },
                        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "30 Gün", value: "cdort", },
                        { label: "Abartı rahatsız edici yaklaşımda bulunmak!", description: "14 Gün", value: "cbes", },
                        { label: "Sunucu içerisi abartı trol / Kayıt trol yapmak!", description: "3 Gün", value: "calti", },
                        { label: "Sunucu Kötüleme / Saygısız Davranış", description: "1 Ay", value: "cyedi", },
                    ]));

                let onay = await message.channel.send({
                    components: [secim], embeds: [embed.setDescription(`
Lütfen aşağıdaki menüden atmak istediğiniz jail türünü seçiniz. İşlem otomatik olarak işlenecektir.
                        `)]
                })
                var filter = (component) => component.user.id === message.author.id;
                const collector = onay.createMessageComponentCollector({ filter, time: 30000 })
                collector.on('collect', async (interaction) => {
                    if (onay) onay.delete();
                    if (interaction.values[0] == "cbir") { await JailCezalandır(member, message, "Cinsellik, taciz ve ağır hakaret", "7d", "7 Gün", embed, ravgar) }
                    if (interaction.values[0] == "ciki") { await JailCezalandır(member, message, "Sunucu kurallarına uyum sağlamamak", "3d", "3 Gün", embed, ravgar) }
                    if (interaction.values[0] == "cuc") { await JailCezalandır(member, message, "Sesli/Mesajlı/Ekran P. DM Taciz", "1d", "1 Gün", embed, ravgar) }
                    if (interaction.values[0] == "cdort") { await JailCezalandır(member, message, "Dini, Irki ve Siyasi değerlere Hakaret", "30d", "1 Ay", embed, ravgar) }
                    if (interaction.values[0] == "cbes") { await JailCezalandır(member, message, "Abartı rahatsız edici yaklaşımda bulunmak!", "14d", "14 Gün", embed, ravgar) }
                    if (interaction.values[0] == "calti") { await JailCezalandır(member, message, "Sunucu içerisi abartı trol / Kayıt trol yapmak!", "3d", "3 Gün", embed, ravgar) }
                    if (interaction.values[0] == "cyedi") { await JailCezalandır(member, message, "Sunucu Kötüleme / Saygısız Davranış", "30d", "1 Ay", embed, ravgar) }

                })

                collector.on("end", async () => {
                    onay.delete().catch(x => { })
                });
            }
            if (button.customId === "iptal") {
                if (msg) msg.delete();
                message.react(message.guild.findEmoji(system.Emojis.Iptal))
                await button.reply({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${member} adlı üyenin cezalandırma işlemi manuel olarak iptal edildi.`, ephemeral: true })
            }
        })
        collector.on("end", async () => {
            msg.delete().catch(x => { })
        });

    }
}

module.exports = Mutes

async function Cezalandır(member, message, sebep, sure, mutezaman, embed, ravgar) {
    let yeniGün = client.cmuteSure.get(message.author.id) + (1 * 24 * 60 * 60 * 1000);
    if (Date.now() < yeniGün) return message.channel.send(`${message.guild.findEmoji(system.Emojis.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.`).then(x => {
        x.delete({ timeout: 5000 })
        message.react(message.guild.findEmoji(system.Emojis.Iptal))
    });
    let LimitKontrol = await client.cmuteLimit.get(message.author.id) || 0
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.cmuteLimit.set(message.author.id, LimitKontrol + 1)
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({
            No: cezano,
            Uye: member.id,
            Yetkili: message.member.id,
            Tip: "Susturulma",
            AtilanSure: mutezaman,
            Sebep: sebep,
            Kalkma: Date.now() + ms(sure),
            Tarih: Date.now()
        })
        let Zamanlama = new Mute({
            No: ceza.No,
            userID: member.id,
            Kalkma: Date.now() + ms(sure)
        })
        Zamanlama.save().catch(e => console.error(e));
        ceza.save().catch(e => console.error(e));
        await User.findOneAndUpdate({ userID: message.member.id }, { $inc: { UseMute: 1 } }, { upsert: true }).exec();
        client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle <t:${Math.floor(Date.now() / 1000)}:R> tarihinde ${mutezaman} süresince chat kanallarında susturuldu!`).setFooter({ text: "Created © by Ravgar." + ` • Ceza Numarası: #${ceza.No}`, iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })] })
        if (member && member.manageable) await member.roles.add(ravgar?.mutedRole).catch(x => client_logger.log("Chatmute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));
        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Muted)} ${member} isimli üyeye \`${sebep}\` nedeniyle "__Susturulma__" türünde \`${mutezaman}\` boyunca ceza-i işlem uygulandı. (Ceza Numarası: \`#${ceza.No}\`)` })
        if (member) member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${Math.floor(Date.now() / 1000)}:R> tarihinde \`${mutezaman}\` süresince sunucuda metin kanallarında susturuldun.`)] }).catch(x => {
            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
        })
    });
    message.react(message.guild.findEmoji(system.Emojis.Onay))
}

async function VoiceCezalandır(member, message, sebep, sure, mutezaman, embed, ravgar) {
    let yeniGün = client.vmuteSure.get(message.author.id) + (1 * 24 * 60 * 60 * 1000);
    if (Date.now() < yeniGün) return message.channel.send(`${message.guild.findEmoji(system.Emojis.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.`).then(x => {
        x.delete({ timeout: 5000 })
        message.react(message.guild.findEmoji(system.Emojis.Iptal))
    });

    let LimitKontrol = await client.vmuteLimit.get(message.author.id) || 0
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.vmuteLimit.set(message.author.id, LimitKontrol + 1)
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({
            No: cezano,
            Uye: member.id,
            Yetkili: message.member.id,
            Tip: "Seste Susturulma",
            AtilanSure: mutezaman,
            Sebep: sebep,
            Kalkma: Date.now() + ms(sure),
            Tarih: Date.now()
        })
        let Zamanlama = new VMute({
            No: ceza.No,
            userID: member.id,
            Kalkma: Date.now() + ms(sure)
        })
        Zamanlama.save().catch(e => console.error(e));
        ceza.save().catch(e => console.error(e));
        await User.findOneAndUpdate({ userID: message.member.id }, { $inc: { UseVMute: 1 } }, { upsert: true }).exec();
        client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle <t:${Math.floor(Date.now() / 1000)}:R> ${mutezaman} süresince ses kanallarında susturuldu!`).setFooter({ text: "Created © by Ravgar." + ` • Ceza Numarası: #${ceza.No}`, iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })] })
        if (member && member.manageable) await member.roles.add(ravgar?.vmutedRole).catch(x => client_logger.log("Voicemute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
        if (member && member.voice.channel) await member.voice.kick()
        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Muted)} ${member} isimli üyeye \`${sebep}\` nedeniyle "__Seste Susturulma__" türünde \`${mutezaman}\` boyunca ceza-i işlem uygulandı. (Ceza Numarası: \`#${ceza.No}\`)` })
        if (member) member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${Math.floor(Date.now() / 1000)}:R> tarihinde \`${mutezaman}\` süresince sunucuda ses kanallarında susturuldun.`)] }).catch(x => {
            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
        })
    });
    message.react(message.guild.findEmoji(system.Emojis.Onay))
}

async function JailCezalandır(member, message, sebep, sure, jailzaman, embed, ravgar) {
    let yeniGün = client.jailSure.get(message.author.id) + (1 * 24 * 60 * 60 * 1000);
    if (Date.now() < yeniGün) return message.channel.send(`${message.guild.findEmoji(system.Emojis.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.`).then(x => {
        x.delete({ timeout: 5000 })
        message.react(message.guild.findEmoji(system.Emojis.Iptal))
    });

    let LimitKontrol = await client.jailLimit.get(message.author.id) || 0
    let Limit = 5
    let LimitTaslak = `(Günlük Limit: __${LimitKontrol + 1}/${Limit}__)`
    if (LimitKontrol >= Limit) {
        client.jailSure.set(message.author.id, Date.now())
        client.jailLimit.delete(message.author.id)
        return message.react(message.guild.findEmoji(system.Emojis.Iptal))
    }
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.jailLimit.set(message.author.id, LimitKontrol + 1)
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    await Punitives.find({}).exec(async (err, res) => {
        let ceza = new Punitives({
            No: cezano,
            Uye: member.id,
            Yetkili: message.member.id,
            Tip: "Cezalandırılma",
            AtilanSure: jailzaman,
            Sebep: sebep,
            Kalkma: Date.now() + ms(sure),
            Tarih: Date.now()
        })
        let Zamanlama = new Jail({
            No: ceza.No,
            userID: member.id,
            Kalkma: Date.now() + ms(sure)
        })
        Zamanlama.save().catch(e => console.error(e));
        ceza.save().catch(e => console.error(e));
        await User.updateOne({ userID: message.member.id }, { $inc: { UseJail: 1 } }, { upsert: true }).exec();
        client.channels.cache.find(x => x.name === "jail-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle <t:${Math.floor(Date.now() / 1000)}:R> ${jailzaman} süresince jail cezası uygulandı!`).setFooter({ text: "Created © by Ravgar." + ` • Ceza Numarası: #${ceza.No}`, iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })
        if (member && member.voice.channel) await member.voice.kick()
        if (member && member.manageable) await member.setRoles(ravgar?.jailedRole).catch(x => client_logger.log("Jail rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));
        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Jailed)} ${member} isimli üyeye \`${sebep}\` nedeniyle "__Cezalandırılma__" türünde \`${jailzaman}\` boyunca ceza-i işlem uygulandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${ceza.No}\`)` })
        if (member) member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde \`${jailzaman}\` süresince sunucuda cezalandırıldın.`)] }).catch(x => {
            message.channel.send({ content: ` ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
        })


    });

    message.react(message.guild.findEmoji(system.Emojis.Onay))
}