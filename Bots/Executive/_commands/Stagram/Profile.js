const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Stagram } = require("../../../../Global/Settings/Schemas");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
class Profile extends Command {
    constructor(client) {
        super(client, {
            name: "profil",
            description: "Sunucu içerisi profilinizle ilgili işlemleri yapmanızı sağlar.",
            usage: "profil",
            category: "Stagram",
            aliases: ["profile", "stagram"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
        client.on("interactionCreate", async (interaction) => {
            const channel = interaction.guild.findChannel("stagram")
            if (!channel) return;
            if (channel.threads.cache.find(x => x.name == interaction.customId)) {
                const likes = await Stagram.findOne({ Post: interaction.message.id })
                if (likes?.PostLikers.some(x => x == interaction.member.id)) {
                    const dislike = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setCustomId("begenicek").setLabel("Beğeniyi Geri Çek!").setStyle(Discord.ButtonStyle.Danger)
                    )
                    await interaction.reply({ content: `Bu postu zaten beğenmişsin! Beğenini geri mi çekmek istiyorsun ?`, components: [dislike], ephemeral: true })
                    client.on("interactionCreate", async (button) => {
                        if (button.customId == "begenicek") {
                            await Stagram.updateOne({ userID: interaction.customId.slice(0, 18) }, { $inc: { TopLike: -1 } }, { upsert: true }).exec();
                            await Stagram.updateOne({ Post: interaction.message.id }, { $inc: { PostLike: -1, } }, { upsert: true }).exec();
                            await Stagram.updateOne({ Post: interaction.message.id }, { $pull: { PostLikers: interaction.member.id, } }, { upsert: true }).exec();
                            await button.reply({ content: `Başarılı bir şekilde beğeniyi geri çektin!`, ephemeral: true })
                            client.channels.cache.get(interaction.message.id).send({ content: `${button.member.user.username} kişisi beğenisini geri çekti ve postun beğeni sayısı \`${likes?.PostLike ? likes.PostLike - 1 : "1"}\` oldu!` })
                        }
                    })
                }
                const toplike = await Stagram.findOne({ userID: interaction.customId.slice(0, 18) })
                await Stagram.updateOne({ userID: interaction.customId.slice(0, 18) }, { $inc: { TopLike: 1 } }, { upsert: true }).exec();
                await Stagram.updateOne({ Post: interaction.message.id }, { $inc: { PostLike: 1, } }, { upsert: true }).exec();
                await Stagram.updateOne({ Post: interaction.message.id }, { $push: { PostLikers: interaction.member.id, } }, { upsert: true }).exec();
                await interaction.reply({
                    content: `Tebrikler! Başarılı bir şekilde ${interaction.guild.members.cache.get(interaction.customId.slice(0, 18))} kişisinin gönderisini beğendin! Ve toplam beğeni sayısı \`${likes?.PostLike ? likes.PostLike + 1 : "1"}\` oldu!`,
                    ephemeral: true
                })
                channel.threads.cache.find(x => x.name == interaction.customId).send({
                    content: `${interaction.member.user.username} kişisi postu beğendi ve postun toplam beğeni sayısı \`${likes?.PostLike ? likes.PostLike + 1 : "1"}\` oldu! Üyenin aldığı toplam beğeni sayısı \`${toplike?.TopLike ? toplike.TopLike + 1 : "1"}\` oldu!`
                })
            }


            if (channel.threads.cache.find(x => x.name.startsWith(interaction.customId.slice(0, 18)))) {
                let sayi = getRandomInt(1, 1000)
                const modal = new Modal()
                    .setCustomId(`${sayi}`)
                    .setTitle('Gönderiye Yorum Yap!')
                    .addComponents(
                        new TextInputComponent()
                            .setCustomId(`${sayi}-${interaction.member.id}`)
                            .setLabel('Yorumunuz')
                            .setStyle('LONG')
                            .setPlaceholder('Yorumunuzu buraya yazmalısınız!')
                            .setRequired(true),
                    );
                showModal(modal, {
                    client: client,
                    interaction: interaction,
                });
                client.on('modalSubmit', async (modal) => {
                    if (modal.customId === `${sayi}`) {
                        const channelId = await Stagram.findOne({ Post: interaction.message.id });
                        const yorum = modal.getTextInputValue(`${sayi}-${interaction.member.id}`);
                        await modal.deferReply({ ephemeral: true })
                        modal.followUp({ content: `${yorum} içerikli yorumun başarılı bir şekilde paylaşıldı!` })
                        client.channels.cache.get(channelId?.Post).send({
                            content: `${interaction.member.user.username} kişisinin yorumu: \`${yorum}\``
                        })
                    }
                });

            }
        })
    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        embed.setAuthor({
            name: member.user.tag,
            iconURL: member.user.avatarURL({ dynamic: true, size: 1024 })
        })
        const profile = await Stagram.findOne({ userID: member.id })
        if (!args[0] || member) {
            if (profile?.Status == false) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Hata! Bir profil oluşturmalısın!`})
            const profilButon = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId(`kadideg`).setLabel("Kullancıı Adı Değiştir!").setStyle(Discord.ButtonStyle.Success).setDisabled(member.id == message.member.id ? false : true),
                new Discord.ButtonBuilder().setCustomId(`yorumkapat`).setLabel(`${profile?.comMode ? "Yorum Yapmayı Kapat!" : "Yorum Yapmayı Aç"}`).setStyle(Discord.ButtonStyle.Success).setDisabled(member.id == message.member.id ? false : true),
                new Discord.ButtonBuilder().setCustomId(`profilsil`).setLabel("Profili Sil!").setStyle(Discord.ButtonStyle.Danger).setDisabled(member.id == message.member.id ? false : true),
            )
            if (!profile && profile?.Status == false) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Bir profilin bulunmamakta! Oluşturmak için \`.profil oluştur\`` }).sil(20)
            if (profile?.Picture) {
                embed.setThumbnail(profile?.Picture)
            }
            if (member.presence.activities.some(x => x.type == 2)) {
                let sponame;
                let spoauth;
                member.presence.activities.some(x => { sponame = x.details })
                member.presence.activities.some(x => { spoauth = x.state })
                embed.addFields([{
                    name: `Spotify Bilgileri`, value: `\` ❯ \` Şarkı İsmi: **${sponame}**\n\` ❯ \` Şarkıcı(lar): **${spoauth}**`,
                }])
            }
            let prof = await message.channel.send({
                components: [profilButon],
                embeds: [embed.setDescription(`
**${profile?.UserName}** kullanıcı adlı kişinin profili;

\` ❯ \` Profilin oluşturulma zamanı : **<t:${Math.floor(profile?.Date / 1000)}:R>**
    
\` ❯ \` Toplam takipçi sayısı : **${profile?.FollowersNumber ? profile?.FollowersNumber : "0"}**
\` ❯ \` Toplam beğeni sayısı : **${profile?.TopLike ? profile?.TopLike : "0"}**

\` ❯ \` Son paylaşım tarihin : **${profile?.LastPost ? `<t:${Math.floor(profile?.LastPost / 1000)}:R>` : "Paylaşım yapılmamış!"}**
\` ❯ \` Takipçilerin : ${profile?.Followers.length > 0 ? `${profile?.Followers.map(x => `${message.guild.members.cache.get(x)}`)}` : "Malesef takipçin yok!"}
                    `)]
            })
            var filter = (component) => component.user.id === message.author.id;
            const collector = prof.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (interaction) => {
                interaction.deferUpdate();
                if (interaction.customId == "kadideg") {
                    if (prof) prof.edit({
                        components: [],
                        embeds: [new Discord.EmbedBuilder().setDescription(`Lütfen yeni ismini belirle!!`)]
                    }).then(async (kadibelirleme) => {
                        var filt = m => m.author.id == message.member.id
                        let collector = kadibelirleme.channel.createMessageCollector({ filter: filt, time: 60000, max: 1, errors: ["time"] })
                        collector.on("collect", async (m) => {
                            await Stagram.updateOne({ userID: member.id }, { $set: { UserName: m.content } }, { upsert: true }).exec();
                            if (kadibelirleme) kadibelirleme.edit({
                                embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} Kullanıcı adın **${m.content}** olarak değiştirildi!`)]
                            }).sil(20)
                        })
                    })
                }
                if (interaction.customId == "profilsil") {
                    await Stagram.deleteOne({ userID: member.id });
                    message.react(message.guild.findEmoji(system.Emojis.Onay))
                    if (prof) prof.edit({
                        components: [],
                        embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} başarılı şekilde profilin silindi!`)]
                    })
                }
                if (interaction.customId == "yorumkapat") {
                    console.log(profile?.comMode)
                    if (profile?.comMode == true) {
                        await Stagram.findOneAndUpdate({ userID: member.id }, { comMode: false }, { upsert: true });
                    } else if (profile?.comMode == false) {
                        await Stagram.findOneAndUpdate({ userID: member.id }, { comMode: true }, { upsert: true });
                    }
                    if (prof) prof.delete();
                    message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde yorum özelliği güncellendi!` }).sil(20)
                }
            })
        }
        if (["oluştur", "create", "olustur"].some(x => x == args[0])) {
            if (!args.slice(1).join(" ")) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Lütfen profiliniz için bir isim belirleyin!` }).sil(10);
            const profils = await Stagram.find({})
            profils.map(x => {
                if (x.UserName == args.slice(1).join(" ")) {
                    return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} bu kullanıcı adına ait bir hesap bulunmakta!` }).sil(10)
                }
            })
            const profilss = await Stagram.findOne({ userID: member.id })
            if (profilss?.Status == true) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Zaten bir profile sahipsin!` }).sil(10)
            await Stagram.findOneAndUpdate({ userID: member.id }, { Status: true }, { upsert: true });
            await Stagram.updateOne({ userID: member.id }, { $set: { UserName: args.slice(1).join(" "), Date: Date.now(), comMode: true } }, { upsert: true }).exec();
            message.channel.send({ content: `Başarılı bir şekilde profiliniz oluşturuldu! \`.profil\` yazarak profilinize erişebilirsiniz!` }).sil(100)
            await message.react(message.guild.findEmoji(system.Emojis.Onay));
        }
        if (["resim", "fotoğraf", "picture"].some(x => x == args[0])) {
            if (!profile && profile?.Status == false) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Bir profilin bulunmamakta! Oluşturmak için \`.profil oluştur\`` }).sil(20)
            const resim = args.slice(1).join(" ") || message.attachments.first().url
            if (!resim) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Bir resim belirtmelisin!` }).sil(10);
            await Stagram.updateOne({ userID: member.id }, { $set: { Picture: resim } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Başarılı bir şekilde profiliniz için resminiz ayarlandı!` }).sil(20)
        }
        const etkilesim = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId(`${message.member.id}-yorumlar!`).setLabel(`❤️ Beğen!`).setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder().setCustomId(`${message.member.id}`).setLabel(`💬 Yorum Yap!`).setStyle(Discord.ButtonStyle.Primary).setDisabled(profile?.comMode ? false : true)
        )
        if (args[0] == "paylaş") {
            if (message) message.delete();
            if (!profile && profile?.Status == false) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} Bir profilin bulunmamakta! Oluşturmak için \`.profil oluştur\`` }).sil(20)
            const image = args.slice(1).join(" ") || message.attachments.first().url
            if (!image) return message.channel.send({ content: `Fotoğraf belirtmeyi unuttun!` }).sil(10)
            const com = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId("onayla").setLabel("Onayla!").setStyle(Discord.ButtonStyle.Success),
                new Discord.ButtonBuilder().setCustomId("iptal").setLabel("Onaylama!").setStyle(Discord.ButtonStyle.Danger)
            )
            let onaylama = await message.guild.findChannel("stagram-log").send({
                content: `${member} (\`${member.id}\`) kişisi yeni bir resim paylaştı onaylıyor musunuz?`,
                embeds: [new Discord.EmbedBuilder().setImage(image)],
                components: [com]
            })
            var filter = (button) => system.Bot.Roots.includes(button.user.id);
            const collector = onaylama.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (interaction) => {
                interaction.deferUpdate();
                if (interaction.customId == "onayla") {
                    if (onaylama) onaylama.delete();
                    await message.guild.findChannel("stagram").send({
                        content: `> [${message.member} kişisi yeni bir fotoğraf paylaştı!]`,
                        embeds: [new Discord.EmbedBuilder().setImage(image)],
                        components: [etkilesim]
                    }).then(async x => {
                        await x.startThread({
                            name: `${message.member.id}-yorumlar!`,
                            reason: `${message.member.user.username} Yorumları!`,
                        }).then(async a => {
                            await Stagram.updateOne({ Post: a.id }, { $set: { Post: a.id } }, { upsert: true }).exec();
                            await Stagram.updateOne({ userID: message.member.id }, { $set: { LastPost: Date.now() } }, { upsert: true }).exec();
                            a.send({
                                content: `Bu kanalda ${message.member.user.username} kişisine ait yorumları görebilirsiniz! Yorum yapmak için butonları kullanabilrsiniz!`
                            })
                        })
                    })
                }
                if (interaction.customId == "iptal") {
                    if (onaylama) onaylama.delete();
                    message.channel.send({ content: `Başarılı bir şekilde iptal edildi! ${message.guild.findEmoji(system.Emojis.Onay)}` })
                }
            })
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Profile
