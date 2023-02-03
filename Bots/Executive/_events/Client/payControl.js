const { Event } = require("../../../../Global/Structures/Default.Events");
const children = require("child_process");

class PayControl extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID })

        setInterval(async () => {
            if (ravgar?.payDay && ravgar?.payDay + 2629800000 == Date.now()) {
                const row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder().setCustomId("oyapildi").setLabel("✅ Ödeme Yapıldı!").setStyle(Discord.ButtonStyle.Success),
                    new Discord.ButtonBuilder().setCustomId("oyapilmadi").setLabel("❌ Ödeme Yapılmadı!").setStyle(Discord.ButtonStyle.Danger)
                )
                let odeme = await client.members.cache.get("311517508601380865").send({ components: [row], content: `${client.guilds.cache.get(system.Guild.ID).name} sunucusunun ödeme günü geldi ödemesini kontrol edin!` }).catch(err => { console.log("ravgar beye mesaj yollanamadı!" )})
                client.members.cache.get(client.guilds.cache.get(system.Guild.ID).ownerId).send({ content: `${client.guilds.cache.get(system.Guild.ID).name} sunucunuzda ödeme gününüz geldi! Bu ödemeyi yaptıysanız mesajı dikkate almayın. Eğer yapmadıysanız botunuz kapatılacaktır!` }).catch(err => { contole.log("Sunucu sahibine ödeme bilgi mesajı gönderilemedi!") })
                let collector = await odeme.createMessageComponentCollector({ })
        
                collector.on("collect", async (button) => {
                    button.deferUpdate(true)
                    if (button.customId == "oyapildi") {
                        if (odeme) odeme.edit({ content: `Tebrikler! Başarılı şekilde **${client.guilds.cache.get(system.Guild.ID).name}** sunucusunun ödemesini onayladınız! Botlar hız kesmeden işlemlerine devam edecek!`, components: [] })
                    }
                    if (button.customId == "oyapilmadi") {
                        if (odeme) odeme.edit({ content: `**${client.guilds.cache.get(system.Guild.ID).name}** sunucusunun ödemesini iptal ettiniz. Sunucu ownerına eğer mesaj gönderilebiliyorsam gönderip botları devredışı bırakacağım!`, components: [] })
                        client.members.cache.get(client.guilds.cache.get(system.Guild.ID).ownerId).send({ content: `${client.guilds.cache.get(system.Guild.ID).name} sunucunuzun aylık ödemesinin yapılmadığı gözlemlenmiştir. Detaylı bilgi için \`ravgar#3210\` ulaşabilirsin!` }).catch(err => { contole.log("Sunucu sahibine ödeme bilgi mesajı gönderilemedi!") })
                        children.exec(`pm2 restart all`);
                    }
                })
            }
        }, 1000 * 60 * 60 * 24 * 1);
    }
}

module.exports = PayControl;
