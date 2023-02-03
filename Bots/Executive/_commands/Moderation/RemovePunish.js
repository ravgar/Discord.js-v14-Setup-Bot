
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, VMute, Mute, Punitives, Jail } = require("../../../../Global/Settings/Schemas");
const ms = require('ms');
class RemovePunish extends Command {
    constructor(client) {
        super(client, {
            name: "cezakaldir",
            description: "Sunucu içerisi bir kişinin cezasını kaldırmanızı sağlar.",
            usage: "cezakaldır @ravgar/ID ",
            category: "Moderation",
            aliases: ["cezakaldır", "unjail", "unmute", "unceza", "unvmute", "sesmutekaldir", "chatmutekaldir"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        //if (!ravgar?.mutedRole || !ravgar?.vmutedRole || !ravgar?.muteHammer.length <= 0) return message.channel.send({ content: system.Replys.Data }).sil(20) 
        if (!ravgar?.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.vmuteHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (Number(args[0])) {
            let cezanobul = await Mute.findOne({ No: args[0] });
            let cezanobul2 = await VMute.findOne({ No: args[0] });
            let cezanobul3 = await Jail.findOne({ No: args[0] });
            if (cezanobul) args[0] = cezanobul.userID
            if (cezanobul2) args[0] = cezanobul2.userID
            if (cezanobul2) args[0] = cezanobul3.userID
        }
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}cezakaldır <#No/@ravgar/ID>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.UpStaff });

        let cezakontrol = await Mute.findOne({ userID: member.id })
        let cezakontrol2 = await VMute.findOne({ userID: member.id })
        let cezakontrol3 = await Jail.findOne({ userID: member.id })
        if (!cezakontrol && !cezakontrol2 && !cezakontrol3) {
            message.channel.send({ content: `\`Hata:\` Belirtilen ceza bulunamadı!` });
            message.react(message.guild.findEmoji(system.Emojis.Iptal))
            return;
        };

        const cmute = new Discord.ButtonBuilder().setCustomId("chatmute").setLabel(`💬 Chat Mute`).setStyle(Discord.ButtonStyle.Success)
        const vmute = new Discord.ButtonBuilder().setCustomId("voicemute").setLabel(`🎤 Voice Mute`).setStyle(Discord.ButtonStyle.Success)
        const jailb = new Discord.ButtonBuilder().setCustomId("jail").setLabel(`Jail`).setEmoji("993134933730152470").setStyle(Discord.ButtonStyle.Success)
        const iptalm = new Discord.ButtonBuilder().setCustomId("iptal").setLabel("İptal").setStyle(Discord.ButtonStyle.Danger)

        if (!cezakontrol) { cmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger) }
        if (!cezakontrol2) { vmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger) }
        if (!cezakontrol3) { jailb.setDisabled(true).setStyle(Discord.ButtonStyle.Danger)}
        let cezabilgisi = await Punitives.findOne({ Uye: member.id, Aktif: true, Tip: "Susturulma" })
        let cezabilgisi2 = await Punitives.findOne({ Uye: member.id, Aktif: true, Tip: "Seste Susturulma" })
        let cezabilgisi3 = await Punitives.findOne({ Uye: member.id, Aktif: true, Tip: "Cezalandırılma" })
        if (cezabilgisi?.Yetkili !== message.author.id && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(x => message.member.roles.cache.has(x))) { cmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger) }
        if (cezabilgisi2?.Yetkili !== message.author.id && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(x => message.member.roles.cache.has(x))) { vmute.setDisabled(true).setStyle(Discord.ButtonStyle.Danger) }
        if (cezabilgisi3?.Yetkili !== message.author.id && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ravgar?.foundingRoles.some(x => message.member.roles.cache.has(x))) { jailb.setDisabled(true).setStyle(Discord.ButtonStyle.Danger) }




        let secenek = new Discord.ActionRowBuilder().addComponents([cmute, vmute, jailb, iptalm])
        let msg = await message.channel.send({
            content: `Merhaba ${message.author}! Aşağıdan kaldırmak istediğiniz ceza türünü seçin!`, components: [secenek]
        })
        var filter = (component) => component.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (button) => {
            if (button.customId == "chatmute") {
                await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id } }, { upsert: true }).exec();
                await Mute.findOneAndDelete({ userID: member.id })
                if (message) message.react(message.guild.findEmoji(system.Emojis.Onay))
                if (msg) msg.edit({
                    content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} kişisinin \`#${cezakontrol.No}\` numaralı **Chat Mute** türünde cezası <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} tarafından kaldırıldı!`, components: []
                })
                if (member && member.manageable) await member.roles.remove(ravgar?.mutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
                message.guild.findChannel("mute-log").send({
                    embeds: [embed.setDescription(`${member} uyesinin \`#${cezakontrol.No}\` numaralı metin kanallarındaki susturulması, <t:${Math.floor(Date.now() / 1000)}:R> ${message.member} tarafından kaldırıldı.`)]
                })
            }
            if (button.customId == "voicemute") {
                await Punitives.updateOne({ No: cezakontrol2.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id } }, { upsert: true }).exec();
                await VMute.findOneAndDelete({ userID: member.id })
                if (message) message.react(message.guild.findEmoji(system.Emojis.Onay))
                if (msg) msg.edit({
                    content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} kişisinin \`#${cezakontrol2.No}\` numaralı **Voice Mute** türünde cezası <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} tarafından kaldırıldı!`, components: []
                })
                if (member && member.manageable) await member.roles.remove(ravgar?.vmutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
                message.guild.findChannel("mute-log").send({
                    embeds: [embed.setDescription(`${member} uyesinin \`#${cezakontrol2.No}\` numaralı ses kanallarındaki susturulması, <t:${Math.floor(Date.now() / 1000)}:R> ${message.member} tarafından kaldırıldı.`)]
                })
            }
            if (button.customId == "jail") {
                await Jail.deleteOne({ userID: member.id })
                await Punitives.updateOne({ No: cezakontrol3.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id } }, { upsert: true }).exec();
                if (message) message.react(message.guild.findEmoji(system.Emojis.Onay))
                if (msg) msg.edit({
                    content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} kişisinin \`#${cezakontrol3.No}\` numaralı **Jail** türünde cezası <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} tarafından kaldırıldı!`, components: []
                })
                message.guild.findChannel("mute-log").send({
                    embeds: [embed.setDescription(`${member} uyesinin \`#${cezakontrol3.No}\` numaralı cezalandırması, <t:${Math.floor(Date.now() / 1000)}:R> ${message.member} tarafından kaldırıldı.`)]
                })
                let CID = await User.findOne({ userID: member.id });
                if (CID) {
                    if (CID.Gender && CID.Name && CID.Age) {
                        if (member && member.manageable) await member.setNickname(`${ravgar?.tags.some(x => member.user.username.includes(x)) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} ${CID.Name} | ${CID.Age}`)
                        if (!ravgar?.tagMode || ravgar?.tags.some(a => member.user.username.includes(a))) {
                            if (CID.Gender == "man") await member.setRoles(ravgar?.manRoles)
                            if (CID.Gender == "woman") await member.setRoles(ravgar?.womanRoles)
                            if (member && member.manageable && ravgar?.tags.some(a => member.user.username.includes(a))) await member.roles.add(ravgar?.tagRole)
                        } else {
                            if (member && member.manageable) await member.setRoles(ravgar?.unregisterRoles).catch(x => client._logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
                        }
                    } else {
                        await member.setRoles(ravgar?.unregisterRoles).catch(x => client._logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
                        await member.setNickname(`${member.user.username.includes(ravgar?.tags[0]) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} İsim | Yaş`)
                    }
                } else {
                    await member.setRoles(ravgar?.unregisterRoles).catch(x => client._logger.log("Jail komutunda kayıtsız rolü verilemedi oraya bi göz atmanı öneririm.", "caution"));
                    await member.setNickname(`${member.user.username.includes(ravgar?.tags[0]) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} c`)
                }
            }
            if (button.customId == "iptalm") {

            }
        })

        collector.on("end", async () => {
            if (message) message.react(message.guild.findEmoji(system.Emojis.Iptal))
            if (msg) msg.edit({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} 30 saniye boyunca cevap vermediğiniz için işlem iptal edildi!`, components: [] })
        })
    }
}

module.exports = RemovePunish