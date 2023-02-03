
const { Command } = require("../../../../Global/Structures/Default.Commands");
class RoleDetail extends Command {
    constructor(client) {
        super(client, {
            name: "roldenetim",
            description: "Sunucu içerisi bir rolün detayını verir.",
            usage: "roldenetim <Rol/ID>",
            category: "Misc",
            aliases: ["roldenetim", "rolbilgi", "rb"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.channel.send({ content: `${cevaplar.prefix} \`Rol Belitrilmedi!\` Lütfen bir rol etiketleyin veya IDsini girin.` + ` \`${sistem.prefixs[0]}${module.exports.Isim} <Rol ID>\`` });
        let members = role.members.array();
        let sesteOlmayanlar = members.filter(member => !member.voice.channelID);
        let sesteOlanlar = members.filter(member => member.voice.channel);
        message.channel.send("Rol Bilgisi : " + role.name + " | " + role.id + " | " + role.members.size + " Toplam Üye | " + sesteOlmayanlar.length + " Seste Olmayan Üye", { code: "fix", split: true });
        if (sesteOlanlar.length >= 1) message.channel.send({ embeds: [embed.setDescription(`\`${role.name}\` isimli rolde seste bulunan üyeleri aşağı sıraladım kopyalarak etiket atabilirsin veya profillerini görebilirsin.\n\`\`\`${sesteOlanlar.join(`, `)}\`\`\``)] }).catch(ravgarc => {
            let dosyahazırla = new MessageAttachment(Buffer.from(sesteOlanlar.slice().join(`\n`)), `${role.id}-sesteolanlar.txt`);
            message.channel.send(`:no_entry_sign: ${role.name} isimli rolün __seste olanları__ **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim.`, dosyahazırla)
        });
        if (sesteOlmayanlar.length >= 1) message.channel.send(`${sesteOlmayanlar.slice(0, sesteOlmayanlar.length / 1).join(`, `)}`, { code: "diff", split: true }).catch(ravgarc => {
            let dosyahazırla = new MessageAttachment(Buffer.from(sesteOlmayanlar.slice().join(`\n`)), `${role.id}-sesteolmayanlar.txt`);
            message.channel.send(`:no_entry_sign: ${role.name} isimli rolün __seste olmayanları__ **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim.`, dosyahazırla)
        });

    }
}

module.exports = RoleDetail
