
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Punitives } = require("../../../../Global/Settings/Schemas");
class Unban extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "Sunucuda yasaklı bir kişinin yasağını kaldırmanızı sağlar.",
            usage: "unban @ravgar/ID ",
            category: "Moderation",
            aliases: ["unban", "yargıkaldır"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        //if (!ravgar?.mutedRole || !ravgar?.vmutedRole || !ravgar?.muteHammer.length <= 0) return message.channel.send({ content: system.Replys.Data }).sil(20) 
        if (!ravgar?.banHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}unban <@ravgar/ID>\`` }).sil(20)

        if (!ravgar?.underWorldSystem) {
            await Punitives.findOne({ Uye: member.id, Tip: "Yasaklanma", Aktif: true }).exec(async (err, res) => {
                message.guild.bans.fetch().then(async (yasaklar) => {
                    if (yasaklar.size == 0) return message.channel.send({ content: `\`Hata:\` Sunucuya ait herhangi bir ban yok!` })
                    let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == member.id)
                    if (!yasakliuye) return message.channel.send({ content: `\`Belirtilen Üye Yasaklı Değil!\` lütfen geçerli bir yasaklama giriniz.` });
                    if (res) {
                        if (res.Yetkili !== message.author.id && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ embeds: [embed.setDescription(`${res.Yetkili ? `${message.guild.members.cache.get(res.Yetkili)} (\`${res.Yetkili}\`)` : `${res.Yetkili}`} tarafından cezalandırılmış, senin bu cezalandırmayı açman münkün gözükmüyor.`)] });
                    }
                    if (res) await Punitives.updateOne({ No: res.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id } }, { upsert: true }).exec();
                    await message.guild.members.unban(member.id);
                    await message.guild.channels.cache.find(x => x.name == "ban-log").send({ embeds: [embed.setDescription(`${member} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından kaldırıldı.`)] })
                    await message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Tag)} ${member} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} yasaklaması kaldırıldı!` });
                    message.react(message.guild.findEmoji(system.Emojis.Onay))
                })
            })
        } else {
            await Punitives.findOne({ Uye: member.id, Tip: "Yasaklanma", Aktif: true }).exec(async (err, res) => {
                if (!member.roles.cache.has(ravgar?.underWorld)) return message.channel.send({ content: `\`Belirtilen Üye Yasaklı Değil!\` lütfen geçerli bir yasaklama giriniz.` });
                if (res) {
                    if (res.Yetkili !== message.author.id && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ embeds: [embed.setDescription(`${res.Yetkili ? `${message.guild.members.cache.get(res.Yetkili)} (\`${res.Yetkili}\`)` : `${res.Yetkili}`} tarafından cezalandırılmış, senin bu cezalandırmayı açman münkün gözükmüyor.`)] });
                }
                if (res) await Punitives.updateOne({ No: res.No }, { $set: { "Aktif": false, Bitis: Date.now(), Kaldiran: message.member.id } }, { upsert: true }).exec();
                await member.setRoles(ravgar?.kayıtsızRolleri)
                await message.guild.channels.cache.find(x => x.name == "ban-log").send({ embeds: [embed.setDescription(`${member} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından kaldırıldı.`)] })
                await message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Banned)} ${member} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} yasaklaması kaldırıldı!` });
                message.react(message.guild.findEmoji(system.Emojis.Onay))
            })
        }
    }
}

module.exports = Unban