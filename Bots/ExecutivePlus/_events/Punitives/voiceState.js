const { Event } = require("../../../../Global/Structures/Default.Events");
const ms = require("ms");
const trolpiç = new Map()
const { Punitives, VMute } = require("../../../../Global/Settings/Schemas")
class voiceState extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });
    }

    async onLoad(oldState, newState) {
        const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID })
        if ((!oldState.channel && newState.channel) || (oldState.channel && newState.channel)) {
            let member = newState.member;
            if (!member) return;
            let data = await VMute.findOne({ userID: member.id })
            if (member.roles.cache.has(ravgar?.vmutedRole)) {
                if (!data) {
                    if (member && member.voice.channel) await member.voice.setMute(false);
                    if (member && member.manageable) await member.roles.remove(ravgar?.vmutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
                }
            }

            if (data) {
                if (Date.now() >= data.Kalkma) {
                    if (member && member.voice.channel) await member.voice.setMute(false);
                    if (member && member.manageable && member.roles.cache.has(ravgar?.vmutedRole)) await member.roles.remove(ravgar?.vmutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
                    await Punitives.updateOne({ No: data.No }, { $set: { "Aktif": false, Bitis: Date.now() } }, { upsert: true }).exec();
                    await VMute.findOneAndDelete({ userID: member.id })
                } else if (member.voice.channel && !member.voice.serverMute) {
                    //if(member && member.voice.channel) await member.voice.setMute(true);
                    if (member && member.manageable && !member.roles.cache.has(ravgar?.vmutedRole)) await member.roles.add(ravgar?.vmutedRole);
                }
            }

            if (oldState.channelId && !oldState.selfMute && newState.selfMute) {
                if (5 > 0 && trolpiç.has(newState.id) && trolpiç.get(newState.id) == 5) {
                    if (newState) newState.member.voice.setMute(true);
                    if (newState.member && newState.member.manageable) await newState.member.roles.add(ravgar?.vmutedRole).catch(x => client._logger.log("Voicemute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                    let cezano = await Punitives.countDocuments().exec();
                    cezano = cezano == 0 ? 1 : cezano + 1;
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: newState.member.id,
                            Yetkili: client.user.id,
                            Tip: "Seste Susturulma",
                            AtilanSure: "5 Dakika",
                            Sebep: "Mic Bugu Yapmak",
                            Kalkma: Date.now() + ms("5m"),
                            Tarih: Date.now()
                        })
                        let Zamanlama = new VMute({
                            No: ceza.No,
                            userID: newState.id,
                            Kalkma: Date.now() + ms("5m")
                        })
                        Zamanlama.save().catch(e => console.error(e));
                        ceza.save().catch(e => console.error(e));
                        let logKanali = newState.guild.channels.cache.find(x => x.name == "voicemute-log")
                        if (logKanali) logKanali.send({
                            embeds:
                                [new Discord.ButtonBuilder().setDescription(`
${newState.member} \`(#${cezano})\` üyesi **${tarihsel(Date.now())}** tarihinde **Mic Bugu** nedeniyle ses kanallarında **5 dakika** boyunca susturuldu!
      `)]
                        })
                    })
                }

                if (5 > 0) {
                    if (!trolpiç.has(newState.id)) trolpiç.set(newState.id, 1);
                    else trolpiç.set(newState.id, trolpiç.get(newState.id) + 1);
                    setTimeout(() => {
                        if (trolpiç.has(newState.id)) trolpiç.delete(newState.id);
                    }, 1000 * 60 * 2);
                }
            }
            if (oldState.channelId && !oldState.selfDeaf && newState.selfDeaf) {
                if (5 > 0 && trolpiç.has(newState.id) && trolpiç.get(newState.id) == 5) {
                    if (newState) newState.member.voice.setMute(true);
                    if (newState.member && newState.member.manageable) await newState.member.roles.add(ravgar?.vmutedRole).catch(x => client._logger.log("Voicemute rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
                    let cezano = await Punitives.countDocuments().exec();
                    cezano = cezano == 0 ? 1 : cezano + 1;
                    await Punitives.find({}).exec(async (err, res) => {
                        let ceza = new Punitives({
                            No: cezano,
                            Uye: newState.member.id,
                            Yetkili: client.user.id,
                            Tip: "Seste Susturulma",
                            AtilanSure: "5 Dakika",
                            Sebep: "Kulaklık Bugu Yapmak",
                            Kalkma: Date.now() + ms("5m"),
                            Tarih: Date.now()
                        })
                        let Zamanlama = new VMute({
                            No: ceza.No,
                            userID: newState.id,
                            Kalkma: Date.now() + ms("5m")
                        })
                        Zamanlama.save().catch(e => console.error(e));
                        ceza.save().catch(e => console.error(e));
                        let logKanali = newState.guild.channels.cache.find(x => x.name == "voicemute-log")
                        if (logKanali) logKanali.send({
                            embeds:
                                [new Discord.ButtonBuilder().setDescription(`
${newState.member} \`(#${cezano})\` üyesi **${tarihsel(Date.now())}** tarihinde **Kulaklık Bugu** nedeniyle ses kanallarında **5 dakika** boyunca susturuldu!
      `)]
                        })
                    })
                }

                if (5 > 0) {
                    if (!trolpiç.has(newState.id)) trolpiç.set(newState.id, 1);
                    else trolpiç.set(newState.id, trolpiç.get(newState.id) + 1);
                    setTimeout(() => {
                        if (trolpiç.has(newState.id)) trolpiç.delete(newState.id);
                    }, 1000 * 60 * 2);
                }
            }
        }

    }
}

module.exports = voiceState;