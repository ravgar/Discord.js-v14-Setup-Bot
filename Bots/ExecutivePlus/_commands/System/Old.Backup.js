const { Command } = require("../../../../Global/Structures/Default.Commands");
const { OldRoles, OldChannels } = require("../../../../Global/Settings/Schemas");
const System = require("../../../../Global/Settings/System");
const Bots = require("../../../DistMain")
class OldBackup extends Command {
    constructor(client) {
        super(client, {
            name: "ob",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["oldbackup", "oldchannel", "oldrole", "oldroles", "yedekler"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let rdata = await OldRoles.findOne({ guildID: System.Guild.ID })
        let cdata = await OldChannels.findOne({ guildID: System.Guild.ID })
        let row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("backupal").setLabel("📁 Backup Al").setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId("oblistele").setLabel("📜 Backup Listele").setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId("rolkur").setLabel("⚙️ Rol Kur").setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder().setCustomId("kanalkur").setLabel("🔗 Kanal Kur").setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder().setCustomId("kontrolet").setLabel("✔️ Kontrol et").setStyle(Discord.ButtonStyle.Danger)
        )
        let oldbackup = await message.channel.send({
            components: [row], embeds: [
                embed.setDescription(`
Merhaba ${message.author}!
\`>\` Bu backup sistemi asla silinmeyen, verilerin kaybının yaşanmadığı kısımdır.
\`>\` Bu sistem sayesinde saatlik alınan backuplarda silinen roller olsa bile kurulum yapabilirsin! 
\`>\` **📁 Backup Al** butonu ile backupı yenileyebilirsin!
\`>\` **📜 Backup Listele** butonu ile backup içeriğini listeleyebilirsin!
\`>\` **⚙️ Rol Kur** butonu ile database içerisindeki kurmak istediğin bir rol verisini kurabilirsin!
\`>\` **🔗 Kanal Kur** butonu ile database içerisindeki kurmak istediğin bir kanal verisini kurabilirsin!
\`>\` Son alınan rol yedeği : <t:${Math.floor(rdata?.time ? rdata?.time : 0 / 1000)}:R>
\`>\` Son alınan kanal yedeği : <t:${Math.floor(cdata?.time ? cdata?.time : 0 / 1000)}:R>
            `)
            ]
        })
        var filter = (button) => button.user.id === message.member.id;
        let collector = await oldbackup.createMessageComponentCollector({ filter })

        collector.on("collect", async (button) => {
            button.deferUpdate(true)
            if (button.customId == "backupal") {
                if (oldbackup) oldbackup.edit({ components: [], embeds: [embed.setDescription(`${message.guild.emojis.cache.find(x => x.name == "Onay")} Backup manuel olarak alınmaya başlandı! Lütfen biraz bekleyin!`)] }).then(x => {
                    Roles();
                    Channels();
                    if (message) message.react(message.guild.emojis.cache.find(x => x.name == "Onay"))
                    setTimeout(() => x.delete(), 15000)
                })
            }
            if (button.customId == "oblistele") {
                const hangisi = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder().setCustomId("rolgoster").setLabel("Rolleri Listele!").setStyle(Discord.ButtonStyle.Success),
                    new Discord.ButtonBuilder().setCustomId("kanalgoster").setLabel("Kanalları Listele!").setStyle(Discord.ButtonStyle.Success)
                )
                if (oldbackup) oldbackup.edit({ components: [hangisi], embeds: [embed.setDescription(`${message.guild.emojis.cache.find(x => x.name == "Onay")} Data verilerinden hangisini listelemek istiyorsun?`)] })
                var filter = (button) => button.user.id === message.member.id;
                let collector = await oldbackup.createMessageComponentCollector({ filter, time: 30000 })
                collector.on("collect", async (button) => {
                    button.deferUpdate(true)
                    if (oldbackup) oldbackup.delete();
                    if (button.customId == "rolgoster") {
                        let roller = await OldRoles.find()
                        roller = roller.filter(x => !message.guild.roles.cache.get(x.roleID)).map(x => `Rol İsim: ${x.name} | Rol ID: ${x.roleID}`).join("\n")
                        const arr = await client.splitMessage(roller, { maxLength: 1950, char: "\n" })
                        message.channel.send({ content: `Merhaba! Aşağıda verilerimde olup sunucuda olmayan roller sıralanıyor. Bu işlem biraz zaman alabilir!` })
                        arr.forEach(datas => {
                            message.channel.send({ content: `\`\`\`js\n${datas}\`\`\`` })
                        })
                    }
                    if (button.customId == "kanalgoster") {
                        let kanallar = await OldChannels.find()
                        kanallar = kanallar.filter(x => !message.guild.channels.cache.get(x.channelID)).map(x => `Kanal İsim: ${x.name} | Kanal ID: ${x.channelID}`).join("\n")
                        const arr = await client.splitMessage(kanallar, { maxLength: 1950, char: "\n" })
                        message.channel.send({ content: `Merhaba! Aşağıda verilerimde olup sunucuda olmayan kanallar sıralanıyor. Bu işlem biraz zaman alabilir!` })
                        arr.forEach(datas => {
                            message.channel.send({ content: `\`\`\`js\n${datas}\`\`\`` })
                        })
                    }
                })
            }
            if (button.customId == "rolkur") {
                if (oldbackup) oldbackup.edit({ components: [], embeds: [embed.setDescription(`**DİKKAT!** Kurmak istediğin rolün ID'sini bu kanala mesaj olarak yollamalısın! \n\n\`>\`Eğer ID'sini bilmiyorsan \`.ob\` yazarak liste kısmından öğrenebilirsin!`)] }).then(ravgarmis => {
                    var filt = m => m.author.id == message.member.id
                    let collector = ravgarmis.channel.createMessageCollector({ filter: filt, time: 60000, max: 1, errors: ["time"] })
                    collector.on("collect", async (m) => {
                        let mesaj = m.content;
                        if (isNaN(mesaj)) {
                            if (message) message.react(emojiler.Iptal)
                            if (oldbackup) oldbackup.delete();
                            message.channel.send({ content: `${emojiler.Iptal} \`ID girilmedi!\` Lütfen bir id girerek tekrar deneyiniz!` }).sil(20);
                            return;
                        }
                        await OldRoles.findOne({ roleID: mesaj }).then(async (err, data) => {
                            if (!data) {
                                message.guild.channels.cache.find(x => x.name == "guard-log").send({ content: `[${mesaj}] ID'li rol silindi fakar datamda herhangi bir veri bulamadım! İşlemleri malesef gerçekleştiremiyorum!` }); console.log(`[${mesaj}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`);
                                if (ravgarmis) ravgarmis.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${mesaj} ID'li rolün herhangi bir datası bulunamadı! Rol kurulumu iptal edildi!`)] })
                                return
                            }
                            const newRole = await message.guild.roles.create({
                                name: data?.name,
                                color: data?.color,
                                hoist: data?.hoist,
                                position: data?.position,
                                permissions: data?.permissions,
                                mentionable: data?.mentionable,
                                reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
                            });
                            let length = (data.members.length + 5);
                            const sayı = Math.floor(length / Bots.length);
                            if (sayı < 1) sayı = 1;
                            const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(system.Guild.ID).channels.cache.get(e.id))
                            for await (const perm of channelPerm) {
                                const bott = Bots[1]
                                const guild2 = bott.guilds.cache.get(system.Guild.ID)
                                let kanal = guild2.channels.cache.get(perm.id);
                                if (!kanal) return;
                                let newPerm = {};
                                perm.allow.forEach(p => {
                                    newPerm[p] = true;
                                });
                                perm.deny.forEach(p => {
                                    newPerm[p] = false;
                                });
                                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client._logger.error(error));
                            }
                            for (let index = 0; index < Bots.length; index++) {
                                const bot = Bots[index];
                                const guild = bot.guilds.cache.get(system.Guild.ID);
                                if (newRole.deleted) {
                                    client._logger.log(`[${mesaj}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
                                    break;
                                }
                                const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
                                if (members.length <= 0) {
                                    client._logger.log(`[${mesaj}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
                                    if (ravgarmis) ravgarmis.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${mesaj} ID'li rolün üyelerine rol dağıtıldığı için ya da üye olmadığı için iptal edildi!`)] })
                                    break;
                                }
                                for await (const user of members) {
                                    const member = guild.members.cache.get(user)
                                    member.roles.add(newRole.id)
                                }
                            }
                            if (ravgarmis) ravgarmis.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${mesaj} ID'li rolün yedeği açıldı ve üyelerine dağıtılmaya başlandı!`)] })
                            const newData = new OldRoles({
                                roleID: newRole.id,
                                name: newRole.name,
                                color: newRole.hexColor,
                                hoist: newRole.hoist,
                                position: newRole.position,
                                permissions: newRole.permissions.bitfield,
                                mentionable: newRole.mentionable,
                                time: Date.now(),
                                members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                                channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
                            });
                            newData.save();
                        });
                    })
                })
            }

            if (button.customId == "kontrolet") {
                const roleData = await OldRoles.find()
                const deletedRoles = roleData.filter(x => !message.guild.roles.cache.get(x.roleID))
                if (!deletedRoles.length) return;
                deletedRoles.map(x => console.log(x.roleID))

                for (const deletedRole of deletedRoles) {
                    const newRole = await message.guild.roles.create({
                        name: deletedRole.name,
                        color: deletedRole.color,
                        hoist: deletedRole.hoist,
                        permissions: deletedRole.permissions,
                        position: deletedRole.position,
                        mentionable: deletedRole.mentionable,
                    });

                    await OldRoles.updateOne({ roleID: deletedRole.id }, { roleID: newRole.id });

                    for (const overwrite of deletedRole.channelOverwrites) {
                        const channel = message.guild.channels.cache.get(overwrite.id);
                        if (channel) channel.permissionOverwrites.create(newRole.id, overwrite.permissions);
                    }
                }
            }

        })

    }
}

module.exports = OldBackup

async function Roles() {
    const { OldRoles } = require('../../../../Global/Settings/Schemas');
    await OldRoles.deleteMany({});
    if (OldRoles) { await OldRoles.deleteMany({}); }
    let guild = client.guilds.cache.get(System.Guild.ID);
    if (guild) {
        guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(async role => {
            let roleChannelOverwrites = [];
            guild.channels.cache.filter(c => c.permissionOverwrites.cache.has(role.id)).forEach(c => {
                if (c.isThread() || !c.permissionOverwrites.cache.has(role.id)) return;
                let channelPerm = c.permissionOverwrites.cache.get(role.id);
                let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                roleChannelOverwrites.push(pushlanacak);
            });

            await OldRoles.findOne({ guildID: System.Guild.ID, roleID: role.id }).then(async (err, rolKayit) => {
                if (!rolKayit) {
                    let newRolSchema = new OldRoles({
                        guildID: System.Guild.ID,
                        roleID: role.id,
                        name: role.name,
                        color: role.hexColor,
                        hoist: role.hoist,
                        position: role.position,
                        permissions: role.permissions.bitfield,
                        mentionable: role.mentionable,
                        time: Date.now(),
                        members: role.members.map(m => m.id),
                        channelOverwrites: roleChannelOverwrites
                    });
                    newRolSchema.save();
                } else {
                    rolKayit.name = role.name;
                    rolKayit.color = role.hexColor;
                    rolKayit.hoist = role.hoist;
                    rolKayit.position = role.position;
                    rolKayit.permissions = role.permissions.bitfield;
                    rolKayit.mentionable = role.mentionable;
                    rolKayit.time = Date.now();
                    rolKayit.members = role.members.map(m => m.id);
                    rolKayit.channelOverwrites = roleChannelOverwrites;
                    rolKayit.save();
                };
            });
        })
        client._logger.log("OLD BACKUP ROL => Manuel yedekleme işlemi başarıyla alındı.", "backup")
    }
}

async function Channels() {
    const { OldChannels } = require("../../../../Global/Settings/Schemas")
    await OldChannels.deleteMany({});
    if (OldChannels) { await OldChannels.deleteMany({}); }
    let guild = client.guilds.cache.get(System.Guild.ID);
    if (guild) {
        guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
            let permissionss = {};
            let sayi = Number(0);
            channel.permissionOverwrites.cache.forEach((perm) => {
                let thisPermOverwrites = {};
                perm.allow.toArray().forEach(p => {
                    thisPermOverwrites[p] = true;
                });
                perm.deny.toArray().forEach(p => {
                    thisPermOverwrites[p] = false;
                });
                permissionss[sayi] = { permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites };
                sayi++;
            });

            OldChannels.findOne({ guildID: System.Guild.ID, channelID: channel.id }, async (err, savedChannel) => {
                if (!savedChannel) {
                    if (channel.type === Discord.ChannelType.GuildVoice) {
                        let newChannelSchema = new OldChannels({
                            guildID: System.Guild.ID,
                            channelID: channel.id,
                            name: channel.name,
                            parentID: channel.parentId,
                            position: channel.position,
                            time: Date.now(),
                            type: channel.type,
                            permissionOverwrites: permissionss,
                            userLimit: channel.userLimit,
                            bitrate: channel.bitrate
                        });
                        newChannelSchema.save();
                    } else if (channel.type === Discord.ChannelType.GuildCategory) {
                        let newChannelSchema = new OldChannels({
                            guildID: System.Guild.ID,
                            channelID: channel.id,
                            name: channel.name,
                            position: channel.position,
                            time: Date.now(),
                            type: channel.type,
                            permissionOverwrites: permissionss,
                        });
                        newChannelSchema.save();
                    } else {
                        let newChannelSchema = new OldChannels({
                            guildID: System.Guild.ID,
                            channelID: channel.id,
                            name: channel.name,
                            parentID: channel.parentId,
                            position: channel.position,
                            time: Date.now(),
                            nsfw: channel.nsfw,
                            rateLimitPerUser: channel.rateLimitPerUser,
                            type: channel.type,
                            topic: channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!",
                            permissionOverwrites: permissionss,
                        });
                        newChannelSchema.save();
                    }
                } else {
                    if (channel.type === Discord.ChannelType.GuildVoice) {
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentId;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.userLimit = channel.userLimit;
                        savedChannel.bitrate = channel.bitrate;
                        savedChannel.save();
                    } else if (channel.type === "GUILD_CATEGORY") {
                        savedChannel.name = channel.name;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                    } else {
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentId;
                        savedChannel.position = channel.position;
                        savedChannel.nsfw = channel.nsfw;
                        savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.topic = channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!";
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                    }
                };
            });
        });
        client._logger.log("OLD BACKUP KANAL => Manuel yedekleme işlemi başarıyla alındı.", "backup")
    }
}