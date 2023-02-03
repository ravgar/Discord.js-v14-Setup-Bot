
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, Punitives } = require("../../../../Global/Settings/Schemas");
class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Sunucu içerisi bir kişiyi banlamanızı sağlar.",
            usage: "ban @ravgar/ID ",
            category: "Moderation",
            aliases: ["ban", "yargı", "sg", "yolal","sercio","raypır"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        //if (!ravgar?.mutedRole || !ravgar?.vmutedRole || !ravgar?.muteHammer.length <= 0) return message.channel.send({ content: system.Replys.Data }).sil(20) 
        let cezano = await Punitives.countDocuments().exec();
        cezano = cezano == 0 ? 1 : cezano + 1;
        if (!ravgar?.banHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}ban <@ravgar/ID>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.UpStaff }).sil(20)

        const secim = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder().setPlaceholder('Ban Sebebini Seç!').setCustomId('bansebep').addOptions([
                { label: "Cinsellik, taciz ve ağır hakaret", description: "Ban", value: "bbir", },
                { label: "Sunucu kurallarına uyum sağlamamak", description: "Ban", value: "biki", },
                { label: "Sesli/Mesajlı/Ekran P. DM Taciz", description: "Ban", value: "buc", },
                { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "Ban", value: "bdort", },
                { label: "Reklam ve Bağlantı Paylaşımı", description: "Ban", value: "bbes", },
                { label: "Sunucu içerisi abartı trol / Kayıt trol yapmak!", description: "Ban", value: "balti", },
                { label: "Sunucu Kötüleme / Saygısız Davranış", description: "Ban", value: "byedi", },
            ]));

        let newDay = client.banSure.get(message.author.id) + (1 * 24 * 60 * 60 * 1000);
        if (Date.now() < newDay) {
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Günlük kullanım sınırını geçtin! **${kalanzaman(yeniGün)}** sonra tekrar dene.` })
            message.react(message.guild.findEmoji(system.Emojis.Iptal))
        }
        let LimitKontrol = await client.banLimit.get(message.author.id) || 0
        let Limit = 3
        let LimitTaslak = `Günlük Limit: __${LimitKontrol + 1}/${Limit}__`
        if (LimitKontrol >= Limit) {
            client.banSure.set(message.author.id, Date.now())
            client.banLimit.delete(message.author.id)
            return message.react(message.guild.findEmoji(system.Emojis.Iptal))
        }

        if (!ravgar?.underWorldSystem) {
            let onay = await message.channel.send({
                components: [secim], embeds: [embed.setDescription(`
${message.author} Merhaba! ${member} kişisine hangi ceza işlemini uygulamak istiyorsan lütfen aşağıdan seç! \`${LimitTaslak}\`
            `)]
            })
            var filter = (component) => component.user.id === message.author.id;
            const collector = onay.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (interaction) => {
                if (onay) onay.delete();
                if (interaction.values[0] == "bbir") {
                    let sebep = "Cinsellik, taciz ve ağır hakaret"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "biki") {
                    let sebep = "Sunucu kurallarına uyum sağlamamak"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "buc") {
                    let sebep = "Sesli/Mesajlı/Ekran P. DM Taciz"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "bdort") {
                    let sebep = "Dini, Irki ve Siyasi değerlere Hakaret"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "bbes") {
                    let sebep = "Reklam ve Bağlantı Paylaşımı"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "balti") {
                    let sebep = "Sunucu içerisi abartı trol / Kayıt trol yapmak!"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "byedi") {
                    let sebep = "Sunucu Kötüleme / Saygısız Davranış"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        await message.guild.members.ban(member.id, { reason: `Yasaklayan Kişi ID: ${message.author.id} Sebep(#${ceza.No}): ${sebep}` })
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
            })
        } else {
            let onay = await message.channel.send({
                components: [secim], embeds: [embed.setDescription(`
${message.author} Merhaba! ${member} kişisine hangi ceza işlemini uygulamak istiyorsan lütfen aşağıdan seç! \`${LimitTaslak}\`
        `)]
            })
            var filter = (component) => component.user.id === message.author.id;
            const collector = onay.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (interaction) => {
                if (onay) onay.delete();
                if (interaction.values[0] == "bbir") {
                    let sebep = "Cinsellik, taciz ve ağır hakaret"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "biki") {
                    let sebep = "Sunucu kurallarına uyum sağlamamak"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "buc") {
                    let sebep = "Sesli/Mesajlı/Ekran P. DM Taciz"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "bdort") {
                    let sebep = "Dini, Irki ve Siyasi değerlere Hakaret"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "bbes") {
                    let sebep = "Reklam ve Bağlantı Paylaşımı"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "balti") {
                    let sebep = "Sunucu içerisi abartı trol / Kayıt trol yapmak!"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
                if (interaction.values[0] == "byedi") {
                    let sebep = "Sunucu Kötüleme / Saygısız Davranış"
                    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) client.banLimit.set(message.author.id, LimitKontrol + 1)
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: member.id,
                            Yetkili: message.member.id,
                            Tip: "Yasaklanma",
                            Sebep: sebep,
                            Tarih: Date.now()
                        })
                        ceza.save().catch(e => console.error(e));
                        await User.updateOne({ userID: message.member.id }, { $inc: { UseBan: 1 } }, { upsert: true }).exec();
                        client.channels.cache.find(x => x.name === "ban-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisi ${message.author} (\`${message.author.id}\`) tarafından **${sebep}** sebebiyle **${tarihsel(Date.now())}** tarihinde ban türü ceza ile cezalandırıldı!`).setFooter({ text: `Created © by Ravgar. • Ceza Numarası: #${ceza.No}` }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setColor("Random")] })
                        message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} isimli üye \`${sebep}\` nedeni ile sunucudan yasaklandı. ${!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) ? LimitTaslak : ``} (Ceza Numarası: \`#${cezano}\`)` })
                        if (member) await member.send({ embeds: [embed.setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde sunucuda yasaklandın.`)] }).catch(x => {
                            message.channel.send({ content: `${cevaplar.prefix} ${member} üyesinin özel mesajları kapalı olduğundan dolayı bilgilendirme gönderilemedi.` }).sil(20)
                        });
                        if (member && member.manageable) await member.setRoles(ravgar?.underWorld).catch(x => client_logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                        message.react(message.guild.findEmoji(system.Emojis.Onay))
                    })
                }
            })
        }
    }
}

module.exports = Ban