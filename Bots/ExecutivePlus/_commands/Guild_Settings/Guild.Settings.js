const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Upstaff, User } = require("../../../../Global/Settings/Schemas")
class GuildSettings extends Command {
    constructor(client) {
        super(client, {
            name: "sunucu",
            description: "Bu komut ile sunucu içi gerekli tüm ayarlamaları yapabilirsin!",
            usage: ".sunucu <Args> <Argüman>",
            category: "Guild",
            aliases: ["config", "server", "ayarlar"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let ayar = args[0];
        if (!ayar) {
            const ayarlar = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.SelectMenuBuilder()
                        .setCustomId('kategorisecim')
                        .setPlaceholder('⚙️ Ayar Kategorisi Seçin')
                        .addOptions(
                            {
                                label: 'Genel Sunucu Ayarları',
                                description: `${message.guild.name} Genel sunucu ayarları!`,
                                value: 'genelsunucu',
                                emoji: { "id": "725341147932917761" },
                            },
                            {
                                label: 'Rol Ayarları',
                                description: `${message.guild.name} Rol ayarları!`,
                                value: 'rolayar',
                                emoji: { "id": "906615014113288313" }
                            },
                            {
                                label: 'Kanal Ayarları',
                                description: `${message.guild.name} Kanal ayarları!`,
                                value: 'kanalayar',
                                emoji: { "id": "989019983373828186" }
                            },
                        ),
                );
            let ayarmsg = await message.channel.send({ content: `Lütfen aşağıdan yapmak istediğiniz ayar kategorisini seçin!`, components: [ayarlar] })

            var filter = (component) => component.user.id === message.author.id;
            const collector = ayarmsg.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (interaction) => {
                if (interaction.customId == "kategorisecim") {
                    if (interaction.values[0] == "genelsunucu") {
                        interaction.reply({
                            embeds: [new Discord.EmbedBuilder().setTitle("Genel Sunucu Ayarları").setDescription(`
Sunucu tagları : ${ravgar?.tags ? `**${ravgar?.tags.map(x => `${x}`).join(", ")}**` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config tag <Tagınız>\`)
Sunucu ikinci tagı : ${ravgar?.unTag ? `**${ravgar?.unTag}**` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config untag <Tagınız>\`)
Sunucu özel url : ${ravgar?.guildURL ? ravgar?.guildURL : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config url <Urlniz>\`)
Sunucu founderlar : ${ravgar?.Founders ? `${ravgar?.Founders.map(x => `<@${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config founders <ravgar/ID>\`)
                            
Taglı alım modu : ${ravgar?.tagMode ? `${message.guild.findEmoji(system.Emojis.Onay)}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config tagmode\`)
Staff modu : ${ravgar?.staffMode ? `${message.guild.findEmoji(system.Emojis.Onay)}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config staffmod\`)
Register etiket modu : ${ravgar?.regMent ? `${message.guild.findEmoji(system.Emojis.Onay)}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config regment\`)
Underworld modu : ${ravgar?.underWorldSystem ? `${message.guild.findEmoji(system.Emojis.Onay)}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config underworlsistem\`)
Chat Guard modu : ${ravgar?.chatGuard ? `${message.guild.findEmoji(system.Emojis.Onay)}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config chatguard\`)

Voice Count : ${ravgar?.voiceCount} (\`.config voicecount Sayı\`)
Voice Coin : ${ravgar?.voiceCoin} (\`.config voicecoin Sayı\`)
Message Count : ${ravgar?.messageCount} (\`.config messageCount Sayı\`)
Message Coin : ${ravgar?.messageCoin} (\`.config messageCoin Sayı\`)
Register Coin : ${ravgar?.registerCoin} (\`.config registerCoin Sayı\`)
Invite Coin : ${ravgar?.inviteCoin} (\`.config inviteCoin Sayı\`)
Tagged Coin : ${ravgar?.taggedCoin} (\`.config taggedCoin Sayı\`)

`)],
                            ephemeral: true
                        })
                    }
                    if (interaction.values[0] == "rolayar") {
                        await interaction.reply({
                            ephemeral: true,
                            embeds: [new Discord.EmbedBuilder().setTitle("Rol Ayarları").setDescription(`
Register hammer rolleri : ${ravgar?.registerHammer ? `${ravgar?.registerHammer.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config registerhammer <Rol/ID>\`)
Voice Mute hammer rolleri : ${ravgar?.vmuteHammer ? `${ravgar?.vmuteHammer.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config vmutehammer <Rol/ID>\`)
Mute hammer rolleri : ${ravgar?.muteHammer ? `${ravgar?.muteHammer.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config mutehammer <Rol/ID>\`)
Ban hammer rolleri : ${ravgar?.banHammer ? `${ravgar?.banHammer.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config banhammer <Rol/ID>\`)
Jail hammer rolleri : ${ravgar?.jailHammer ? `${ravgar?.jailHammer.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config jailhammer <Rol/ID>\`)
Founder rolleri : ${ravgar?.foundingRoles ? `${ravgar?.foundingRoles.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config foundingroles <Rol/ID>\`)

Min yetkili rolü : ${ravgar?.minStaff ? `<@&${ravgar?.minStaff}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config minStaff <Rol/ID>\`)
Jail rolü : ${ravgar?.jailedRole ? `<@&${ravgar?.jailedRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config jailedrole <Rol/ID>\`)
Voice Muted rolü : ${ravgar?.vmutedRole ? `<@&${ravgar?.vmutedRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config vmutedrol <Rol/ID>\`)
Muted rolü : ${ravgar?.mutedRole ? `<@&${ravgar?.mutedRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config mutedrol <Rol/ID>\`)
Şüpheli rolü : ${ravgar?.suspectRole ? `<@&${ravgar?.suspectRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config şüphelirol <Rol/ID>\`)
Yasaklı Tag rolü : ${ravgar?.bannedTagRole ? `<@&${ravgar?.bannedTagRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config yasaklıtagrolü <Rol/ID>\`)
Taglı Rolü : ${ravgar?.tagRole ? `<@&${ravgar?.tagRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config tagrol <Rol/ID>\`)
Vip Rolü : ${ravgar?.vipRole ? `<@&${ravgar?.vipRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config viprol <Rol/ID>\`)

Booster rolü : ${ravgar?.boosterRole ? `<@&${ravgar?.boosterRole}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config boosterrolü <Rol/ID>\`)

Erkek rolleri : ${ravgar?.manRoles ? `${ravgar?.manRoles.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config erkekrolleri <Rol/ID>\`)
Kadın rolleri : ${ravgar?.womanRoles ? `${ravgar?.womanRoles.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config kadınrolleri <Rol/ID>\`)

Haftanın Lideri rolü: ${ravgar?.weeklyAuth ? `<@&${ravgar?.weeklyAuth}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config haftalıklider <Rol/ID>\`)
`)]
                        })
                    }
                    if (interaction.values[0] == "kanalayar") {
                        interaction.reply({
                            ephemeral: true,
                            embeds: [new Discord.EmbedBuilder().setTitle("Kanal Ayarları").setDescription(`
Register kanalı : ${ravgar?.welcomeChannel ? `<#${ravgar?.welcomeChannel}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config registerkanal <Kanal/ID>\`)
Invite kanalı : ${ravgar?.inviteLog ? `<#${ravgar?.inviteLog}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config invitelog <Kanal/ID>\`)
Bot Ses kanalı : ${ravgar?.botVoiceChannel ? `<#${ravgar?.botVoiceChannel}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config botseskanal <Kanal/ID>\`)
Chat kanalı : ${ravgar?.chatChannel ? `<#${ravgar?.chatChannel}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config chatkanal <Kanal/ID>\`)
Stagram kanalı : ${ravgar?.stagramChannel ? `<#${ravgar?.stagramChannel}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config stagramkanal <Kanal/ID>\`)
Komut kanalları : ${ravgar?.botCommands ? `${ravgar?.botCommands.map(x => `<#${x}>`).join(", ")}` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config komutkanal <Kanal/ID>\`)
Canlı destek kategorisi : ${ravgar?.supportCategory ? `<#${ravgar?.supportCategory}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config supcat <Kategori/ID>\`)   
Haftalık lider kanalı : ${ravgar?.weeklyAuthLog ? `<#${ravgar?.weeklyAuthLog}>` : `${message.guild.findEmoji(system.Emojis.Iptal)}`} (\`.config haftalıkliderlog <Kanal/ID>\`)    
                            `)]
                        })
                    }
                }
            })
        }

        /* AYARLAMA KISIMLARI BURADAN SONRA */
        if (["tester", "founder", "owner", "botowner", "botyetki", "founders"].some(x => ayar == x)) {
            let uye = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if (!uye) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Member}` }).sil(10);
            if (ravgar?.Founders.includes(uye.id)) {
                await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { Founders: uye.id } }, { upsert: true })
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} ${uye} Kişisi başarılı bir şekilde \`Tester\` sistemine eklendi!` }).sil(100)
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { Founders: uye.id } }, { upsert: true })
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} ${uye} Kişisi başarılı bir şekilde \`Tester\` sisteminden çıkarıldı!` }).sil(100)
            }
        }

        if (["tag", "tags", "taglar"].includes(ayar)) {
            const tag = args.splice(1).join(' ');
            if (!tag) return message.channel.send({ content: `Bir tag belirtmeyi unuttun!` }).sil(5)
            let varmi = await ravgarcik.findOne({ guildID: message.guild.id, tags: tag })
            const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("tagisil").setLabel(`${tag} tagını sil!`).setStyle(Discord.ButtonStyle.Danger))
            if (varmi) {
                let msg = await message.channel.send({ content: `Bu tag zaten ayarlanmış! Başka bir tag eklemek için lütfen farklı değer giriniz! Silmek ister misiniz ?`, components: [row] })
                var filter = (button) => button.user.id === message.member.id;
                let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

                collector.on("collect", async (button) => {
                    if (button.customId == "tagisil") {
                        if (msg) msg.delete();
                        await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { tags: tag } }, { upsert: true }).exec();
                        message.channel.send(`${message.guild.findEmoji(system.Emojis.Onay)} ${tag} tagını başarılı bir şekilde datadan sildim!`).sil(20)
                    }
                })
                collector.on("end", async () => {
                    if (msg) msg.delete();
                })
                return;
            }
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { tags: tag } }, { upsert: true }).exec();
            message.channel.send(`${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde \`Tag\` config dosyasına **${tag}** olarak ayarlandı!`)
        }

        if (["tagsız", "ikincitag", "ikincisembol", "tagsiz"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} Bir tag belirtmeyi unuttun!` }).sil(5);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { unTag: metin } }, { upsert: true }).exec();
            message.channel.send(`${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde \`İkinci Tag\` config dosyasına **${metin}** olarak ayarlandı!`)
        }

        if (["url", "guildurl", "sunucuurl", "sunucurl"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} Bir URL belirtmeyi unuttun!` }).sil(5);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { guildURL: metin } }, { upsert: true }).exec();
            message.channel.send(`${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde \`URL\` config dosyasına **${metin}** olarak ayarlandı!`)
        }


        /* KANALLAR */
        if (["welcomechannel", "teyitkanali", "teyitkanalı", "registerchat", "registerchannel"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { welcomeChannel: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["invitelog", "invitekanal", "inviteLog", "invitechannel", "invitel"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { inviteLog: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["botses", "botseskanali", "botseskanalı", "botvoice", "botkanal"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { botVoiceChannel: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["chatkanal", "genelchat", "genelsohbet", "chatkanali", "chatkanalı"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { chatChannel: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["stagramkanal", "stagramchannel", "instagramkanal", "fotokanalı", "photokanal"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { stagramChannel: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["supcat", "supportcategory", "canlidestekkategori", "canlidestek", "support"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { supportCategory: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["haftalıkliderkanal", "liderkanal", "weeklyauthlog", "liderlog", "haftalıkliderlog"].some(x => ayar == x)) {
            let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
            if (!channel) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $set: { weeklyAuthLog: channel.id } }, { upsert: true })
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarını ${channel} olarak ayarladım!` })
        }
        if (["komutkanalları", "komutkanal", "botkanalları", "botcommands", "botkomut", "botkomutkanal"].some(x => ayar == x)) {
            let kanallar;
            if (message.mentions.channels.size >= 1)
                kanallar = message.mentions.channels.map(kanal => kanal.id);
            else kanallar = args.splice(1).filter(kanal => message.guild.channels.cache.some(kanal2 => kanal == kanal2.id));
            if (kanallar.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { botCommands: kanallar } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${kanallar.map(kanal => message.guild.channels.cache.filter(kanal2 => kanal == kanal2.id).map(kanal => kanal.toString())).join(", ")} olarak ayarlandı!` })
        }

        /* ROLLER */
        if (["registerhammer", "teyitcirolleri", "registerrolleri"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { registerHammer: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["vmutehammer", "voicemutehammer", "voicemuteyetkili"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { vmuteHammer: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["mutehammer", "muteyetkili", "chatmutehammer"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { muteHammer: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["banhammer", "bancı", "banyetkili"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { banHammer: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["jailhammer", "jailci", "jailyetkili"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { jailHammer: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["manroles", "erkekrol", "erkekrolleri", "erkekrolü", "erkekroller", "manrole"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { manRoles: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["womanroles", "kadınrol", "kadınrolleri", "kadınrolü", "kızrolleri", "kızroller"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { womanRoles: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["kayıtsızrolleri", "kayıtsızrol", "unregisteroles", "kayıtsız", "unregisterrole", "unregister"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { unregisterRoles: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["foundingroles", "founderroles", "founderrol", "kurucurolleri", "kurucuroller", "kurucular"].some(x => ayar == x)) {
            let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { foundingRoles: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["jailedrol", "jailrol", "cezalırol", "cezalı", "jailrolü", "jailrolu"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { jailedRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["minyetkili", "ilkyetki", "minimumyetki"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { minStaff: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["vmutedrole", "vmutedrol", "voicemuted", "sesmuterol", "vmuterol", "voicemuterol"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { vmutedRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["muterol", "mutedrol", "muted", "chatmuterol", "cmuterol", "chatmuterolü"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { mutedRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["tagrol", "taglırol", "taglırolü", "tagrolü", "taglirol", "taglirolü"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { tagRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["şüphelirol", "şüphelirolü", "suspectrol", "suspectrole", "şüpheli"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { suspectRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["yasaklıtagrol", "yasaklıtagrolü", "bannedtagrole", "yasaklıtagrolu", "bannedtagrol"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { bannedTagRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["boosterrol", "boosterrolü", "zenginrolü", "boosterrolu", "zenginrolu"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { boosterRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["weeklyauth", "liderrol", "liderrolü", "haftalıkliderrolü", "haftalıkliderrol", "weeklyauthrol"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { weeklyAuth: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }

        if (["viprol", "viprole", "viprolü", "viprolu"].some(x => ayar == x)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
            if (!rol) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Role}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { vipRole: rol.id } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${rol} olarak ayarlandı!` })
        }
        /* Puanlar */
        if (["voicecount", "sescount"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { voiceCount: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["messagecount", "mesajcount"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { messageCount: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["voicecoin", "sescoin", "sespuan", "voicepuan"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { voiceCoin: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["messagecoin", "mesajcoin", "mesajpuan", "messagepuan"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { messageCoin: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["registercoin", "kayıtcoin", "kayıtpuan", "registerpuan"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { registerCoin: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["invitecoin", "davetcoin", "davetpuan", "invitepuan"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { inviteCoin: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        if (["taglıcoin", "taglicoin", "taggedcoin", "taglıpuan"].some(x => ayar == x)) {
            let metin = args.splice(1).join(" ");
            if (!metin) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            if (isNaN(metin)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Number}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { taggedCoin: metin } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${metin} olarak ayarlandı!` })
        }

        /* Açma Kapama */

        if (["chatguard", "Chatguard", "chatGuard", "çetkoruma"].some(x => ayar == x)) {
            if (ravgar?.chatGuard == true) {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { chatGuard: false }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı kapalı olarak ayarlandı!` })
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { chatGuard: true }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı açık olarak ayarlandı!` })
            }
        }

        if (["taglıalım", "taglialim", "taglialım", "taglıalim", "tagmode"].some(x => ayar == x)) {
            if (ravgar?.tagMode == true) {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { tagMode: false }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı kapalı olarak ayarlandı!` })
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { tagMode: true }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı açık olarak ayarlandı!` })
                const members = message.guild.members.cache.filter(member => !ravgar?.tags.some(x => member.user.tag.includes(x)) && !member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !member.roles.cache.has(ravgar?.vipRole) && !member.roles.cache.has(ravgar?.boosterRole) && !ravgar?.unregisterRoles.some(x => member.roles.cache.has(x))).array()
                for await (const member of members) {
                        await member.setRoles(ravgar?.unregisterRoles)
                        if (member.manageable) await member.setNickname(member.displayName.replace(ravgar?.tags[0], ravgar?.unTag ? ravgar?.unTag : ravgar?.tags[0]))
                        message.guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunmadığı için otomatik olarak kayıtsıza atılmıştır! (Bu işlem sunucuda taglı sistem aktif olduğu için yapılmıştır.)` });
                        const user = await User.findOne({ userID: member.id })
                        if (user?.Tagged) {
                            let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                            if (taglayanData) {
                                let taglibul = taglayanData.find(e => e.id == member.id)
                                if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                                await Upstaff.updateOne({ guildID: message.guild.id, userID: user.TaggedAuth }, { $inc: { coin: -ravgar?.taggedCoin } }, { upsert: true });
                            }
                        }
                }
            }
        }

        if (["staffmode", "yetkimodu", "yetkimod", "otoyükseltim"].some(x => ayar == x)) {
            if (ravgar?.staffMode == true) {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { staffMode: false }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı kapalı olarak ayarlandı!` })
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { staffMode: true }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı açık olarak ayarlandı!` })
            }
        }

        if (["registeretiket", "regetiket", "girişetiket", "registeretiketleme"].some(x => ayar == x)) {
            if (ravgar?.regMent == true) {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { regMent: false }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı kapal olarak ayarlandı!` })
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { regMent: true }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı açık olarak ayarlandı!` })
            }
        }

        if (["underworld", "underworldsystem", "underworldsistem", "underworldban"].some(x => ayar == x)) {
            if (ravgar?.underWorldSystem == true) {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { underWorldSystem: false }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${ravgar?.underWorldSystem ? "açık" : "kapalı"} olarak ayarlandı!` })
            } else {
                await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { underWorldSystem: true }, { upsert: true });
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${ravgar?.underWorldSystem ? "açık" : "kapalı"} olarak ayarlandı!` })
            }
        }

        /* Upstaff */

        if (["yasaklıkanallar", "puansızkanallar", "puankazanılmayankanal", "bannedchannels", "bannedchannel", "yasaklıkanal"].some(x => ayar == x)) {
            let kanallar;
            if (message.mentions.channels.size >= 1)
                kanallar = message.mentions.channels.map(kanal => kanal.id);
            else kanallar = args.splice(1).filter(kanal => message.guild.channels.cache.some(kanal2 => kanal == kanal2.id));
            if (kanallar.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { bannedChannels: kanallar } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${kanallar.map(kanal => message.guild.channels.cache.filter(kanal2 => kanal == kanal2.id).map(kanal => kanal.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["pubkat", "publickategori", "publickat", "publickatagori"].some(x => ayar == x)) {
            let kanallar;
            if (message.mentions.channels.size >= 1)
                kanallar = message.mentions.channels.map(kanal => kanal.id);
            else kanallar = args.splice(1).filter(kanal => message.guild.channels.cache.some(kanal2 => kanal == kanal2.id));
            if (kanallar.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { publicParents: kanallar } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${kanallar.map(kanal => message.guild.channels.cache.filter(kanal2 => kanal == kanal2.id).map(kanal => kanal.toString())).join(", ")} olarak ayarlandı!` })
        }

        if (["regkat", "registerkategori", "registerkat", "registerkatagori"].some(x => ayar == x)) {
            let kanallar;
            if (message.mentions.channels.size >= 1)
                kanallar = message.mentions.channels.map(kanal => kanal.id);
            else kanallar = args.splice(1).filter(kanal => message.guild.channels.cache.some(kanal2 => kanal == kanal2.id));
            if (kanallar.length <= 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.Channel}` }).sil(10);
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { registerParents: kanallar } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} başarılı bir şekilde **${ayar}** ayarı ${kanallar.map(kanal => message.guild.channels.cache.filter(kanal2 => kanal == kanal2.id).map(kanal => kanal.toString())).join(", ")} olarak ayarlandı!` })
        }

    }
}

module.exports = GuildSettings
