
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { GiveAways } = require("../../../../Global/Settings/Schemas")
const ms = require("ms")
class GiveAway extends Command {
    constructor(client) {
        super(client, {
            name: "g",
            description: "Sunucu içerisi çekiliş yapmanızı sağlar!",
            usage: ".g <Süre> <Kazanan> <Ödül>",
            category: "Founders",
            aliases: ["çekiliş", "giveaway"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!ravgar?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let zaman = args[0]
        let kazanan = args[1]
        let odul = args.slice(2).join(" ");
        let arr = [];
        let arr2 = [];
        if (!zaman) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (!kazanan) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (isNaN(kazanan)) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (!odul) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        let sure = ms(zaman)
        let kalan = Date.now() + sure
        if (message) message.delete();
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("katil").setEmoji("989311021736923147").setStyle(Discord.ButtonStyle.Primary)
        )
        let msg = await message.channel.send({
            embeds: [embed.setTitle(`${odul}`).setFooter({ text: `${kazanan} Kazanan!`, iconURL: client.user.avatarURL({ dynamic: true }) }).setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
              `)], components: [row]
        })
        setTimeout(() => {
            if (arr.length <= 1) {
                if (msg) msg.edit({
                    embeds: [new Discord.EmbedBuilder().setTitle(`${odul}`).setDescription(`
Çekilişe katılım olmadığından çekiliş iptal edildi!
`)], components: []
                })
                return;
            }
            if (arr.length <= kazanan) {
                if (msg) msg.edit({
                    embeds: [new Discord.EmbedBuilder().setTitle(`${odul}`).setDescription(`
Çekilişe katılım olmadığından çekiliş iptal edildi!
`)], components: []
                })
                return;
            }
            for (let i = 0; i < kazanan; i++) {
                let tiklayanlar = arr[Math.floor(Math.random() * arr.length)]
                arr2.push(tiklayanlar);
                message.channel.send({ content: `<@${tiklayanlar}> tebrikler kazandın!` })
            }
            if (msg) msg.edit({
                embeds: [new Discord.EmbedBuilder().setTitle(`${odul}`).setFooter({ text: `${arr.length} katılımcı!`, iconURL: client.user.avatarURL({ dynamic: true }) }).setDescription(`
Çekiliş sonuçlandı! 
Çekilişi Başlatan : ${message.author} 
Kazanan : ${arr2.map(x => `<@${x}>`)}
`)], components: []
            })
        }, sure)

        let collector = await msg.createMessageComponentCollector({})
        collector.on("collect", async (button) => {
            button.deferUpdate(true)
            if (button.customId == "katil") {
                let tikdata = await GiveAways.findOne({ messageID: button.message.id })
                if (tikdata?.katilan.includes(button.member.id)) return;
                await GiveAways.findOneAndUpdate({ messageID: button.message.id }, { $push: { katilan: button.member.id } }, { upsert: true })
                arr.push(button.member.id)
                if (msg) msg.edit({
                    embeds: [new Discord.EmbedBuilder().setTitle(`${odul}`).setFooter({ text: `${kazanan} Kazanan!`, iconURL: client.user.avatarURL({ dynamic: true }) }).setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Katılan kişi sayısı : ${tikdata?.katilan.length + 1 || 1}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
                            `)]
                })
            }
        })
    }
}

module.exports = GiveAway

