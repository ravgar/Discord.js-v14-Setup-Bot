const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Client, GatewayIntentBits } = require("discord.js")
const children = require("child_process");
const bots = global.allbots = [];
class BotSettings extends Command {
    constructor(client) {
        super(client, {
            name: "ba",
            description: "Bu komut ile bot ayarlarını yapabilirsin!",
            usage: "botayar",
            category: "Guild",
            aliases: ["botayar", "botsettings"],
            enabled: true,
        });
    }


    async onLoad(client) {
        const tokens = [
            system.Tokens.Executive,
            system.Tokens.ExecutivePlus,
            system.Tokens.GuardI,
            system.Tokens.GuardII,
            system.Tokens.GuardIII,
            system.Tokens.GuardIV
        ]
        tokens.forEach(async (token) => {
            const botClient = new Client({
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent],
                presence: {
                    activities: [{
                        name: "RAVGAR",
                        type: "LISTENING"
                    }],
                    status: "offline",
                },
            });

            botClient.on("ready", async () => {
                bots.push(botClient);
            });

            await botClient.login(token);
        });
    }

    async onRequest(client, message, args, embed, ravgar) {
        const sonbots = [];
        bots.forEach((bot) => {
            sonbots.push({
                value: bot.user.id,
                description: `${bot.user.id}`,
                label: `${bot.user.tag}`,
                emoji: { id: "929845720138272818" },
            })
        });

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId("botsmenu")
                .setPlaceholder("</> | Güncellemek İstediğiniz Botu Seçin!")
                .addOptions(sonbots)
        )
        const row2 = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("allres").setLabel("Tüm Botları Yeniden Başlat").setEmoji("926954863647150140").setStyle(Discord.ButtonStyle.Primary),
        );
        const mesaj = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} Aşağıda sıralanmakta olan botların, ismini veya profil fotoğrafını değiştirmek istediğinz botu seçin.`)], components: [row, row2] });
        const filter = e => e.user.id === message.author.id;
        const collector = mesaj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });

        collector.on("collect", async (menu) => {
            if (menu.customId === "botsmenu") {
                if (!menu.values) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });

                const botclient = allbots.find((bot) => bot.user.id === menu.values[0]);
                if (!botclient) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });
                const newrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder().setCustomId("botupdateavatar").setLabel("Profil Fotoğrafını Değiştir").setEmoji("926954863647150140").setStyle(Discord.ButtonStyle.Primary),
                    new Discord.ButtonBuilder().setCustomId("botupdatename").setLabel("İsmini Değiştir").setEmoji("926955061446320208").setStyle(Discord.ButtonStyle.Primary),
                );
                if (mesaj) mesaj.delete().catch(() => { });
                await message.channel.send({ embeds: [embed.setDescription(`${botclient.user} isimli bot üzerinde hangi işlemi yapmak istersin?`)], components: [newrow] }).then(async (msj) => {
                    const filter = e => e.user.id === message.member.id;
                    const col = msj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });

                    col.on("collect", async (button) => {
                        const botclient = allbots.find((bot) => bot.user.id === menu.values[0]);
                        if (!botclient) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });
                        if (button.customId === "botupdateavatar") {
                            if (msj) msj.edit({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} ${botclient.user} isimli botun yeni profil resmini yükleyin veya bağlantısını girin. İşleminizi \`60 saniye\` içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için \`iptal\` yazabilirsin.`)], components: [] });
                            const avatarfilter = e => e.author.id === message.member.id;
                            const coll = msj.channel.createMessageCollector({ filter: avatarfilter, time: 60000, max: 1, errors: ["time"] });

                            coll.on("collect", async (msg) => {
                                if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
                                    if (msj) msj.delete().catch(() => { });
                                    message.react(message.guild.findEmoji(system.Emojis.Iptal));
                                    await button.reply({ content: "Profil değiştirme işlemi iptal edildi.", ephemeral: true });
                                    return;
                                }
                                const bekle = await message.channel.send({ content: "Profil resmi değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin." });
                                const avatar = msg.content || msg.attachments.first().url;
                                if (!avatar) {
                                    message.react(message.guild.findEmoji(system.Emojis.Iptal));
                                    if (msj) msj.delete().catch(() => { });
                                    button.reply({ content: "Profil resmi belirtmediğiniz için işlem iptal edildi.", ephemeral: true });
                                    return;
                                }
                                botclient.user.setAvatar(avatar).then(() => {
                                    if (bekle) bekle.delete().catch(() => { });
                                    if (msj) msj.delete().catch(() => { });
                                    message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} ${botclient.user} isimli botun profil resmi başarıyla güncellendi.`).setThumbnail(botclient.user.avatarURL())] }).then((s) => message.react(emojiler.Onay) && setTimeout(() => { if (s) s.delete(); }, 20000));
                                    const log = message.guild.findChannel("bot-logs")
                                    if (log) log.send({ embeds: [embed.setDescription(`${botclient.user} isimli botun profil resmi ${message.member.toString()} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde değiştirildi.`).setThumbnail(botclient.user.avatarURL())] });
                                }).catch(() => {
                                    if (bekle) bekle.delete().catch(() => { });
                                    if (msj) msj.delete().catch(() => { });
                                    message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Iptal)} Profil resmi güncellenemedi, çünkü biraz beklemem gerekiyor.`)] }).then((s) => message.react(message.guild.findEmoji(system.Emojis.Iptal)) && setTimeout(() => { if (s) s.delete(); }, 10000));
                                });
                            });

                            coll.on("end", () => {
                                if (msj) msj.delete().catch(() => { });
                            });
                        } else if (button.customId === "botupdatename") {
                            if (msj) msj.edit({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} ${botclient.user} isimli botun yeni ismini girin. İşleminizi \`60 saniye\` içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için \`iptal\` yazabilirsin.`)], components: [] });
                            const isimfilter = e => e.author.id === message.member.id;
                            const coll = msj.channel.createMessageCollector({ filter: isimfilter, time: 60000, max: 1, errors: ["time"] });

                            coll.on("collect", async (msg) => {
                                if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
                                    if (msg) msg.delete().catch(() => { });
                                    message.react(message.guild.findEmoji(system.Emojis.Iptal));
                                    await button.reply({ content: "Profil değiştirme işlemi iptal edildi.", ephemeral: true });
                                    return;
                                }
                                const eskinick = botclient.user.username;
                                const bekle = await message.channel.send({ content: "İsim değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin." });
                                const isim = msg.content;
                                if (!isim) {
                                    message.react(message.guild.findEmoji(system.Emojis.Iptal));
                                    if (msj) msj.delete().catch(() => { });
                                    button.reply({ content: "İsim belirtmediğiniz için işlem iptal edildi.", ephemeral: true });
                                    return;
                                }
                                botclient.user.setUsername(isim).then(() => {
                                    if (bekle) bekle.delete().catch(() => { });
                                    if (msj) msj.delete().catch(() => { });
                                    message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} ${botclient.user} isimli botun ismi başarıyla güncellendi.`).addField("İsim", `\`${eskinick}\` --> \`${botclient.user.username}\``)] }).then((s) => message.react(emojiler.Onay) && setTimeout(() => { if (s) s.delete(); }, 20000));
                                    const log = message.guild.findChannel("bot-logs")
                                    if (log) log.send({ embeds: [embed.setDescription(`${botclient.user} isimli botun ismi ${message.member.toString()} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde değiştirildi.`)] });
                                }).catch(() => {
                                    if (bekle) bekle.delete().catch(() => { });
                                    if (msj) msj.delete().catch(() => { });
                                    message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Iptal)} İsim güncellenemedi, çünkü biraz beklemem gerekiyor.`)] }).then((s) => message.react(message.guild.findEmoji(system.Emojis.Iptal)) && setTimeout(() => { if (s) s.delete(); }, 10000));
                                });
                            });

                            coll.on("end", () => {
                                if (msj) msj.delete().catch(() => { });
                            });
                        }
                    });
                });
            } 
            if (menu.customId == "allres") {
                menu.deferUpdate(true);
                if (mesaj) mesaj.delete().catch(() => { });
                children.exec(`pm2 restart all`);
            }
        });

        collector.on("end", async () => {
            message.react(message.guild.findEmoji(system.Emojis.Iptal));
            if (mesaj) mesaj.delete().catch(() => { });
        });
    }
}

module.exports = BotSettings
