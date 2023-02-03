const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Economy } = require("../../../../Global/Settings/Schemas")
class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "eprofil",
            description: "Sunucu içerisi ekonomi profilinizi görüntülersiniz.",
            usage: "eprofil",
            category: "Founders",
            aliases: ["daily", "coin", "param", "günlük", "market", "satınal", "ekonomi"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (ravgar?.economySystem == false) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} \`HATA!\` Bu sunucuda şuanda **Ekonomi Sistemi** kapalı durumdadır!` }).sil(30);
        const coin = await Economy.findOne({ userID: message.member.id });
        let yeniGün = coin?.dailyCoin + (1 * 24 * 60 * 60 * 1000);
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("günlük").setEmoji("829720720941514793").setLabel(`Günlük`).setStyle(Date.now() < yeniGün ? Discord.ButtonStyle.Danger : Discord.ButtonStyle.Success).setDisabled(Date.now() < yeniGün ? true : false),
            new Discord.ButtonBuilder().setCustomId("market").setEmoji("925052991994753044").setLabel("Market").setStyle(ravgar?.ecoProduct.length < 0 ? Discord.ButtonStyle.Danger : Discord.ButtonStyle.Success).setDisabled(ravgar?.ecoProduct.length < 0 ? true : false),
        )
        if (ravgar?.Founders.includes(message.member.id) || system.Bot.Roots.includes(message.member.id)) {
            row.addComponents(
                new Discord.ButtonBuilder().setCustomId("urunekle").setEmoji("903329782803087391").setLabel("Markete Ürün Ekle").setStyle(Discord.ButtonStyle.Success)
            )
        }
        let epro = await message.channel.send({
            content: `Şuanda toplam \`${coin?.coin ? coin?.coin : "0"}\` bakiyeniz bulunmakta!`,
            components: [row]
        })
        var filter = (component) => component.user.id === message.author.id;
        const collector = epro.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (interaction) => {
            interaction.deferUpdate();
            if (interaction.customId == "günlük") {
                if (epro) epro.delete();
                let daily = Math.random();
                daily = daily * (500 - 200);
                daily = Math.floor(daily) + 200
                await Economy.updateOne({ userID: message.member.id }, { $set: { dailyCoin: Date.now() }, $inc: { coin: daily } }, { upsert: true }).exec();
                message.react(message.guild.findEmoji(system.Emojis.Onay))
                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${message.author} Tebrikler! Günlük \`${daily}\` coin ödül kazandınız!` }).sil(200);
            }
            if (interaction.customId == "market") {
                if (ravgar?.ecoProduct.length < 0) return await interaction.reply({ content: `Malesef sistemimde ürün bulunmamakta. Ürünler eklendiğinde tekrar beklerim!`, ephemeral: true })
                let listele = [];
                ravgar?.ecoProduct.map(async x => {
                    listele.push({ label: x.proName, description: x.proPrice, value: x.proName })
                })

                console.log(listele)
                console.log("------")
                console.log(ravgar?.ecoProduct)
                const urunler = new Discord.ActionRowBuilder().addComponents(
                    new Discord.SelectMenuBuilder().setCustomId('select').setPlaceholder('Market')
                        .addOptions(listele)
                )
                console.log(listele)
                console.log("-------")
                console.log(urunler)
                if (epro) epro.edit({
                    content: `\`${message.guild.name}\` Mağazasına hoş geldin! Hesabında güncel olarak \`${coin?.coin ? coin?.coin : "0"}\` coinin bulunmakta! Unutmaki sadece coinin yettiği ürünleri alabilirsin. Mutlu alışverişler!`,
                    components: [urunler]
                })
                var filter = (component) => component.user.id === message.author.id;
                const collector = epro.createMessageComponentCollector({ filter, time: 30000 })
                collector.on('collect', async (interaction) => {
                    if (ravgar?.ecoProduct.find((e) => e.proName == interaction.values[0])) {
                        let alıncakürün = ravgar?.ecoProduct.find((e) => e.proName == interaction.values[0])
                        if (alıncakürün.proPrice > coin?.coin) {
                            interaction.deferUpdate();
                            if (epro) epro.delete();
                        } else {
                            interaction.deferUpdate();
                            if (epro) epro.delete();

                        }
                    }

                    if (interaction.values[0] == "kapat") {
                        if (epro) epro.delete();
                    }
                })
            }
            if (interaction.customId == "urunekle") {
                if (epro) epro.delete()
                await interaction.channel.send({ content: `Lütfen eklenecek ürünün coinini belirtiniz!` }).then(async (coinbelirleme) => {
                    let urunekleme = {
                        coin: String,
                        isim: String,
                    }
                    var filt = m => m.author.id == message.member.id
                    let collector = coinbelirleme.channel.createMessageCollector({ filter: filt, time: 60000, max: 1, errors: ["time"] })
                    collector.on("collect", async (m) => {
                        let mesaj = m.content
                        if (mesaj == "iptal") {
                            if (coinbelirleme) coinbelirleme.edit({ content: `Başarılı bir şekilde iptal edildi!` }).sil(20);
                        }
                        if (isNaN(mesaj)) return coinbelirleme.edit({ content: `Bir sayı belirtmelisin! Baştan dene!` }).sil(10);
                        urunekleme.coin = mesaj
                        if (coinbelirleme) coinbelirleme.delete();
                        message.channel.send({ content: `Eklenecek ürünün coini \`${urunekleme.coin}\` olarak ayarlandı! Şimdi ise ürünün ismini kanala gönderiniz!` }).then(async (isimbelirleme) => {
                            var filt = m => m.author.id == message.member.id
                            let collector = isimbelirleme.channel.createMessageCollector({ filter: filt, time: 60000, max: 1, errors: ["time"] })
                            collector.on("collect", async (m) => {
                                let ismi = m.content
                                if (ismi == "iptal") {
                                    if (isimbelirleme) isimbelirleme.edit({ content: `Başarılı bir şekilde iptal edildi!` }).sil(20);
                                }
                                urunekleme.isim = ismi
                                if (isimbelirleme) isimbelirleme.delete();
                                message.react(message.guild.findEmoji(system.Emojis.Onay))
                                message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} Tebrikler! Başarılı bir şekilde \`${urunekleme.isim}\` isminde \`${urunekleme.coin}\` coinde bir ürün eklemiş oldunuz!` })

                                await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { ecoProduct: { proName: urunekleme.isim, proPrice: urunekleme.coin } } }, { upsert: true })


                            })
                        })
                    })
                })
            }
        })
    }
}

module.exports = Daily

