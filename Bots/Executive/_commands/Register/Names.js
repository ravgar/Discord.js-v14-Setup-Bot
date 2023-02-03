
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas")
class Names extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
            description: "Sunucu içerisi bir üyenin isim geçmişini görmenizi sağlar.",
            usage: "isimler @ravgar/ID",
            category: "Register",
            aliases: ["isimler", "names"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!ravgar?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}isimler <@ravgar/ID>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.SAuth }).sil(20)
        let silb = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("isimsil").setLabel("İsimleri Sil!").setStyle(Discord.ButtonStyle.Primary).setDisabled(true)
        )
        if (ravgar?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) || message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) { silb.components[0].setDisabled(false) } 
        let isimveri = await User.findOne({ userID: member.id }) || [];
        if (isimveri.Names) {
            let isimler = isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${ravgar?.tags[0]} ${value.Name}\` (${value.ProInf}) ${value.Author ? "(<@" + value.Author + ">)" : ""}`).join("\n") : "";
            let sil = await message.channel.send({
                components: [silb], 
                embeds:
                    [embed.setDescription(`
${member} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n${isimler}`)]
            });
        } else {
            message.channel.send({ content : `${message.guild.findEmoji(system.Emojis.Iptal)} Üyenin isim geçmişi bulunamadı!` })
        }
    }
}

module.exports = Names