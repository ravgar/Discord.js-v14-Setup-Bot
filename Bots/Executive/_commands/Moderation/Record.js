
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Punitives } = require("../../../../Global/Settings/Schemas");
const table = require('table');
class Sicil extends Command {
    constructor(client) {
        super(client, {
            name: "sicil",
            description: "Sunucu içerisi bir kişinin geçmiş cezalarını görüntelersiniz.",
            usage: "sicil @ravgar/ID ",
            category: "Moderation",
            aliases: ["geçmişcezalar", "cezalar", "sicil"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]);
        if (member) {
            await Punitives.find({ Uye: member.id }).exec(async (err, res) => {
                if (err) return message.channel.send({ content: 'Hata: `Lütfen ravgar#3210 ile iletişime geçin!`' }).sil(20)
                if (!await Punitives.findOne({ Uye: member.id })) return message.channel.send({ content: `${member} kullanıcısının ceza bilgisi bulunmuyor.` }).sil(20);
                let data = [["ID", "🔵", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]];
                data = data.concat(res.map(value => {
                    return [
                        `#${value.No}`,
                        `${value.Aktif == true ? "✅" : "❌"}`,
                        `${tarihsel(value.Tarih)}`,
                        `${value.Tip}`,
                        `${value.Sebep}`
                    ]
                }));
                let veriler = table.table(data, {
                    columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
                    border: table.getBorderCharacters(`void`),
                    drawHorizontalLine: function (index, size) {
                        return index === 0 || index === 1 || index === size;
                    }
                });
                const row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder().setCustomId("docs").setLabel("📥").setStyle(Discord.ButtonStyle.Primary),
                    new Discord.ButtonBuilder().setCustomId("show").setLabel("❔").setStyle(Discord.ButtonStyle.Primary)
                )
                let msg = await message.channel.send({ components: [row], content: `:no_entry_sign: <@${member.id}> kişisinin ceza bilgileri aşağıda belirtilmiştir. Tekli bir cezaya bakmak için \`.sicil ID\` komutunu uygulayınız.\n\`\`\`${veriler}\`\`\`` }).catch(ravgar => {
                    let dosyahazırla;
                    dosyahazırla = new Discord.AttachmentBuilder(Buffer.from(veriler), `${member.id}-cezalar.txt`);
                    message.channel.send({ content: `:no_entry_sign: <@${member.id}> kişisinin cezaları **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim, oradan cezaları kontrol edebilirsin.\nTekli bir cezaya bakmak için \`.sicil ID <ID>\` komutunu uygulayınız.`, files: [dosyahazırla] });
                })

                var filter = (button) => button.user.id === message.member.id;
                let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
                collector.on("collect", async (button) => {
                    if (button.customId == "docs") {
                        if (msg) msg.delete()
                        let dosyahazırla;
                        dosyahazırla = new Discord.AttachmentBuilder(Buffer.from(veriler), `${member.id}-cezalar.txt`)
                        message.channel.send({ content: `<@${member.id}> kullanıcısının toplam **${res.length}** cezası aşağıdaki belgede yer almaktadır.`, files: [dosyahazırla] })
                    }
                    if (button.customId == "show") {
                        if (msg) msg.delete()
                        let cezaPuan = await client.puniPu(member.id)
                        message.channel.send({ content: `<@${member.id}> kullanıcısının **${cezaPuan}** ceza puanı bulunmakta. (${cezaPuan >= 50 ? `${message.guild.findEmoji(system.Emojis.Iptal)} \`Risk durumu baya yüksek\`` : `${message.guild.findEmoji(system.Emojis.Onay)} \`Risk durumu bulunamadı\``})` }).sil(100)
                    }
                })
            })
        } else
        if (["id", "ıd", "ID", "İD"].some(x => args[0] == x)) {
            if (!Number(args[1])) return message.channel.send({ content: `\`Lütfen kontrol edebilmem için bir ceza numarası gir.\`` })
            await Punitives.findOne({ No: args[1] }, async (err, res) => {
                if (!res) return message.channel.send({ content: `Belirttiğin \`#${args[1]}\` numaralı ceza bilgisi bulunamadı.` }).sil(20)
                if (err) return message.channel.send({ content: 'Hata: Bazı hatalar oluştu \`ravgar#3210\` ile iletişime geçin!' }).sil(20)
                // Cezalanan Üye
                let cezalanan = await client.getUser(res.Uye);
                let cezalananbilgi;
                if (cezalanan != `\`Bulunamayan Üye\`` && cezalanan.username) cezalananbilgi = `${cezalanan} (\`${cezalanan.id}\`)`;
                if (!cezalananbilgi) cezalananbilgi = "<@" + res.Cezalanan + ">" + `(\`${res.Cezalanan}\`)`
                // Ceza Veren Üye
                let yetkili = await client.getUser(res.Yetkili);
                let yetkilibilgi;
                if (yetkili != `\`Bulunamayan Üye\`` && yetkili.username) yetkilibilgi = `${yetkili} (\`${yetkili.id}\`)`;
                if (!yetkilibilgi) yetkilibilgi = "Bilinmiyor"
                // Manuel Komut İle Kaldırıldıysa
                let kaldırılmadurumu;
                if (!res.Kaldiran) kaldırılmadurumu = ``
                if (res.Kaldiran) kaldırılmadurumu = "• Ceza'yı Kaldıran: " + `${await client.getUser(res.Kaldiran) ? message.guild.members.cache.get(res.Kaldiran) ? message.guild.members.cache.get(res.Kaldiran) : `<@${res.Kaldiran}> (\`${res.Kaldiran}\`)` : `<@${res.Kaldiran}> (\`${res.Kaldiran}\`)`}`
                message.channel.send({
                    embeds: [embed.setDescription(`**Ceza Detayı** (\`#${res.No}/${res.Tip}\`)
• Üye Bilgisi: ${cezalanan}
• Yetkili Bilgisi: ${yetkili}
• Ceza Tarihi: \`${tarihsel(res.Tarih)}\`
• Ceza Süresi: \`${res.AtilanSure ? res.AtilanSure : "Kalıcı"}\`
• Ceza Durumu: \`${res.Aktif == true ? "Aktif ✅" : "Aktif Değil ❌"}\`
${kaldırılmadurumu}`).setFooter({ text: "Created © by Ravgar." + ` • Ceza Numarası #${res.No}`, iconURL: client.user.avatarURL({ dynamic: true }) })
                        .addFields([
                            { name: `Ceza Sebebi`, value: `\`${res.Sebep}\`` }
                        ])]
                })
            })
        }
    }
}

module.exports = Sicil
