
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { talentPerms } = require("../../../../Global/Settings/Schemas")
class TalentPerm extends Command {
    constructor(client) {
        super(client, {
            name: "tp",
            description: "Sunucu içerisi talent perm oluşturmanızı sağlar!",
            usage: "tp <Verilecek Rol> - <Yetkili Rol>",
            category: "Founders",
            aliases: ["talentperm", "talent", "tpp"],
            enabled: true,
        });
    }

    async onLoad(client) {
        client.on("messageCreate", async (message) => {
            if (!message.guild || message.channel.type === "dm") return;
            let data = await talentPerms.find({ guildID: message.guild.id }) || [];
            let ozelkomutlar = data;
            let yazilanKomut = message.content.split(" ")[0];
            let args = message.content.split(" ").slice(1);
            yazilanKomut = yazilanKomut.slice(system.Bot.Prefixs.some(x => x.length));
            let komut = ozelkomutlar.find(x => x.komutAd.toLowerCase() === yazilanKomut);
            if (!komut) return;

            let verilenRol = message.guild.roles.cache.some(rol => komut.verilcekRol.includes(rol.id));
            if (!verilenRol) return;

            let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (message.member.roles.cache.some(rol => komut.YetkiliRol.includes(rol.id)) || message.member.permissions.has(8)) {
                if (!üye) return message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`**UYARI : **Lütfen rol verilecek kişiyi etiketle!`)] }).sil(5)
                if (!komut.verilcekRol.some(rol => üye.roles.cache.has(rol))) {
                    üye.roles.add(komut.verilcekRol)
                    message.react(message.guild.findEmoji(system.Emojis.Onay))
                    message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} Başarılı şekilde ${üye} kişisine ${komut.verilcekRol.map(x => `<@&${x}>`)} rolünü verdim!`)] }).sil(10)
                    message.guild.findChannel("tp-log").send({ content : `${message.author.tag} kişisi ${üye.user.tag} kişisine ${komut.verilcekRol.map(x => `**${message.guild.roles.cache.get(x).name}**`)} rolü verdi!` })
                } else {
                    üye.roles.remove(komut.verilcekRol)
                    message.react(message.guild.findEmoji(system.Emojis.Onay))
                    message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} Başarılı şekilde ${üye} kişisinden ${komut.verilcekRol.map(x => `<@&${x}>`)} rolünü aldım!`)] }).sil(10)
                    message.guild.findChannel("tp-log").send({ content : `${message.author.tag} kişisi ${üye.user.tag} kişisinden ${komut.verilcekRol.map(x => `**${message.guild.roles.cache.get(x).name}**`)} rolünü aldı!` })
                }
            }
        })
    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!ravgar?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!args[0]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir argüman belirtmelisin!`)] }).sil(5)
        if (args[0] === "oluştur" || args[0] === "ekle") {
            let komutAd = args[1];
            if (!komutAd) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bir komut adı belirlemelisin!`)] }).sil(10); let args2 = args.splice(2).join(" ").split(" - "); if (!args2) return message.channel.send({ embeds: [embed.setDescription(`Bir rol ve yetkili rolü belirlemelisin! \`Verilecek Rol - Yetkili Rol\``)] }).sil(5); let roller = args2[0].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", ""))); let yetkiliRol = args2[1].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")));
            let talents = await talentPerms.findOne({ guildID: message.guild.id, komutAd: komutAd });
            if (talents) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu isimde bir komut zaten mevcut!`)] }).sil(10)
            let newData = talentPerms({ guildID: message.guild.id, komutAd: komutAd, verilcekRol: roller, YetkiliRol: yetkiliRol }); newData.save();
            message.channel.send({ embeds: [embed.setDescription(`${message.guild.findEmoji(system.Emojis.Onay)} \`${komutAd}\` adlı komut başarılı bir şekilde oluşturuldu!\n\nVerilecek Rol: ${roller}\nKomut İzni Olan Roller: ${yetkiliRol}`)] });
        } else if (args[0] === "list" || args[0] === "list" || args[0] === "incele" || args[0] === "bilgi") {
            let data = await talentPerms.find({}); let data2 = await talentPerms.findOne({ guildID: message.guild.id, komutAd: args[1] });
            if (!data2) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Lütfen bir komut adı girerek tekrar deneyiniz.\n\n(Komutlar: \`${data.map(x => x.komutAd).join(" - ")}\`) `)] }).sil(10)
            message.channel.send({ embeds: [embed.setDescription(`Komut adı : ${data2.komutAd}\nRol : ${data2.verilcekRol.length > 0 ? data2.verilcekRol.map(x => `<@&${x}>`) : "Her hangi bir rol yok."}\nYetkililer : ${data2.YetkiliRol.length > 0 ? data2.YetkiliRol.map(x => `<@&${x}>`) : "Her hangi bir rol yok."}`)] })
        } else if (args[0] === "sil" || args[0] === "kaldır") {
            let data2 = await talentPerms.findOne({ guildID: message.guild.id, komutAd: args[1] })
            if (!data2) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Hangi komutu silmek istiyorsun?`)] }).sil(20)
            await talentPerms.deleteOne({ guildID: message.guild.id, komutAd: args[1] })
            await message.channel.send(`${message.guild.findEmoji(system.Emojis.Onay)} \`${args[1]}\` isimli komut başarılı bir şekilde silindi!`).sil(20)
        }
    }
}

module.exports = TalentPerm
