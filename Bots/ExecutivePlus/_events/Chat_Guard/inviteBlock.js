const Ravgarcık = require("../../../../Global/Settings/Ravgarcık");
const { Event } = require("../../../../Global/Structures/Default.Events");

class InviteBlock extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }

    async onLoad(message) {

        const inviteEngel = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

        const ravgar = await Ravgarcık.findOne({ guildID: message.guild.id })
        if (ravgar?.chatGuard == true) {
            if (ravgar?.Chat.includes(message.member.id)) return;
            if (message.content.match(inviteEngel)) {
                const invites = await message.guild.invites.fetch();
                if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;
                if (message.deletable) message.delete().catch(err => { })
                message.channel.send({ content: `${message.member} reklam yapman yasak!` }).sil(3)
                if (message.guild.channels.cache.find(x => x.name == "chat-log")) message.guild.findChannel("chat-log").send({
                    embeds: [new Discord.EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 1024 }) }).setThumbnail(message.author.avatarURL()).setDescription(`
Sunucuda bir reklam tespit edildi ve mesaj ${message.deletable ? "başarıyla silindi!" : "malesef silinemedi!"}

Reklamı atan kişi : ${message.member} [${message.author.tag}] (\`${message.member.id}\`)
Reklamın atıldığı kanal : ${message.channel} [${message.channel.name}] (\`${message.channel.id}\`)
Reklam içeriği ;
\`\`\`${message.content}\`\`\`
                `)]
                })
            }

        }
    }
}

module.exports = InviteBlock;